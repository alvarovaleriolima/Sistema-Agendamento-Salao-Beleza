package com.salao.agendamento.controller;

import com.salao.agendamento.dto.*;
import com.salao.agendamento.enums.PerfilFuncionario;
import com.salao.agendamento.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    private final FuncionarioService service;

    public FuncionarioController(FuncionarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<FuncionarioResponseDTO> criar(@Valid @RequestBody FuncionarioRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.inserir(dto));
    }

    @GetMapping
    public ResponseEntity<List<FuncionarioResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/nome")
    public ResponseEntity<List<FuncionarioResumoDTO>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(service.buscarPorNome(nome));
    }

    @GetMapping("/login/{login}")
    public ResponseEntity<FuncionarioResponseDTO> buscarPorLogin(@PathVariable String login) {
        return ResponseEntity.ok(service.buscarPorLogin(login));
    }

    @GetMapping("/perfil")
    public ResponseEntity<List<FuncionarioResumoDTO>> buscarPorPerfil(@RequestParam PerfilFuncionario perfil) {
        return ResponseEntity.ok(service.buscarPorPerfil(perfil));
    }

    @GetMapping("/profissionais-ativos")
    public ResponseEntity<List<FuncionarioResponseDTO>> profissionaisAtivos() {
        return ResponseEntity.ok(service.listarProfissionaisAtivos());
    }

    @PutMapping("/{login}")
    public ResponseEntity<FuncionarioResponseDTO> editar(
            @PathVariable String login,
            @Valid @RequestBody FuncionarioUpdateDTO dto) {
        return ResponseEntity.ok(service.editar(login, dto));
    }

    @PatchMapping("/{login}/inativar")
    public ResponseEntity<Void> inativar(@PathVariable String login) {
        service.inativar(login);
        return ResponseEntity.noContent().build();
    }
}
