package com.salao.salon_api.dto.funcionario;

import com.salao.salon_api.enums.PerfilFuncionario;
import com.salao.salon_api.models.Funcionario;

/**
 * RFS02 – Busca por nome: retorna login e perfil.
 */
public record ResumoNomeResponse(
        String login,
        PerfilFuncionario perfil
) {
    public static ResumoNomeResponse from(Funcionario f) {
        return new ResumoNomeResponse(f.getLogin(), f.getPerfil());
    }
}
