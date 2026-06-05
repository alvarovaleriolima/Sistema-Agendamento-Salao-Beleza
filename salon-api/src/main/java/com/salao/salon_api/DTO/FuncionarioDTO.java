package com.salao.salon_api.DTO; // Pacote 100% minúsculo e corrigido

import com.salao.salon_api.enums.PerfilFuncionario;
import com.salao.salon_api.enums.Status;
import com.salao.salon_api.models.Funcionario;
import jakarta.validation.constraints.*;

/**
 * DTOs para o CRUD de Funcionário (RFS01–RFS04).
 */
public class FuncionarioDTO {

    // -----------------------------------------------------------------------
    // REQUEST — Inserir Funcionário (RFS01)
    // -----------------------------------------------------------------------
    public record InserirRequest(
            @NotBlank(message = "Nome completo é obrigatório.")
            @Size(max = 150, message = "Nome completo deve ter no máximo 150 caracteres.")
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

            /** Obrigatório apenas quando perfil = PROFISSIONAL */
            String especialidade,

            /**
             * Horário de trabalho no formato HH:MM às HH:MM
             * Obrigatório apenas quando perfil = PROFISSIONAL
             */
            String horarioTrabalho
    ) {}

    // -----------------------------------------------------------------------
    // REQUEST — Editar Funcionário (RFS03)
    // Login não pode ser alterado; Status não pode ser alterado aqui.
    // -----------------------------------------------------------------------
    public record EditarRequest(
            @NotBlank(message = "Nome completo é obrigatório.")
            @Size(max = 150)
            String nomeCompleto,

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

    // -----------------------------------------------------------------------
    // RESPONSE — dados completos (sem senha) — RFS02 busca por login
    // -----------------------------------------------------------------------
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

    // -----------------------------------------------------------------------
    // RESPONSE — resumo por nome (login + perfil) — RFS02 busca por nome
    // -----------------------------------------------------------------------
    public record ResumoNomeResponse(String login, PerfilFuncionario perfil) {
        public static ResumoNomeResponse from(Funcionario f) {
            return new ResumoNomeResponse(f.getLogin(), f.getPerfil());
        }
    }

    // -----------------------------------------------------------------------
    // RESPONSE — resumo por perfil (login + nome) — RFS02 busca por perfil
    // -----------------------------------------------------------------------
    public record ResumoPerfilResponse(String login, String nomeCompleto) {
        public static ResumoPerfilResponse from(Funcionario f) {
            return new ResumoPerfilResponse(f.getLogin(), f.getNomeCompleto());
        }
    }
}