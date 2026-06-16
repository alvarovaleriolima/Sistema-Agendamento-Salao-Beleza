package com.salao.agendamento.dto;

import com.salao.agendamento.entity.Funcionario;
import com.salao.agendamento.enums.Especialidade;
import com.salao.agendamento.enums.PerfilFuncionario;
import com.salao.agendamento.enums.Status;

public class FuncionarioResponseDTO {

    private Long id;
    private String nomeCompleto;
    private String login;
    private PerfilFuncionario perfil;
    private String telefone;
    private String email;
    private Status status;
    private Especialidade especialidade;
    private String horarioTrabalho;

    public static FuncionarioResponseDTO fromEntity(Funcionario f) {
        FuncionarioResponseDTO dto = new FuncionarioResponseDTO();
        dto.id = f.getId();
        dto.nomeCompleto = f.getNomeCompleto();
        dto.login = f.getLogin();
        dto.perfil = f.getPerfil();
        dto.telefone = f.getTelefone();
        dto.email = f.getEmail();
        dto.status = f.getStatus();
        dto.especialidade = f.getEspecialidade();
        dto.horarioTrabalho = f.getHorarioTrabalho();
        return dto;
    }

    public Long getId() { return id; }
    public String getNomeCompleto() { return nomeCompleto; }
    public String getLogin() { return login; }
    public PerfilFuncionario getPerfil() { return perfil; }
    public String getTelefone() { return telefone; }
    public String getEmail() { return email; }
    public Status getStatus() { return status; }
    public Especialidade getEspecialidade() { return especialidade; }
    public String getHorarioTrabalho() { return horarioTrabalho; }
}
