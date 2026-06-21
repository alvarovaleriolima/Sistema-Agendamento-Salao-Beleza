package com.salao.agendamento.service;

import com.salao.agendamento.dto.DesempenhoReportDTO;
import com.salao.agendamento.dto.FaturamentoReportDTO;
import com.salao.agendamento.dto.FaturamentoReportItemDTO;
import com.salao.agendamento.dto.ProfissionalPerformanceItemDTO;
import com.salao.agendamento.dto.ServicoRankingItemDTO;
import com.salao.agendamento.repository.AgendamentoRepository;
import com.salao.agendamento.repository.PagamentoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RelatorioService {

    private final PagamentoRepository pagamentoRepository;
    private final AgendamentoRepository agendamentoRepository;

    public RelatorioService(PagamentoRepository pagamentoRepository,
                            AgendamentoRepository agendamentoRepository) {
        this.pagamentoRepository = pagamentoRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    public FaturamentoReportDTO gerarRelatorioFaturamentoFinanceiro(LocalDateTime dataInicio,
                                                                     LocalDateTime dataFim,
                                                                     Long funcionarioId) {
        List<FaturamentoReportItemDTO> itens = pagamentoRepository.findFaturamentoReport(dataInicio, dataFim, funcionarioId);
        BigDecimal totalBruto = pagamentoRepository.findTotalBruto(dataInicio, dataFim, funcionarioId);
        if (totalBruto == null) {
            totalBruto = BigDecimal.ZERO;
        }

        FaturamentoReportDTO report = new FaturamentoReportDTO();
        report.setItens(itens);
        report.setTotalBruto(totalBruto);
        return report;
    }

    public DesempenhoReportDTO gerarRelatorioDesempenhoEFaltas(LocalDateTime dataInicio,
                                                                 LocalDateTime dataFim) {
        List<ServicoRankingItemDTO> servicoRanking = agendamentoRepository.findServicoRanking(dataInicio, dataFim);
        List<ProfissionalPerformanceItemDTO> profissionalPerformance = agendamentoRepository.findProfissionalPerformance(dataInicio, dataFim);
        Long canceladosCount = agendamentoRepository.findCanceladosCount(dataInicio, dataFim);
        if (canceladosCount == null) {
            canceladosCount = 0L;
        }

        DesempenhoReportDTO report = new DesempenhoReportDTO();
        report.setServicoRanking(servicoRanking);
        report.setProfissionalPerformance(profissionalPerformance);
        report.setCanceladosCount(canceladosCount);
        return report;
    }
}
