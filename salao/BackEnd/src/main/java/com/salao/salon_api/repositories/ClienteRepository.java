package com.salao.salon_api.repositories;

import com.salao.salon_api.models.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByLogin(String login);

    boolean existsByLogin(String login);

    List<Cliente> findByNomeCompletoContainingIgnoreCase(String nome);
}
