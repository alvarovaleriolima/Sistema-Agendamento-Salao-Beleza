package com.salao.agendamento.repository;

import com.salao.agendamento.entity.Agendamento;
import com.salao.agendamento.entity.Cliente;
import com.salao.agendamento.entity.Funcionario;
import com.salao.agendamento.entity.Servico;
import com.salao.agendamento.enums.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.salao.agendamento.dto.FaturamentoReportItemDTO;
import com.salao.agendamento.dto.ProfissionalPerformanceItemDTO;
import com.salao.agendamento.dto.ServicoRankingItemDTO;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findByStatusOrderByDataHoraDesc(StatusAgendamento status);

    List<Agendamento> findAllByOrderByDataHoraDesc();

    List<Agendamento> findByFuncionarioAndDataHoraAfterAndStatus(Funcionario funcionario, LocalDateTime dataHora, StatusAgendamento status);

    List<Agendamento> findByServicoAndDataHoraAfterAndStatus(Servico servico, LocalDateTime dataHora, StatusAgendamento status);

    @Modifying
    @Query("UPDATE Agendamento a SET a.status = 'CANCELADO' WHERE a.funcionario = :f AND a.dataHora > :agora AND a.status = 'AGENDADO'")
    void cancelarFuturosPorFuncionario(@Param("f") Funcionario f, @Param("agora") LocalDateTime agora);

    @Modifying
    @Query("UPDATE Agendamento a SET a.status = 'CANCELADO' WHERE a.cliente = :c AND a.dataHora > :agora AND a.status = 'AGENDADO'")
    void cancelarFuturosPorCliente(@Param("c") Cliente c, @Param("agora") LocalDateTime agora);

    // New methods for reports

    @Query("SELECT new com.salao.agendamento.dto.ServicoRankingItemDTO(" +
            "a.servico.nome, " +
            "COUNT(a)) " +
            "FROM Agendamento a " +
            "WHERE a.dataHora BETWEEN :dataInicio AND :dataFim " +
            "GROUP BY a.servico.nome " +
            "ORDER BY COUNT(a) DESC")
    List<ServicoRankingItemDTO> findServicoRanking(
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim);

    @Query("SELECT new com.salao.agendamento.dto.ProfissionalPerformanceItemDTO(" +
            "a.funcionario.nomeCompleto, " +
            "COUNT(a)) " +
            "FROM Agendamento a " +
            "WHERE a.dataHora BETWEEN :dataInicio AND :dataFim " +
            "AND a.status = 'CONCLUIDO' " +
            "GROUP BY a.funcionario.nomeCompleto " +
            "ORDER BY COUNT(a) DESC")
    List<ProfissionalPerformanceItemDTO> findProfissionalPerformance(
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim);

    @Query("SELECT COUNT(a) " +
            "FROM Agendamento a " +
            "WHERE a.dataHora BETWEEN :dataInicio AND :dataFim " +
            "AND a.status = 'CANCELADO'")
    Long findCanceladosCount(
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim);
}
