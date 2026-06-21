package com.salao.agendamento.dto;

public class ServicoRankingItemDTO {

    private String servicoNome;
    private Long count;

    public ServicoRankingItemDTO() {
    }

    public ServicoRankingItemDTO(String servicoNome, Long count) {
        this.servicoNome = servicoNome;
        this.count = count;
    }

    public String getServicoNome() {
        return servicoNome;
    }

    public void setServicoNome(String servicoNome) {
        this.servicoNome = servicoNome;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
