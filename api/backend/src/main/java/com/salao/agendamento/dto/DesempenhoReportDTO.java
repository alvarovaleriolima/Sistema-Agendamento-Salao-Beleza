package com.salao.agendamento.dto;

import java.util.List;

public class DesempenhoReportDTO {

    private List<ServicoRankingItemDTO> servicoRanking;
    private List<ProfissionalPerformanceItemDTO> profissionalPerformance;
    private Long canceladosCount;

    public List<ServicoRankingItemDTO> getServicoRanking() {
        return servicoRanking;
    }

    public void setServicoRanking(List<ServicoRankingItemDTO> servicoRanking) {
        this.servicoRanking = servicoRanking;
    }

    public List<ProfissionalPerformanceItemDTO> getProfissionalPerformance() {
        return profissionalPerformance;
    }

    public void setProfissionalPerformance(List<ProfissionalPerformanceItemDTO> profissionalPerformance) {
        this.profissionalPerformance = profissionalPerformance;
    }

    public Long getCanceladosCount() {
        return canceladosCount;
    }

    public void setCanceladosCount(Long canceladosCount) {
        this.canceladosCount = canceladosCount;
    }
}
