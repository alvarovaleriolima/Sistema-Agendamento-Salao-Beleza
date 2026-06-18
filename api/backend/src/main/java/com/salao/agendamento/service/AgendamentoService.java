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

    public AgendamentoService(AgendamentoRepository repository,
                              ClienteService clienteService,
                              FuncionarioService funcionarioService,
                              ServicoService servicoService) {
        this.repository = repository;
        this.clienteService = clienteService;
        this.funcionarioService = funcionarioService;
        this.servicoService = servicoService;
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

        return AgendamentoResponseDTO.fromEntity(repository.save(a));
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

        if (dto.getDataHora() != null && !dto.getDataHora().isBlank()) {
            LocalDateTime nova = parseDataHora(dto.getDataHora());
            if (nova.isBefore(LocalDateTime.now())) throw new NegocioException("Data e hora devem ser no futuro.");
            a.setDataHora(nova);
        }
        if (dto.getStatus() != null) a.setStatus(dto.getStatus());
        if (dto.getObservacao() != null) a.setObservacao(dto.getObservacao());

        return AgendamentoResponseDTO.fromEntity(repository.save(a));
    }

    @Transactional
    public void cancelar(Long id) {
        Agendamento a = getOrThrow(id);
        if (a.getStatus() == StatusAgendamento.CANCELADO) throw new NegocioException("Agendamento já está cancelado.");
        a.setStatus(StatusAgendamento.CANCELADO);
        repository.save(a);
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
