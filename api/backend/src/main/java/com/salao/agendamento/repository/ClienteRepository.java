package com.salao.agendamento.repository;

import com.salao.agendamento.entity.Cliente;
import com.salao.agendamento.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByLogin(String login);

    boolean existsByLogin(String login);

    List<Cliente> findByNomeCompletoContainingIgnoreCase(String nome);

    List<Cliente> findByStatus(Status status);
}
