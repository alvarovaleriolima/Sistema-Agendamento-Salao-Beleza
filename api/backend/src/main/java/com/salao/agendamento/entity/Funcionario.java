package com.salao.agendamento.entity;

import com.salao.agendamento.enums.Especialidade;
import com.salao.agendamento.enums.PerfilFuncionario;
import com.salao.agendamento.enums.Status;
import jakarta.persistence.*;

@Entity
@Table(name = "funcionarios")
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_completo", nullable = false)
    private String nomeCompleto;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PerfilFuncionario perfil;

    @Column(nullable = false)
    private String telefone;

    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Enumerated(EnumType.STRING)
    private Especialidade especialidade;

    @Column(name = "horario_trabalho")
    private String horarioTrabalho;

    public Funcionario() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomeCompleto() { return nomeCompleto; }
    public void setNomeCompleto(String nomeCompleto) { this.nomeCompleto = nomeCompleto; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public PerfilFuncionario getPerfil() { return perfil; }
    public void setPerfil(PerfilFuncionario perfil) { this.perfil = perfil; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Especialidade getEspecialidade() { return especialidade; }
    public void setEspecialidade(Especialidade especialidade) { this.especialidade = especialidade; }

    public String getHorarioTrabalho() { return horarioTrabalho; }
    public void setHorarioTrabalho(String horarioTrabalho) { this.horarioTrabalho = horarioTrabalho; }
}
