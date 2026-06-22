package com.salao.agendamento.service;

import com.salao.agendamento.entity.Agendamento;
import com.salao.agendamento.entity.Notificacao;
import com.salao.agendamento.enums.CanalNotificacao;
import com.salao.agendamento.enums.TipoNotificacao;
import com.salao.agendamento.repository.NotificacaoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class NotificacaoService {

    private static final Logger logger = LoggerFactory.getLogger(NotificacaoService.class);
    private final NotificacaoRepository notificacaoRepository;

    public NotificacaoService(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
    }

    public void enviarConfirmacaoCriacao(Agendamento agendamento) {
        String msg = String.format("Olá %s! Seu agendamento para %s com %s foi confirmado para o dia %s às %s.",
                agendamento.getCliente().getNomeCompleto(),
                agendamento.getServico().getNome(),
                agendamento.getFuncionario().getNomeCompleto(),
                agendamento.getDataHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                agendamento.getDataHora().format(DateTimeFormatter.ofPattern("HH:mm")));

        salvarELogarNotificacao(agendamento, TipoNotificacao.CONFIRMACAO, CanalNotificacao.WHATSAPP, msg);
    }

    public void enviarConfirmacaoReagendamento(Agendamento agendamento) {
        String msg = String.format("Olá %s! Seu agendamento foi REAGENDADO para %s com %s no dia %s às %s.",
                agendamento.getCliente().getNomeCompleto(),
                agendamento.getServico().getNome(),
                agendamento.getFuncionario().getNomeCompleto(),
                agendamento.getDataHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                agendamento.getDataHora().format(DateTimeFormatter.ofPattern("HH:mm")));

        salvarELogarNotificacao(agendamento, TipoNotificacao.REAGENDAMENTO, CanalNotificacao.WHATSAPP, msg);
    }

    public void enviarCancelamento(Agendamento agendamento) {
        String msg = String.format("Olá %s! Seu agendamento para %s no dia %s foi CANCELADO.",
                agendamento.getCliente().getNomeCompleto(),
                agendamento.getServico().getNome(),
                agendamento.getDataHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

        salvarELogarNotificacao(agendamento, TipoNotificacao.CANCELAMENTO, CanalNotificacao.EMAIL, msg);
    }

    private void salvarELogarNotificacao(Agendamento agendamento, TipoNotificacao tipo, CanalNotificacao canal, String mensagem) {
        Notificacao notificacao = new Notificacao(agendamento, tipo, canal, mensagem);
        notificacaoRepository.save(notificacao);
        
        // Simulação do envio (RPA Mock)
        logger.info("================ SIMULAÇÃO DE NOTIFICAÇÃO ================");
        logger.info("TIPO: {}", tipo);
        logger.info("CANAL: {}", canal);
        logger.info("CLIENTE: {}", agendamento.getCliente().getNomeCompleto());
        logger.info("MENSAGEM: {}", mensagem);
        logger.info("==========================================================");
    }
}
