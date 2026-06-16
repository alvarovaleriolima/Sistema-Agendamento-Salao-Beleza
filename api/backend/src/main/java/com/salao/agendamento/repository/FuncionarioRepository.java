package com.salao.agendamento.repository;

import com.salao.agendamento.entity.Funcionario;
import com.salao.agendamento.enums.PerfilFuncionario;
import com.salao.agendamento.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    Optional<Funcionario> findByLogin(String login);

    boolean existsByLogin(String login);

    List<Funcionario> findByNomeCompletoContainingIgnoreCase(String nome);

    List<Funcionario> findByPerfil(PerfilFuncionario perfil);

    List<Funcionario> findByPerfilAndStatus(PerfilFuncionario perfil, Status status);
}
