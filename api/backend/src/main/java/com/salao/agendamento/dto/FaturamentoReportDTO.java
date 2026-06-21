package com.salao.agendamento.dto;

import java.math.BigDecimal;
import java.util.List;

public class FaturamentoReportDTO {

    private List<FaturamentoReportItemDTO> itens;
    private BigDecimal totalBruto;

    public List<FaturamentoReportItemDTO> getItens() {
        return itens;
    }

    public void setItens(List<FaturamentoReportItemDTO> itens) {
        this.itens = itens;
    }

    public BigDecimal getTotalBruto() {
        return totalBruto;
    }

    public void setTotalBruto(BigDecimal totalBruto) {
        this.totalBruto = totalBruto;
    }
}
