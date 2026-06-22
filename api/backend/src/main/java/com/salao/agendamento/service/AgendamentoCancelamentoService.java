package com.salao.agendamento.service;

import com.salao.agendamento.entity.Agendamento;
import com.salao.agendamento.entity.Cliente;
import com.salao.agendamento.entity.Funcionario;
import com.salao.agendamento.entity.Servico;
import com.salao.agendamento.enums.StatusAgendamento;
import com.salao.agendamento.exception.NegocioException;
import com.salao.agendamento.exception.RecursoNaoEncontradoException;
import com.salao.agendamento.repository.AgendamentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class AgendamentoCancelamentoService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    private final AgendamentoRepository repository;
    private final NotificacaoService notificacaoService;

    public AgendamentoCancelamentoService(AgendamentoRepository repository, NotificacaoService notificacaoService) {
        this.repository = repository;
        this.notificacaoService = notificacaoService;
    }

    @Transactional
    public void cancelar(Long id) {
        Agendamento a = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agendamento #" + id + " não encontrado."));
        if (a.getStatus() == StatusAgendamento.CANCELADO) throw new NegocioException("Agendamento já está cancelado.");
        a.setStatus(StatusAgendamento.CANCELADO);
        Agendamento saved = repository.save(a);
        
        notificacaoService.enviarCancelamento(saved);
    }
}