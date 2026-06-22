package com.salao.agendamento.entity;

import com.salao.agendamento.enums.CanalNotificacao;
import com.salao.agendamento.enums.TipoNotificacao;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificacoes")
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "agendamento_id", nullable = false)
    private Agendamento agendamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_notificacao", nullable = false)
    private TipoNotificacao tipoNotificacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "canal_envio", nullable = false)
    private CanalNotificacao canalEnvio;

    @Column(name = "data_envio", nullable = false)
    private LocalDateTime dataEnvio;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String mensagem;

    public Notificacao() {
    }

    public Notificacao(Agendamento agendamento, TipoNotificacao tipoNotificacao, CanalNotificacao canalEnvio, String mensagem) {
        this.agendamento = agendamento;
        this.tipoNotificacao = tipoNotificacao;
        this.canalEnvio = canalEnvio;
        this.mensagem = mensagem;
        this.dataEnvio = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Agendamento getAgendamento() {
        return agendamento;
    }

    public void setAgendamento(Agendamento agendamento) {
        this.agendamento = agendamento;
    }

    public TipoNotificacao getTipoNotificacao() {
        return tipoNotificacao;
    }

    public void setTipoNotificacao(TipoNotificacao tipoNotificacao) {
        this.tipoNotificacao = tipoNotificacao;
    }

    public CanalNotificacao getCanalEnvio() {
        return canalEnvio;
    }

    public void setCanalEnvio(CanalNotificacao canalEnvio) {
        this.canalEnvio = canalEnvio;
    }

    public LocalDateTime getDataEnvio() {
        return dataEnvio;
    }

    public void setDataEnvio(LocalDateTime dataEnvio) {
        this.dataEnvio = dataEnvio;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }
}
