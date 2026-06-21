package com.salao.agendamento.service;

import com.salao.agendamento.dto.ServicoRequestDTO;
import com.salao.agendamento.dto.ServicoResponseDTO;
import com.salao.agendamento.entity.Agendamento;
import com.salao.agendamento.entity.Servico;
import com.salao.agendamento.enums.Status;
import com.salao.agendamento.enums.StatusAgendamento;
import com.salao.agendamento.exception.NegocioException;
import com.salao.agendamento.exception.RecursoNaoEncontradoException;
import com.salao.agendamento.repository.AgendamentoRepository;
import com.salao.agendamento.repository.ServicoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ServicoService {

    private final ServicoRepository repository;
private final AgendamentoRepository agendamentoRepository;
private final AgendamentoCancelamentoService agendamentoCancelamentoService;

public ServicoService(ServicoRepository repository,
                      AgendamentoRepository agendamentoRepository,
                      AgendamentoCancelamentoService agendamentoCancelamentoService) {
    this.repository = repository;
    this.agendamentoRepository = agendamentoRepository;
    this.agendamentoCancelamentoService = agendamentoCancelamentoService;
}

    @Transactional
    public ServicoResponseDTO criar(ServicoRequestDTO dto) {
        Servico s = new Servico();
        s.setNome(dto.getNome());
        s.setDescricao(dto.getDescricao());
        s.setPreco(dto.getPreco());
        s.setDuracaoMinutos(dto.getDuracaoMinutos());
        s.setStatus(dto.getStatus());
        return ServicoResponseDTO.fromEntity(repository.save(s));
    }

    public List<ServicoResponseDTO> listarTodos() {
        return repository.findAll().stream().map(ServicoResponseDTO::fromEntity).toList();
    }

    public List<ServicoResponseDTO> listarAtivos() {
        return repository.findByStatus(Status.ATIVO).stream().map(ServicoResponseDTO::fromEntity).toList();
    }

    public ServicoResponseDTO buscarPorId(Long id) {
        return ServicoResponseDTO.fromEntity(getOrThrow(id));
    }

    @Transactional
    public ServicoResponseDTO editar(Long id, ServicoRequestDTO dto) {
        Servico s = getOrThrow(id);
        s.setNome(dto.getNome());
        s.setDescricao(dto.getDescricao());
        s.setPreco(dto.getPreco());
        s.setDuracaoMinutos(dto.getDuracaoMinutos());
        s.setStatus(dto.getStatus());
        return ServicoResponseDTO.fromEntity(repository.save(s));
    }

    @Transactional
    public void inativar(Long id) {
        Servico s = getOrThrow(id);
        if (s.getStatus() == Status.INATIVO) throw new NegocioException("Serviço já está inativo.");

        // Cancel future agendamentos and send notifications
        LocalDateTime agora = LocalDateTime.now();
        List<Agendamento> futuros = agendamentoRepository.findByServicoAndDataHoraAfterAndStatus(s, agora, StatusAgendamento.AGENDADO);
        for (Agendamento a : futuros) {
            agendamentoCancelamentoService.cancelar(a.getId());
        }

        s.setStatus(Status.INATIVO);
        repository.save(s);
    }

    public Servico getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Serviço #" + id + " não encontrado."));
    }
}
