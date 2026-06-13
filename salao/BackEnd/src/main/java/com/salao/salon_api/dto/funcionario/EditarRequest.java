package com.salao.salon_api.dto.funcionario;

import com.salao.salon_api.enums.PerfilFuncionario;
import jakarta.validation.constraints.*;

/**
 * RFS03 – Editar Funcionário.
 * Login e Status não são incluídos aqui (não podem ser alterados por este fluxo).
 */
public record EditarRequest(
        @NotBlank(message = "Nome completo é obrigatório.")
        @Size(max = 150)
        String nomeCompleto,
        
        // Data de nascimento REMOVIDA (Pertence apenas a Cliente)

        // @NotBlank REMOVIDO para permitir que a senha seja opcional na edição
        @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres.")
        String senha,

        @NotNull(message = "Perfil é obrigatório.")
        PerfilFuncionario perfil,

        @NotBlank(message = "Telefone é obrigatório.")
        @Pattern(regexp = "\\(\\d{2}\\) \\d{4,5}-\\d{4}",
                message = "Telefone deve estar no formato (00) 00000-0000.")
        String telefone,

        @NotBlank(message = "E-mail é obrigatório.")
        @Email(message = "E-mail inválido.")
        String email,

        String especialidade,
        String horarioTrabalho
) {}