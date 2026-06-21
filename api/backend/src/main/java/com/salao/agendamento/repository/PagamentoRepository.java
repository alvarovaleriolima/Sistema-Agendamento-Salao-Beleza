package com.salao.agendamento.repository;

import com.salao.agendamento.entity.Agendamento;
import com.salao.agendamento.entity.Cliente;
import com.salao.agendamento.dto.FaturamentoReportItemDTO;
import com.salao.agendamento.entity.Pagamento;
import com.salao.agendamento.enums.StatusPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    List<Pagamento> findByAgendamento(Agendamento agendamento);

    List<Pagamento> findByCliente(Cliente cliente);

    List<Pagamento> findByStatus(StatusPagamento status);

    @Query("SELECT new com.salao.agendamento.dto.FaturamentoReportItemDTO(" +
            "p.agendamento.id, " +
            "p.agendamento.cliente.nomeCompleto, " +
            "p.agendamento.servico.nome, " +
            "p.agendamento.funcionario.nomeCompleto, " +
            "p.agendamento.dataHora, " +
            "p.agendamento.servico.preco, " +
            "p.agendamento.status) " +
            "FROM Pagamento p " +
            "WHERE p.status = 'PAGO' " +
            "AND p.agendamento.dataHora BETWEEN :dataInicio AND :dataFim " +
            "AND (:funcionarioId IS NULL OR p.agendamento.funcionario.id = :funcionarioId) " +
            "ORDER BY p.agendamento.dataHora")
    List<FaturamentoReportItemDTO> findFaturamentoReport(
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim,
            @Param("funcionarioId") Long funcionarioId);

    @Query("SELECT SUM(p.agendamento.servico.preco) " +
            "FROM Pagamento p " +
            "WHERE p.status = 'PAGO' " +
            "AND p.agendamento.dataHora BETWEEN :dataInicio AND :dataFim " +
            "AND (:funcionarioId IS NULL OR p.agendamento.funcionario.id = :funcionarioId)")
    BigDecimal findTotalBruto(
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim,
            @Param("funcionarioId") Long funcionarioId);
}
