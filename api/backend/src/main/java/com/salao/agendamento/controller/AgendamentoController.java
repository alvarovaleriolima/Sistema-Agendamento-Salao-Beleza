package com.salao.agendamento.controller;

import com.salao.agendamento.dto.AgendamentoRequestDTO;
import com.salao.agendamento.dto.AgendamentoResponseDTO;
import com.salao.agendamento.dto.AgendamentoUpdateDTO;
import com.salao.agendamento.enums.StatusAgendamento;
import com.salao.agendamento.service.AgendamentoCancelamentoService;
import com.salao.agendamento.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService service;
    private final AgendamentoCancelamentoService cancelamentoService;

    public AgendamentoController(AgendamentoService service,
                                  AgendamentoCancelamentoService cancelamentoService) {
        this.service = service;
        this.cancelamentoService = cancelamentoService;
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> criar(@Valid @RequestBody AgendamentoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoResponseDTO>> listar(
            @RequestParam(required = false) StatusAgendamento status) {
        if (status != null) return ResponseEntity.ok(service.listarPorStatus(status));
        return ResponseEntity.ok(service.listarTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgendamentoResponseDTO> editar(
            @PathVariable Long id,
            @Valid @RequestBody AgendamentoUpdateDTO dto) {
        return ResponseEntity.ok(service.editar(id, dto));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        cancelamentoService.cancelar(id);
        return ResponseEntity.noContent().build();
    }
}