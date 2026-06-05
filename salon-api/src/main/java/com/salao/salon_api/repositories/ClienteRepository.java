package com.salao.salon_api.repositories;

import com.salao.salon_api.models.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositório para Cliente.
 * Suporta as buscas definidas em RFS06 (por nome e login).
 */
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    /** Busca por login — RFS06, RFS07, RFS08 */
    Optional<Cliente> findByLogin(String login);

    /** Verifica unicidade do login — RFS05 */
    boolean existsByLogin(String login);

    /** Busca por nome (contém, ignore case) — RFS06 */
    List<Cliente> findByNomeCompletoContainingIgnoreCase(String nome);
    
}

