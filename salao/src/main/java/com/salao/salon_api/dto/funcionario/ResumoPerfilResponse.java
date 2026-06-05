package com.salao.salon_api.dto.funcionario;

import com.salao.salon_api.models.Funcionario;

/**
 * RFS02 – Busca por perfil: retorna login e nome completo.
 */
public record ResumoPerfilResponse(
        String login,
        String nomeCompleto
) {
    public static ResumoPerfilResponse from(Funcionario f) {
        return new ResumoPerfilResponse(f.getLogin(), f.getNomeCompleto());
    }
}
