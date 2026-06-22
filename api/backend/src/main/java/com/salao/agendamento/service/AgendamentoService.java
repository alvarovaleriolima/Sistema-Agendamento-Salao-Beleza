package com.salao.agendamento.service;

import com.salao.agendamento.dto.AgendamentoRequestDTO;
import com.salao.agendamento.dto.AgendamentoResponseDTO;
import com.salao.agendamento.dto.AgendamentoUpdateDTO;
import com.salao.agendamento.entity.Agendamento;
import com.salao.agendamento.entity.Cliente;
import com.salao.agendamento.entity.Funcionario;
import com.salao.agendamento.entity.Servico;
import com.salao.agendamento.enums.PerfilFuncionario;
import com.salao.agendamento.enums.Status;
import com.salao.agendamento.enums.StatusAgendamento;
import com.salao.agendamento.exception.NegocioException;
import com.salao.agendamento.exception.RecursoNaoEncontradoException;
import com.salao.agendamento.repository.AgendamentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
public class AgendamentoService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final AgendamentoRepository repository;
    private final ClienteService clienteService;
    private final FuncionarioService funcionarioService;
    private final ServicoService servicoService;
    private final PagamentoService pagamentoService;
    private final NotificacaoService notificacaoService;

    public AgendamentoService(AgendamentoRepository repository,
                              ClienteService clienteService,
                              FuncionarioService funcionarioService,
                              ServicoService servicoService,
                              PagamentoService pagamentoService,
                              NotificacaoService notificacaoService) {
        this.repository = repository;
        this.clienteService = clienteService;
        this.funcionarioService = funcionarioService;
        this.servicoService = servicoService;
        this.pagamentoService = pagamentoService;
        this.notificacaoService = notificacaoService;
    }

    @Transactional
    public AgendamentoResponseDTO criar(AgendamentoRequestDTO dto) {
        Cliente cliente = clienteService.getOrThrow(dto.getClienteLogin());
        if (cliente.getStatus() == Status.INATIVO) throw new NegocioException("Cliente está inativo.");

        Funcionario funcionario = funcionarioService.getOrThrow(dto.getFuncionarioLogin());
        if (funcionario.getStatus() == Status.INATIVO) throw new NegocioException("Funcionário está inativo.");
        if (funcionario.getPerfil() != PerfilFuncionario.PROFISSIONAL) throw new NegocioException("Funcionário não é um profissional.");

        Servico servico = servicoService.getOrThrow(dto.getServicoId());
        if (servico.getStatus() == Status.INATIVO) throw new NegocioException("Serviço está inativo.");

        LocalDateTime dataHora = parseDataHora(dto.getDataHora());
        if (dataHora.isBefore(LocalDateTime.now())) throw new NegocioException("Data e hora devem ser no futuro.");

        Agendamento a = new Agendamento();
        a.setCliente(cliente);
        a.setFuncionario(funcionario);
        a.setServico(servico);
        a.setDataHora(dataHora);
        a.setStatus(StatusAgendamento.AGENDADO);
        a.setObservacao(dto.getObservacao());

        Agendamento saved = repository.save(a);

        // Create pending payment for this agendamento
        pagamentoService.criarPagamentoPendente(saved);

        // Enviar notificação de criação
        notificacaoService.enviarConfirmacaoCriacao(saved);

        return AgendamentoResponseDTO.fromEntity(saved);
    }

    public List<AgendamentoResponseDTO> listarTodos() {
        return repository.findAllByOrderByDataHoraDesc()
                .stream().map(AgendamentoResponseDTO::fromEntity).toList();
    }

    public List<AgendamentoResponseDTO> listarPorStatus(StatusAgendamento status) {
        return repository.findByStatusOrderByDataHoraDesc(status)
                .stream().map(AgendamentoResponseDTO::fromEntity).toList();
    }

    @Transactional
    public AgendamentoResponseDTO editar(Long id, AgendamentoUpdateDTO dto) {
        Agendamento a = getOrThrow(id);
        if (a.getStatus() == StatusAgendamento.CANCELADO) throw new NegocioException("Não é possível editar um agendamento cancelado.");

        boolean mudouDataHora = false;
        if (dto.getDataHora() != null && !dto.getDataHora().isBlank()) {
            LocalDateTime nova = parseDataHora(dto.getDataHora());
            if (nova.isBefore(LocalDateTime.now())) throw new NegocioException("Data e hora devem ser no futuro.");
            if (!nova.equals(a.getDataHora())) {
                a.setDataHora(nova);
                mudouDataHora = true;
            }
        }
        boolean cancelado = false;
        if (dto.getStatus() != null && dto.getStatus() != a.getStatus()) {
            a.setStatus(dto.getStatus());
            if (dto.getStatus() == StatusAgendamento.CANCELADO) {
                cancelado = true;
            }
            
            // Automaticamente aprovar pagamento quando concluído
            if (dto.getStatus() == StatusAgendamento.CONCLUIDO) {
                List<com.salao.agendamento.dto.PagamentoResponseDTO> pags = pagamentoService.listarPorAgendamento(a.getId());
                for (com.salao.agendamento.dto.PagamentoResponseDTO p : pags) {
                    if (p.getStatus() == com.salao.agendamento.enums.StatusPagamento.PENDENTE) {
                        com.salao.agendamento.dto.PagamentoRequestDTO pReq = new com.salao.agendamento.dto.PagamentoRequestDTO();
                        pReq.setStatus(com.salao.agendamento.enums.StatusPagamento.PAGO);
                        pReq.setDataPagamento(java.time.LocalDate.now());
                        pReq.setFormaPagamento(com.salao.agendamento.enums.FormaPagamento.DINHEIRO);
                        pagamentoService.atualizar(p.getId(), pReq);
                    }
                }
            }
        }
        if (dto.getObservacao() != null) a.setObservacao(dto.getObservacao());

        Agendamento updated = repository.save(a);

        if (cancelado) {
            notificacaoService.enviarCancelamento(updated);
        } else if (mudouDataHora) {
            notificacaoService.enviarConfirmacaoReagendamento(updated);
        }

        return AgendamentoResponseDTO.fromEntity(updated);
    }

    private Agendamento getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agendamento #" + id + " não encontrado."));
    }

    private LocalDateTime parseDataHora(String dataHora) {
        try {
            return LocalDateTime.parse(dataHora, FMT);
        } catch (DateTimeParseException e) {
            throw new NegocioException("Data/hora inválida. Use DD/MM/AAAA HH:MM.");
        }
    }
}