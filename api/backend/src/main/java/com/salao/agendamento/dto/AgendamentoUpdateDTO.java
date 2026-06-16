package com.salao.agendamento.dto;

import com.salao.agendamento.enums.StatusAgendamento;
import jakarta.validation.constraints.Pattern;

public class AgendamentoUpdateDTO {

    @Pattern(regexp = "\\d{2}/\\d{2}/\\d{4} \\d{2}:\\d{2}", message = "Formato: DD/MM/AAAA HH:MM")
    private String dataHora;

    private StatusAgendamento status;

    private String observacao;

    public String getDataHora() { return dataHora; }
    public void setDataHora(String dataHora) { this.dataHora = dataHora; }

    public StatusAgendamento getStatus() { return status; }
    public void setStatus(StatusAgendamento status) { this.status = status; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
}
