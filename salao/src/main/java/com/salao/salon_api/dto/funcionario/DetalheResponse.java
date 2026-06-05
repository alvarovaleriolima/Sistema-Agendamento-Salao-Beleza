package com.salao.salon_api.dto.funcionario;

import com.salao.salon_api.enums.PerfilFuncionario;
import com.salao.salon_api.enums.Status;
import com.salao.salon_api.models.Funcionario;

/**
 * RFS02 – Busca por login: retorna todos os dados exceto senha.
 */
public record DetalheResponse(
        Long id,
        String nomeCompleto,
        String login,
        PerfilFuncionario perfil,
        String telefone,
        String email,
        Status status,
        String especialidade,
        String horarioTrabalho
) {
    public static DetalheResponse from(Funcionario f) {
        return new DetalheResponse(
                f.getId(),
                f.getNomeCompleto(),
                f.getLogin(),
                f.getPerfil(),
                f.getTelefone(),
                f.getEmail(),
                f.getStatus(),
                f.getEspecialidade(),
                f.getHorarioTrabalho()
        );
    }
}
