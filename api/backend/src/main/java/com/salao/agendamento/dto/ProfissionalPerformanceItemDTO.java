package com.salao.agendamento.dto;

public class ProfissionalPerformanceItemDTO {

    private String profissionalNome;
    private Long count;

    public ProfissionalPerformanceItemDTO() {
    }

    public ProfissionalPerformanceItemDTO(String profissionalNome, Long count) {
        this.profissionalNome = profissionalNome;
        this.count = count;
    }

    public String getProfissionalNome() {
        return profissionalNome;
    }

    public void setProfissionalNome(String profissionalNome) {
        this.profissionalNome = profissionalNome;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
