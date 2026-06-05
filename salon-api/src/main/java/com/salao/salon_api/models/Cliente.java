package com.salao.salon_api.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

import com.salao.salon_api.enums.Status;

/**
 * Entidade Cliente — RFS05 (Tabela 02)
 *
 * Todos os campos são obrigatórios.
 */
@Entity
@Table(name = "clientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nome completo do cliente — obrigatório */
    @Column(name = "nome_completo", nullable = false, length = 150)
    private String nomeCompleto;

    /** Data de nascimento no formato DD/MM/AAAA — obrigatório */
    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    /**
     * Nome de acesso ao sistema — obrigatório e único (RFS05)
     * Não pode ser alterado na edição (RFS07)
     */
    @Column(name = "login", nullable = false, unique = true, length = 50)
    private String login;

    /**
     * Senha de acesso — mínimo 8 caracteres (RFS05)
     * Nunca exposta nas consultas (RFS06)
     */
    @Column(name = "senha", nullable = false, length = 255)
    private String senha;

    /** Telefone no formato (00) 00000-0000 — obrigatório */
    @Column(name = "telefone", nullable = false, length = 20)
    private String telefone;

    /** Endereço de e-mail — obrigatório; usado nas notificações (RFS19) */
    @Column(name = "email", nullable = false, length = 150)
    private String email;

    /**
     * Status: ATIVO ou INATIVO — obrigatório
     * Não editável via RFS07; alterado apenas por RFS08
     * Clientes inativos não podem acessar o sistema nem agendar (RFS08)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 10)
    @Builder.Default
    private Status status = Status.ATIVO;
}