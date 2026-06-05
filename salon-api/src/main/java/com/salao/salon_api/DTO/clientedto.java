package com.salao.salon_api.DTO;

import com.salao.salon_api.models.Cliente; // Importando o Model que você criou
import com.salao.salon_api.enums.Status;   // Importando o Enum correto
import jakarta.validation.constraints.*;

import java.time.LocalDate;

/**
 * DTOs para o CRUD de Cliente (RFS05–RFS08).
 */
public class clientedto {

    // -----------------------------------------------------------------------
    // REQUEST — Inserir Cliente (RFS05)
    // -----------------------------------------------------------------------
    public record InserirRequest(
            @NotBlank(message = "Nome completo é obrigatório.")
            @Size(max = 150, message = "Nome completo deve ter no máximo 150 caracteres.")
            String nomeCompleto,

            @NotNull(message = "Data de nascimento é obrigatória.")
            @Past(message = "Data de nascimento deve ser uma data passada.")
            LocalDate dataNascimento,

            @NotBlank(message = "Login é obrigatório.")
            @Size(min = 3, max = 50, message = "Login deve ter entre 3 e 50 caracteres.")
            String login,

            @NotBlank(message = "Senha é obrigatória.")
            @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres.")
            String senha,

            @NotBlank(message = "Telefone é obrigatório.")
            @Pattern(regexp = "\\(\\d{2}\\) \\d{4,5}-\\d{4}",
                    message = "Telefone deve estar no formato (00) 00000-0000.")
            String telefone,

            @NotBlank(message = "E-mail é obrigatório.")
            @Email(message = "E-mail inválido.")
            String email
    ) {}

    // -----------------------------------------------------------------------
    // REQUEST — Editar Cliente (RFS07)
    // Login e Status não podem ser alterados aqui.
    // -----------------------------------------------------------------------
    public record EditarRequest(
            @NotBlank(message = "Nome completo é obrigatório.")
            @Size(max = 150)
            String nomeCompleto,

            @NotNull(message = "Data de nascimento é obrigatória.")
            @Past(message = "Data de nascimento deve ser uma data passada.")
            LocalDate dataNascimento,

            @NotBlank(message = "Senha é obrigatória.")
            @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres.")
            String senha,

            @NotBlank(message = "Telefone é obrigatório.")
            @Pattern(regexp = "\\(\\d{2}\\) \\d{4,5}-\\d{4}",
                    message = "Telefone deve estar no formato (00) 00000-0000.")
            String telefone,

            @NotBlank(message = "E-mail é obrigatório.")
            @Email(message = "E-mail inválido.")
            String email
    ) {}

    // -----------------------------------------------------------------------
    // RESPONSE — dados completos (sem senha) — RFS06 busca por login
    // -----------------------------------------------------------------------
    public record DetalheResponse(
            Long id,
            String nomeCompleto,
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

    // -----------------------------------------------------------------------
    // RESPONSE — resumo por nome (apenas login) — RFS06 busca por nome
    // -----------------------------------------------------------------------
    public record ResumoNomeResponse(String login, String nomeCompleto) {
        public static ResumoNomeResponse from(Cliente c) {
            return new ResumoNomeResponse(c.getLogin(), c.getNomeCompleto());
        }
    }
}