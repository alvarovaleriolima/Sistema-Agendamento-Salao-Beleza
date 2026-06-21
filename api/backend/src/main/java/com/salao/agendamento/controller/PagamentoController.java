package com.salao.agendamento.controller;

import com.salao.agendamento.dto.PagamentoRequestDTO;
import com.salao.agendamento.dto.PagamentoResponseDTO;
import com.salao.agendamento.enums.StatusPagamento;
import com.salao.agendamento.service.PagamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentoController {

    private final PagamentoService pagamentoService;

    public PagamentoController(PagamentoService pagamentoService) {
        this.pagamentoService = pagamentoService;
    }

    @PostMapping
    public ResponseEntity<PagamentoResponseDTO> criar(@RequestBody PagamentoRequestDTO dto) {
        PagamentoResponseDTO created = pagamentoService.criar(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<PagamentoResponseDTO>> listarTodos() {
        List<PagamentoResponseDTO> list = pagamentoService.listarTodos();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PagamentoResponseDTO>> listarPorCliente(@PathVariable Long clienteId) {
        List<PagamentoResponseDTO> list = pagamentoService.listarPorCliente(clienteId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/agendamento/{agendamentoId}")
    public ResponseEntity<List<PagamentoResponseDTO>> listarPorAgendamento(@PathVariable Long agendamentoId) {
        List<PagamentoResponseDTO> list = pagamentoService.listarPorAgendamento(agendamentoId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PagamentoResponseDTO>> listarPorStatus(@PathVariable String status) {
        StatusPagamento statusEnum = StatusPagamento.valueOf(status);
        List<PagamentoResponseDTO> list = pagamentoService.listarPorStatus(statusEnum);
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PagamentoResponseDTO> atualizar(@PathVariable Long id, @RequestBody PagamentoRequestDTO dto) {
        PagamentoResponseDTO updated = pagamentoService.atualizar(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        pagamentoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
