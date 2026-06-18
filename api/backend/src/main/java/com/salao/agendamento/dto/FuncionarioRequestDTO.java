package com.salao.agendamento.dto;

import com.salao.agendamento.enums.Especialidade;
import com.salao.agendamento.enums.PerfilFuncionario;
import com.salao.agendamento.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class FuncionarioRequestDTO {

    @NotBlank(message = "Nome completo é obrigatório")
    private String nomeCompleto;

    @NotBlank(message = "Login é obrigatório")
    private String login;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    private String senha;

    @NotNull(message = "Perfil é obrigatório")
    private PerfilFuncionario perfil;

    @NotBlank(message = "Telefone é obrigatório")
    @Pattern(regexp = "\\(\\d{2}\\) \\d{5}-\\d{4}", message = "Telefone deve estar no formato (00) 00000-0000")
    private String telefone;

    private String email;

    @NotNull(message = "Status é obrigatório")
    private Status status;

    private Especialidade especialidade;

    private String horarioTrabalho;

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
