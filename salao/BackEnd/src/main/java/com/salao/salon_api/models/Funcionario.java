package com.salao.salon_api.models;

import com.salao.salon_api.enums.PerfilFuncionario;
import com.salao.salon_api.enums.Status;
import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "nome_completo", nullable = false, length = 150)
    private String nomeCompleto;

    @Column(name = "login", nullable = false, unique = true, length = 50)
    private String login;

    @Column(name = "senha", nullable = false, length = 255)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(name = "perfil", nullable = false, length = 20)
    private PerfilFuncionario perfil;

    @Column(name = "telefone", nullable = false, length = 20)
    private String telefone;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 10)
    @Builder.Default
    private Status status = Status.ATIVO;

    /** Obrigatório apenas quando perfil = PROFISSIONAL */
    @Column(name = "especialidade", length = 100)
    private String especialidade;

    /** Obrigatório apenas quando perfil = PROFISSIONAL — formato: HH:MM às HH:MM */
    @Column(name = "horario_trabalho", length = 20)
    private String horarioTrabalho;
}
