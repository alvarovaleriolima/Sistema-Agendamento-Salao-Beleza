package com.salao.agendamento.dto;

import com.salao.agendamento.entity.Agendamento;
import com.salao.agendamento.enums.StatusAgendamento;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

public class AgendamentoResponseDTO {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private Long id;
    private String clienteLogin;
    private String clienteNome;
    private String funcionarioLogin;
    private String funcionarioNome;
    private Long servicoId;
    private String servicoNome;
    private BigDecimal valorServico;
    private Integer duracaoMinutos;
    private String dataHora;
    private StatusAgendamento status;
    private String observacao;

    public static AgendamentoResponseDTO fromEntity(Agendamento a) {
        AgendamentoResponseDTO dto = new AgendamentoResponseDTO();
        dto.id = a.getId();
        dto.clienteLogin = a.getCliente().getLogin();
        dto.clienteNome = a.getCliente().getNomeCompleto();
        dto.funcionarioLogin = a.getFuncionario().getLogin();
        dto.funcionarioNome = a.getFuncionario().getNomeCompleto();
        dto.servicoId = a.getServico().getId();
        dto.servicoNome = a.getServico().getNome();
        dto.valorServico = a.getServico().getPreco();
        dto.duracaoMinutos = a.getServico().getDuracaoMinutos();
        dto.dataHora = a.getDataHora().format(FMT);
        dto.status = a.getStatus();
        dto.observacao = a.getObservacao();
        return dto;
    }

    public Long getId() { return id; }
    public String getClienteLogin() { return clienteLogin; }
    public String getClienteNome() { return clienteNome; }
    public String getFuncionarioLogin() { return funcionarioLogin; }
    public String getFuncionarioNome() { return funcionarioNome; }
    public Long getServicoId() { return servicoId; }
    public String getServicoNome() { return servicoNome; }
    public BigDecimal getValorServico() { return valorServico; }
    public Integer getDuracaoMinutos() { return duracaoMinutos; }
    public String getDataHora() { return dataHora; }
    public StatusAgendamento getStatus() { return status; }
    public String getObservacao() { return observacao; }
}
