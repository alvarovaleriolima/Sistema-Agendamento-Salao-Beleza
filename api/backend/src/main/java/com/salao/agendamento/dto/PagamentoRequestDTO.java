package com.salao.agendamento.dto;

import com.salao.agendamento.enums.FormaPagamento;
import com.salao.agendamento.enums.StatusPagamento;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class PagamentoRequestDTO {

    private Long clienteId;
    private Long agendamentoId;

    private LocalDate dataPagamento;

    @NotNull
    @PositiveOrZero
    private BigDecimal valor;

    private FormaPagamento formaPagamento;

    @NotNull
    private StatusPagamento status;

    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }

    public Long getAgendamentoId() { return agendamentoId; }
    public void setAgendamentoId(Long agendamentoId) { this.agendamentoId = agendamentoId; }

    public LocalDate getDataPagamento() { return dataPagamento; }
    public void setDataPagamento(LocalDate dataPagamento) { this.dataPagamento = dataPagamento; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public FormaPagamento getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(FormaPagamento formaPagamento) { this.formaPagamento = formaPagamento; }

    public StatusPagamento getStatus() { return status; }
    public void setStatus(StatusPagamento status) { this.status = status; }
}
