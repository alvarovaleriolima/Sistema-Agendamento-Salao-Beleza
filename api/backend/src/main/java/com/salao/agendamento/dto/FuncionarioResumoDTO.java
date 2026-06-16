package com.salao.agendamento.dto;

import com.salao.agendamento.entity.Funcionario;
import com.salao.agendamento.enums.PerfilFuncionario;

public class FuncionarioResumoDTO {

    private String nomeCompleto;
    private String login;
    private PerfilFuncionario perfil;

    public static FuncionarioResumoDTO fromEntity(Funcionario f) {
        FuncionarioResumoDTO dto = new FuncionarioResumoDTO();
        dto.nomeCompleto = f.getNomeCompleto();
        dto.login = f.getLogin();
        dto.perfil = f.getPerfil();
        return dto;
    }

    public String getNomeCompleto() { return nomeCompleto; }
    public String getLogin() { return login; }
    public PerfilFuncionario getPerfil() { return perfil; }
}
