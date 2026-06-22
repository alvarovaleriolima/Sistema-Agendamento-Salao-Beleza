package com.salao.agendamento.dto;

import com.salao.agendamento.entity.Pagamento;
import com.salao.agendamento.enums.FormaPagamento;
import com.salao.agendamento.enums.StatusPagamento;
import java.math.BigDecimal;

import java.time.format.DateTimeFormatter;

public class PagamentoResponseDTO {

    private Long id;
    private Long clienteId;
    private Long agendamentoId;
    
    // Rich Data for UI
    private String clienteNome;
    private String servicoNome;
    private String profissionalNome;
    private String dataHoraAgendamento;
    
    private String dataPagamento; // Format: dd/MM/yyyy
    private BigDecimal valor;
    private FormaPagamento formaPagamento;
    private StatusPagamento status;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public static PagamentoResponseDTO fromEntity(Pagamento p) {
        PagamentoResponseDTO dto = new PagamentoResponseDTO();
        dto.id = p.getId();
        dto.clienteId = p.getCliente().getId();
        dto.agendamentoId = p.getAgendamento().getId();
        
        dto.clienteNome = p.getCliente().getNomeCompleto();
        dto.servicoNome = p.getAgendamento().getServico().getNome();
        dto.profissionalNome = p.getAgendamento().getFuncionario().getNomeCompleto();
        dto.dataHoraAgendamento = p.getAgendamento().getDataHora() != null ? p.getAgendamento().getDataHora().format(DATETIME_FORMAT) : null;
        
        dto.dataPagamento = p.getDataPagamento() != null ? p.getDataPagamento().format(DATE_FORMAT) : null;
        dto.valor = p.getValor();
        dto.formaPagamento = p.getFormaPagamento();
        dto.status = p.getStatus();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }

    public Long getAgendamentoId() { return agendamentoId; }
    public void setAgendamentoId(Long agendamentoId) { this.agendamentoId = agendamentoId; }

    public String getDataPagamento() { return dataPagamento; }
    public void setDataPagamento(String dataPagamento) { this.dataPagamento = dataPagamento; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public FormaPagamento getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(FormaPagamento formaPagamento) { this.formaPagamento = formaPagamento; }

    public StatusPagamento getStatus() { return status; }
    public void setStatus(StatusPagamento status) { this.status = status; }

    public String getClienteNome() { return clienteNome; }
    public void setClienteNome(String clienteNome) { this.clienteNome = clienteNome; }

    public String getServicoNome() { return servicoNome; }
    public void setServicoNome(String servicoNome) { this.servicoNome = servicoNome; }

    public String getProfissionalNome() { return profissionalNome; }
    public void setProfissionalNome(String profissionalNome) { this.profissionalNome = profissionalNome; }

    public String getDataHoraAgendamento() { return dataHoraAgendamento; }
    public void setDataHoraAgendamento(String dataHoraAgendamento) { this.dataHoraAgendamento = dataHoraAgendamento; }
}
