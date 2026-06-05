package com.salao.salon_api.dto.cliente;

import com.salao.salon_api.models.Cliente;

/** RFS06 – Busca por nome: retorna login e nome completo. */
public record ResumoNomeResponse(
        String login,
        String nomeCompleto
) {
    public static ResumoNomeResponse from(Cliente c) {
        return new ResumoNomeResponse(c.getLogin(), c.getNomeCompleto());
    }
}
