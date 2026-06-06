package com.salao.salon_api.dto.funcionario;

import com.salao.salon_api.enums.PerfilFuncionario;
import jakarta.validation.constraints.*;

public record InserirRequest(
        @NotBlank(message = "Nome completo é obrigatório.")
        String nomeCompleto,

        @NotBlank(message = "Login é obrigatório.")
        @Size(min = 3, max = 50, message = "Login deve ter entre 3 e 50 caracteres.")
        String login,

        @NotBlank(message = "Senha é obrigatória.")
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