package com.salao.salon_api.repositories;

import com.salao.salon_api.enums.PerfilFuncionario;
import com.salao.salon_api.models.Funcionario;
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
}
