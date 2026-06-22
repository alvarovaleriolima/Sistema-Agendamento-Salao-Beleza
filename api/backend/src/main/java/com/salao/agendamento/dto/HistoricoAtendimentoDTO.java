package com.salao.agendamento.dto;

import com.salao.agendamento.entity.Pagamento;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

public class HistoricoAtendimentoDTO {
    
    private String data;
    private String servico;
    private String profissional;
    private BigDecimal valor;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public static HistoricoAtendimentoDTO fromEntity(Pagamento p) {
        HistoricoAtendimentoDTO dto = new HistoricoAtendimentoDTO();
        dto.data = p.getAgendamento().getDataHora() != null ? p.getAgendamento().getDataHora().format(DATE_FORMAT) : null;
        dto.servico = p.getAgendamento().getServico().getNome();
        dto.profissional = p.getAgendamento().getFuncionario().getNomeCompleto();
        dto.valor = p.getValor();
        return dto;
    }

    public String getData() { return data; }
    public void setData(String data) { this.data = data; }

    public String getServico() { return servico; }
    public void setServico(String servico) { this.servico = servico; }

    public String getProfissional() { return profissional; }
    public void setProfissional(String profissional) { this.profissional = profissional; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
}
