package com.salao.agendamento.dto;

import com.salao.agendamento.entity.Servico;
import com.salao.agendamento.enums.Status;
import java.math.BigDecimal;

public class ServicoResponseDTO {

    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer duracaoMinutos;
    private Status status;

    public static ServicoResponseDTO fromEntity(Servico s) {
        ServicoResponseDTO dto = new ServicoResponseDTO();
        dto.id = s.getId();
        dto.nome = s.getNome();
        dto.descricao = s.getDescricao();
        dto.preco = s.getPreco();
        dto.duracaoMinutos = s.getDuracaoMinutos();
        dto.status = s.getStatus();
        return dto;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public BigDecimal getPreco() { return preco; }
    public Integer getDuracaoMinutos() { return duracaoMinutos; }
    public Status getStatus() { return status; }
}
