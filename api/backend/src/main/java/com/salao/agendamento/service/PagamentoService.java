package com.salao.agendamento.service;

import com.salao.agendamento.dto.PagamentoRequestDTO;
import com.salao.agendamento.dto.PagamentoResponseDTO;
import com.salao.agendamento.entity.Cliente;
import com.salao.agendamento.entity.Pagamento;
import com.salao.agendamento.entity.Agendamento;
import com.salao.agendamento.enums.FormaPagamento;
import com.salao.agendamento.enums.StatusPagamento;
import com.salao.agendamento.exception.NegocioException;
import com.salao.agendamento.exception.RecursoNaoEncontradoException;
import com.salao.agendamento.repository.AgendamentoRepository;
import com.salao.agendamento.repository.ClienteRepository;
import com.salao.agendamento.repository.PagamentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PagamentoService {

    private final PagamentoRepository repository;
    private final ClienteRepository clienteRepository;
    private final AgendamentoRepository agendamentoRepository;

    public PagamentoService(PagamentoRepository repository,
                            ClienteRepository clienteRepository,
                            AgendamentoRepository agendamentoRepository) {
        this.repository = repository;
        this.clienteRepository = clienteRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    @Transactional
    public PagamentoResponseDTO criar(PagamentoRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado com id: " + dto.getClienteId()));
        Agendamento agendamento = agendamentoRepository.findById(dto.getAgendamentoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agendamento não encontrado com id: " + dto.getAgendamentoId()));

        // Verify that the agendamento belongs to the cliente
        if (!agendamento.getCliente().equals(cliente)) {
            throw new NegocioException("O agendamento não pertence ao cliente informado.");
        }

        // Validate that if status is PAGO, dataPagamento and formaPagamento must be provided
        if (dto.getStatus() == StatusPagamento.PAGO) {
            if (dto.getDataPagamento() == null) {
                throw new NegocioException("Data de pagamento é obrigatória quando o status é PAGO.");
            }
            if (dto.getFormaPagamento() == null) {
                throw new NegocioException("Forma de pagamento é obrigatória quando o status é PAGO.");
            }
        }

        Pagamento p = new Pagamento();
        p.setCliente(cliente);
        p.setAgendamento(agendamento);
        p.setDataPagamento(dto.getDataPagamento());
        p.setValor(dto.getValor());
        p.setFormaPagamento(dto.getFormaPagamento());
        p.setStatus(dto.getStatus());

        return PagamentoResponseDTO.fromEntity(repository.save(p));
    }

    public List<PagamentoResponseDTO> listarTodos() {
        return repository.findAll().stream().map(PagamentoResponseDTO::fromEntity).toList();
    }

    public List<PagamentoResponseDTO> listarPorCliente(Long clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado com id: " + clienteId));
        return repository.findByCliente(cliente).stream().map(PagamentoResponseDTO::fromEntity).toList();
    }

    public List<PagamentoResponseDTO> listarPorAgendamento(Long agendamentoId) {
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agendamento não encontrado com id: " + agendamentoId));
        return repository.findByAgendamento(agendamento).stream().map(PagamentoResponseDTO::fromEntity).toList();
    }

    public List<PagamentoResponseDTO> listarPorStatus(StatusPagamento status) {
        return repository.findByStatus(status).stream().map(PagamentoResponseDTO::fromEntity).toList();
    }

    @Transactional
    public PagamentoResponseDTO atualizar(Long id, PagamentoRequestDTO dto) {
        Pagamento p = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pagamento não encontrado com id: " + id));

        if (dto.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado com id: " + dto.getClienteId()));
            p.setCliente(cliente);
        }
        if (dto.getAgendamentoId() != null) {
            Agendamento agendamento = agendamentoRepository.findById(dto.getAgendamentoId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Agendamento não encontrado com id: " + dto.getAgendamentoId()));
            p.setAgendamento(agendamento);
        }
        if (dto.getDataPagamento() != null) p.setDataPagamento(dto.getDataPagamento());
        if (dto.getValor() != null) {
            if (dto.getValor().compareTo(BigDecimal.ZERO) < 0) {
                throw new NegocioException("Valor não pode ser negativo.");
            }
            p.setValor(dto.getValor());
        }
        if (dto.getFormaPagamento() != null) p.setFormaPagamento(dto.getFormaPagamento());
        if (dto.getStatus() != null) p.setStatus(dto.getStatus());

        // Additional validation: if status is being set to PAGO, ensure dataPagamento and formaPagamento are present
        if (p.getStatus() == StatusPagamento.PAGO) {
            if (p.getDataPagamento() == null) {
                throw new NegocioException("Data de pagamento é obrigatória quando o status é PAGO.");
            }
            if (p.getFormaPagamento() == null) {
                throw new NegocioException("Forma de pagamento é obrigatória quando o status é PAGO.");
            }
            
            // AUTOMATION: If payment is complete, set Agendamento to CONCLUIDO
            if (p.getAgendamento().getStatus() == com.salao.agendamento.enums.StatusAgendamento.AGENDADO) {
                p.getAgendamento().setStatus(com.salao.agendamento.enums.StatusAgendamento.CONCLUIDO);
                agendamentoRepository.save(p.getAgendamento());
            }
        }

        return PagamentoResponseDTO.fromEntity(repository.save(p));
    }

    @Transactional
    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Pagamento não encontrado com id: " + id);
        }
        repository.deleteById(id);
    }

    /**
     * Creates a pending payment for the given agendamento.
     * This is called when an agendamento is created.
     */
    @Transactional
    public PagamentoResponseDTO criarPagamentoPendente(Agendamento agendamento) {
        Pagamento p = new Pagamento();
        p.setCliente(agendamento.getCliente());
        p.setAgendamento(agendamento);
        p.setValor(agendamento.getServico().getPreco());
        p.setStatus(StatusPagamento.PENDENTE);
        // dataPagamento and formaPagamento remain null
        return PagamentoResponseDTO.fromEntity(repository.save(p));
    }
}
