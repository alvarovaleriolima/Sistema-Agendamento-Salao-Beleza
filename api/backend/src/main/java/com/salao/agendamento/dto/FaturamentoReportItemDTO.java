package com.salao.agendamento.dto;

import com.salao.agendamento.enums.StatusAgendamento;

import java.time.LocalDateTime;
import java.math.BigDecimal;

public class FaturamentoReportItemDTO {

    private Long agendamentoId;
    private String clienteNome;
    private String servicoNome;
    private String profissionalNome;
    
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime dataHoraAgendamento;
    private BigDecimal valorServico;
    private StatusAgendamento statusAgendamento;

    public FaturamentoReportItemDTO() {
    }

    public FaturamentoReportItemDTO(Long agendamentoId, String clienteNome, String servicoNome,
                                    String profissionalNome, LocalDateTime dataHoraAgendamento,
                                    BigDecimal valorServico, StatusAgendamento statusAgendamento) {
        this.agendamentoId = agendamentoId;
        this.clienteNome = clienteNome;
        this.servicoNome = servicoNome;
        this.profissionalNome = profissionalNome;
        this.dataHoraAgendamento = dataHoraAgendamento;
        this.valorServico = valorServico;
        this.statusAgendamento = statusAgendamento;
    }

    public Long getAgendamentoId() {
        return agendamentoId;
    }

    public void setAgendamentoId(Long agendamentoId) {
        this.agendamentoId = agendamentoId;
    }

    public String getClienteNome() {
        return clienteNome;
    }

    public void setClienteNome(String clienteNome) {
        this.clienteNome = clienteNome;
    }

    public String getServicoNome() {
        return servicoNome;
    }

    public void setServicoNome(String servicoNome) {
        this.servicoNome = servicoNome;
    }

    public String getProfissionalNome() {
        return profissionalNome;
    }

    public void setProfissionalNome(String profissionalNome) {
        this.profissionalNome = profissionalNome;
    }

    public LocalDateTime getDataHoraAgendamento() {
        return dataHoraAgendamento;
    }

    public void setDataHoraAgendamento(LocalDateTime dataHoraAgendamento) {
        this.dataHoraAgendamento = dataHoraAgendamento;
    }

    public BigDecimal getValorServico() {
        return valorServico;
    }

    public void setValorServico(BigDecimal valorServico) {
        this.valorServico = valorServico;
    }

    public StatusAgendamento getStatusAgendamento() {
        return statusAgendamento;
    }

    public void setStatusAgendamento(StatusAgendamento statusAgendamento) {
        this.statusAgendamento = statusAgendamento;
    }
}
