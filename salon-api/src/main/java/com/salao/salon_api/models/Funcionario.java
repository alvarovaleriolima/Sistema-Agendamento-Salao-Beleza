package com.salao.salon_api.models;

import jakarta.persistence.*;
import lombok.*;

import com.salao.salon_api.enums.PerfilFuncionario;
import com.salao.salon_api.enums.Status;

/*
 * Entidade Funcionário — RFS01 (Tabela 01)
 *
 * Campos obrigatórios marcados com * no documento:
 * Nome Completo, Login, Senha, Perfil, Telefone, E-mail, Status
 * Obrigatórios apenas para Profissional:
 * Especialidade, Horário de Trabalho
 */
@Entity
@Table(name = "funcionarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nome completo do funcionário — obrigatório */
    @Column(name = "nome_completo", nullable = false, length = 150)
    private String nomeCompleto;

    /**
     * Nome de acesso ao sistema — obrigatório e único (RFS01)
     * Não pode ser alterado na edição (RFS03)
     */
    @Column(name = "login", nullable = false, unique = true, length = 50)
    private String login;

    /**
     * Senha de acesso — mínimo 8 caracteres (RFS01)
     * Nunca exposta nas consultas (RFS02)
     */
    @Column(name = "senha", nullable = false, length = 255)
    private String senha;

    /** Perfil: ADMINISTRADOR, RECEPCIONISTA ou PROFISSIONAL — obrigatório */
    @Enumerated(EnumType.STRING)
    @Column(name = "perfil", nullable = false, length = 20)
    private PerfilFuncionario perfil;

    /** Telefone no formato (00) 00000-0000 — obrigatório */
    @Column(name = "telefone", nullable = false, length = 20)
    private String telefone;

    /** Endereço de e-mail — obrigatório */
    @Column(name = "email", nullable = false, length = 150)
    private String email;

    /** Status: ATIVO ou INATIVO — obrigatório; não editável via RFS03 */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 10)
    @Builder.Default
    private Status status = Status.ATIVO;

    /**
     * Área de atuação — obrigatório somente quando perfil = PROFISSIONAL (RFS01)
     */
    @Column(name = "especialidade", length = 100)
    private String especialidade;

    /**
     * Horário de trabalho no formato HH:MM às HH:MM
     * Obrigatório somente quando perfil = PROFISSIONAL (RFS01)
     */
    @Column(name = "horario_trabalho", length = 20)
    private String horarioTrabalho;
}