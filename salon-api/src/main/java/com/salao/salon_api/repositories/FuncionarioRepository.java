package com.salao.salon_api.repositories;

import com.salao.salon_api.enums.PerfilFuncionario;
import com.salao.salon_api.models.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositório para Funcionário.
 * Suporta as buscas definidas em RFS02 (por nome, login, perfil).
 */
@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    /** Busca por login — RFS02, RFS03, RFS04 */
    Optional<Funcionario> findByLogin(String login);

    /** Verifica unicidade do login — RFS01 */
    boolean existsByLogin(String login);

    /** Busca por nome (contém, ignore case) — RFS02 */
    List<Funcionario> findByNomeCompletoContainingIgnoreCase(String nome);

    /** Busca por perfil — RFS02 */
    List<Funcionario> findByPerfil(PerfilFuncionario perfil);
}