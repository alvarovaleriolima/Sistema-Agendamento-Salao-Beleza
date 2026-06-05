package com.salao.salon_api.controller;

import com.salao.salon_api.dto.cliente.DetalheResponse;
import com.salao.salon_api.dto.cliente.EditarRequest;
import com.salao.salon_api.dto.cliente.InserirRequest;
import com.salao.salon_api.dto.cliente.ResumoNomeResponse;
import com.salao.salon_api.services.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * RFS05 – Inserir  → POST   /api/clientes
 * RFS06 – Consultar → GET   /api/clientes/login/{login}
 *                     GET   /api/clientes/nome?nome=
 * RFS07 – Editar   → PUT   /api/clientes/{login}
 * RFS08 – Inativar → PATCH /api/clientes/{login}/inativar
 */
@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@Tag(name = "Clientes", description = "Gestão de clientes (RFS05–RFS08)")
public class ClienteController {

    private final ClienteService service;

    @PostMapping
    @Operation(summary = "RFS05 – Inserir Cliente")
    public ResponseEntity<DetalheResponse> inserir(@Valid @RequestBody InserirRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.inserir(dto));
    }

    @GetMapping("/login/{login}")
    @Operation(summary = "RFS06 – Consultar por login",
            description = "Retorna todos os dados do cliente (exceto senha).")
    public ResponseEntity<DetalheResponse> consultarPorLogin(
            @Parameter(description = "Login do cliente") @PathVariable String login) {
        return ResponseEntity.ok(service.consultarPorLogin(login));
    }

    @GetMapping("/nome")
    @Operation(summary = "RFS06 – Consultar por nome",
            description = "Retorna login e nome completo dos clientes encontrados.")
    public ResponseEntity<List<ResumoNomeResponse>> consultarPorNome(
            @Parameter(description = "Nome ou parte do nome") @RequestParam String nome) {
        return ResponseEntity.ok(service.consultarPorNome(nome));
    }

    @PutMapping("/{login}")
    @Operation(summary = "RFS07 – Editar Cliente",
            description = "Login e Status não podem ser alterados por este endpoint.")
    public ResponseEntity<DetalheResponse> editar(
            @PathVariable String login,
            @Valid @RequestBody EditarRequest dto) {
        return ResponseEntity.ok(service.editar(login, dto));
    }

    @PatchMapping("/{login}/inativar")
    @Operation(summary = "RFS08 – Inativar Cliente",
            description = "Inativa o cliente. Agendamentos futuros serão cancelados (RFS19).")
    public ResponseEntity<Void> inativar(@PathVariable String login) {
        service.inativar(login);
        return ResponseEntity.noContent().build();
    }
}
