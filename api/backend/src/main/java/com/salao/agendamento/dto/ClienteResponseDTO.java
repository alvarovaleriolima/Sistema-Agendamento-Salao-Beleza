package com.salao.agendamento.dto;

import com.salao.agendamento.entity.Cliente;
import com.salao.agendamento.enums.Status;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public class ClienteResponseDTO {

    private Long id;
    private String nomeCompleto;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataNascimento;

    private String login;
    private String telefone;
    private String email;
    private Status status;

    public static ClienteResponseDTO fromEntity(Cliente c) {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.id = c.getId();
        dto.nomeCompleto = c.getNomeCompleto();
        dto.dataNascimento = c.getDataNascimento();
        dto.login = c.getLogin();
        dto.telefone = c.getTelefone();
        dto.email = c.getEmail();
        dto.status = c.getStatus();
        return dto;
    }

    public Long getId() { return id; }
    public String getNomeCompleto() { return nomeCompleto; }
    public LocalDate getDataNascimento() { return dataNascimento; }
    public String getLogin() { return login; }
    public String getTelefone() { return telefone; }
    public String getEmail() { return email; }
    public Status getStatus() { return status; }
}
