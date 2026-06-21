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
    private final EmailService emailService;

    public AgendamentoCancelamentoService(AgendamentoRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    @Transactional
    public void cancelar(Long id) {
        Agendamento a = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agendamento #" + id + " não encontrado."));
        if (a.getStatus() == StatusAgendamento.CANCELADO) throw new NegocioException("Agendamento já está cancelado.");
        a.setStatus(StatusAgendamento.CANCELADO);
        Agendamento saved = repository.save(a);
        sendCancellationEmail(saved);
    }

    private void sendCancellationEmail(Agendamento agendamento) {
        Cliente cliente = agendamento.getCliente();
        Funcionario funcionario = agendamento.getFuncionario();
        Servico servico = agendamento.getServico();
        LocalDateTime dataHora = agendamento.getDataHora();

        String clientEmail = cliente.getEmail();
        if (clientEmail != null && !clientEmail.isBlank()) {
            emailService.sendCancelationEmail(
                    clientEmail,
                    cliente.getNomeCompleto(),
                    servico.getNome(),
                    funcionario.getNomeCompleto(),
                    dataHora.format(DATE_FMT),
                    dataHora.format(TIME_FMT)
            );
        }
    }
}