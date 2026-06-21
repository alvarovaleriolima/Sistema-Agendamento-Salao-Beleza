package com.salao.agendamento.controller;

import com.salao.agendamento.dto.*;
import com.salao.agendamento.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> criar(@Valid @RequestBody ClienteRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.inserir(dto));
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/nome")
    public ResponseEntity<List<ClienteResumoDTO>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(service.buscarPorNome(nome));
    }

    @GetMapping("/login/{login}")
    public ResponseEntity<ClienteResponseDTO> buscarPorLogin(@PathVariable String login) {
        return ResponseEntity.ok(service.buscarPorLogin(login));
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<ClienteResponseDTO>> listarAtivos() {
        return ResponseEntity.ok(service.listarAtivos());
    }

    @PutMapping("/{login}")
    public ResponseEntity<ClienteResponseDTO> editar(
            @PathVariable String login,
            @Valid @RequestBody ClienteUpdateDTO dto) {
        return ResponseEntity.ok(service.editar(login, dto));
    }

    @PatchMapping("/{login}/inativar")
    public ResponseEntity<Void> inativar(@PathVariable String login) {
        service.inativar(login);
        return ResponseEntity.noContent().build();
    }
}
