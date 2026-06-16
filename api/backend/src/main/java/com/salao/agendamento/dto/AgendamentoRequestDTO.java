package com.salao.agendamento.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class AgendamentoRequestDTO {

    @NotBlank(message = "Login do cliente é obrigatório")
    private String clienteLogin;

    @NotBlank(message = "Login do funcionário é obrigatório")
    private String funcionarioLogin;

    @NotNull(message = "ID do serviço é obrigatório")
    private Long servicoId;

    @NotBlank(message = "Data e hora são obrigatórias")
    @Pattern(regexp = "\\d{2}/\\d{2}/\\d{4} \\d{2}:\\d{2}", message = "Formato: DD/MM/AAAA HH:MM")
    private String dataHora;

    private String observacao;

    public String getClienteLogin() { return clienteLogin; }
    public void setClienteLogin(String clienteLogin) { this.clienteLogin = clienteLogin; }

    public String getFuncionarioLogin() { return funcionarioLogin; }
    public void setFuncionarioLogin(String funcionarioLogin) { this.funcionarioLogin = funcionarioLogin; }

    public Long getServicoId() { return servicoId; }
    public void setServicoId(Long servicoId) { this.servicoId = servicoId; }

    public String getDataHora() { return dataHora; }
    public void setDataHora(String dataHora) { this.dataHora = dataHora; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
}
