package com.salao.agendamento.dto;

import com.salao.agendamento.entity.Cliente;

public class ClienteResumoDTO {

    private String nomeCompleto;
    private String login;

    public static ClienteResumoDTO fromEntity(Cliente c) {
        ClienteResumoDTO dto = new ClienteResumoDTO();
        dto.nomeCompleto = c.getNomeCompleto();
        dto.login = c.getLogin();
        return dto;
    }

    public String getNomeCompleto() { return nomeCompleto; }
    public String getLogin() { return login; }
}
