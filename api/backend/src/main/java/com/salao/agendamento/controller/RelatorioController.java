package com.salao.agendamento.controller;

import com.salao.agendamento.dto.DesempenhoReportDTO;
import com.salao.agendamento.dto.FaturamentoReportDTO;
import com.salao.agendamento.service.RelatorioService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping("/faturamento")
    public ResponseEntity<FaturamentoReportDTO> gerarRelatorioFaturamentoFinanceiro(
            @RequestParam @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm") LocalDateTime dataInicio,
            @RequestParam @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm") LocalDateTime dataFim,
            @RequestParam(required = false) Long funcionarioId) {

        FaturamentoReportDTO report = relatorioService.gerarRelatorioFaturamentoFinanceiro(dataInicio, dataFim, funcionarioId);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/desempenho")
    public ResponseEntity<DesempenhoReportDTO> gerarRelatorioDesempenhoEFaltas(
            @RequestParam @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm") LocalDateTime dataInicio,
            @RequestParam @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm") LocalDateTime dataFim) {

        DesempenhoReportDTO report = relatorioService.gerarRelatorioDesempenhoEFaltas(dataInicio, dataFim);
        return ResponseEntity.ok(report);
    }
}
