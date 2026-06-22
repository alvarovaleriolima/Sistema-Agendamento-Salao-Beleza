package com.salao.agendamento.service;

import com.salao.agendamento.entity.Agendamento;
import com.salao.agendamento.entity.Cliente;
import com.salao.agendamento.entity.Funcionario;
import com.salao.agendamento.entity.Notificacao;
import com.salao.agendamento.entity.Servico;
import com.salao.agendamento.enums.CanalNotificacao;
import com.salao.agendamento.enums.TipoNotificacao;
import com.salao.agendamento.repository.NotificacaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

public class NotificacaoServiceTest {

    private NotificacaoRepository repository;
    private NotificacaoService service;

    @BeforeEach
    public void setup() {
        repository = mock(NotificacaoRepository.class);
        service = new NotificacaoService(repository);
    }

    @Test
    public void testEnviarConfirmacaoCriacao() {
        Agendamento a = criarAgendamentoFicticio();

        service.enviarConfirmacaoCriacao(a);

        ArgumentCaptor<Notificacao> captor = ArgumentCaptor.forClass(Notificacao.class);
        verify(repository, times(1)).save(captor.capture());

        Notificacao salva = captor.getValue();
        assertEquals(TipoNotificacao.CONFIRMACAO, salva.getTipoNotificacao());
        assertEquals(CanalNotificacao.WHATSAPP, salva.getCanalEnvio());
        assertTrue(salva.getMensagem().contains("foi confirmado para o dia"));
    }

    @Test
    public void testEnviarCancelamento() {
        Agendamento a = criarAgendamentoFicticio();

        service.enviarCancelamento(a);

        ArgumentCaptor<Notificacao> captor = ArgumentCaptor.forClass(Notificacao.class);
        verify(repository, times(1)).save(captor.capture());

        Notificacao salva = captor.getValue();
        assertEquals(TipoNotificacao.CANCELAMENTO, salva.getTipoNotificacao());
        assertEquals(CanalNotificacao.EMAIL, salva.getCanalEnvio());
        assertTrue(salva.getMensagem().contains("foi CANCELADO"));
    }

    private Agendamento criarAgendamentoFicticio() {
        Cliente c = new Cliente();
        c.setNomeCompleto("João Cliente");

        Servico s = new Servico();
        s.setNome("Corte");

        Funcionario f = new Funcionario();
        f.setNomeCompleto("Pedro Profissional");

        Agendamento a = new Agendamento();
        a.setCliente(c);
        a.setServico(s);
        a.setFuncionario(f);
        a.setDataHora(LocalDateTime.of(2030, 10, 10, 14, 30));

        return a;
    }
}
