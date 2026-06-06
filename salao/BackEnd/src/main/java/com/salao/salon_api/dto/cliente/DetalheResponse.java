package com.salao.salon_api.dto.cliente;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.salao.salon_api.enums.Status;
import com.salao.salon_api.models.Cliente;

import java.time.LocalDate;

/** RFS06 – Busca por login: retorna todos os dados exceto senha. */
public record DetalheResponse(
        Long id,
        String nomeCompleto,

        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate dataNascimento,

        String login,
        String telefone,
        String email,
        Status status
) {
    public static DetalheResponse from(Cliente c) {
        return new DetalheResponse(
                c.getId(),
                c.getNomeCompleto(),
                c.getDataNascimento(),
                c.getLogin(),
                c.getTelefone(),
                c.getEmail(),
                c.getStatus()
        );
    }
}