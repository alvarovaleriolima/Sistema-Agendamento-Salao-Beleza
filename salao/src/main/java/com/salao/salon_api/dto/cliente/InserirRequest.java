package com.salao.salon_api.dto.cliente;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

/** RFS05 – Inserir Cliente */
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
