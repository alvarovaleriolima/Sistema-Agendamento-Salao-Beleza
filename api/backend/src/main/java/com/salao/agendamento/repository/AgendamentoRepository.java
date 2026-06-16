package com.salao.agendamento.repository;

import com.salao.agendamento.entity.Agendamento;
import com.salao.agendamento.entity.Cliente;
import com.salao.agendamento.entity.Funcionario;
import com.salao.agendamento.enums.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findByStatusOrderByDataHoraDesc(StatusAgendamento status);

    List<Agendamento> findAllByOrderByDataHoraDesc();

    @Modifying
    @Query("UPDATE Agendamento a SET a.status = 'CANCELADO' WHERE a.funcionario = :f AND a.dataHora > :agora AND a.status = 'AGENDADO'")
    void cancelarFuturosPorFuncionario(@Param("f") Funcionario f, @Param("agora") LocalDateTime agora);

    @Modifying
    @Query("UPDATE Agendamento a SET a.status = 'CANCELADO' WHERE a.cliente = :c AND a.dataHora > :agora AND a.status = 'AGENDADO'")
    void cancelarFuturosPorCliente(@Param("c") Cliente c, @Param("agora") LocalDateTime agora);
}
