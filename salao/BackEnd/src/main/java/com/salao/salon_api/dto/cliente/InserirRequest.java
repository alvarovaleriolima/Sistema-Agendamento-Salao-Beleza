package com.salao.salon_api.dto.cliente;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@JsonIgnoreProperties(ignoreUnknown = true)
public record InserirRequest(
        @NotBlank(message = "Nome completo é obrigatório.")
        String nomeCompleto,

        @NotNull(message = "Data de nascimento é obrigatória.")
        @Past(message = "Data de nascimento deve ser uma data passada.")
        LocalDate dataNascimento,

        @NotBlank(message = "Login é obrigatório.")
        @Size(min = 3, max = 50)
        String login,

        @NotBlank(message = "Senha é obrigatória.")
        @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres.")
        String senha,

        @NotBlank(message = "Telefone é obrigatório.")
        @Pattern(regexp = "\\(\\d{2}\\) \\d{4,5}-\\d{4}",
                message = "Telefone deve estar no formato (00) 00000-0000.")
        String telefone,

        @Email(message = "E-mail inválido.")
        String email
) {}