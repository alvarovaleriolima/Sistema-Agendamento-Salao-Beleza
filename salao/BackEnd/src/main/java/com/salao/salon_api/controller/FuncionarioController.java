package com.salao.salon_api.controller;

import com.salao.salon_api.dto.funcionario.DetalheResponse;
import com.salao.salon_api.dto.funcionario.EditarRequest;
import com.salao.salon_api.dto.funcionario.InserirRequest;
import com.salao.salon_api.dto.funcionario.ResumoNomeResponse;
import com.salao.salon_api.dto.funcionario.ResumoPerfilResponse;
import com.salao.salon_api.enums.PerfilFuncionario;
import com.salao.salon_api.services.FuncionarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
@RequiredArgsConstructor
@Tag(name = "Funcionários", description = "Gestão de funcionários (RFS01–RFS04)")
public class FuncionarioController {

    private final FuncionarioService service;

    // -----------------------------------------------------------------------
    // Listar todos
    // -----------------------------------------------------------------------
    @GetMapping
    @Operation(summary = "Listar todos os funcionários")
    public ResponseEntity<List<DetalheResponse>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // -----------------------------------------------------------------------
    // RFS01 – Inserir Funcionário
    // -----------------------------------------------------------------------
    @PostMapping
    @Operation(summary = "RFS01 – Inserir Funcionário",
            description = "Cadastra um novo funcionário. Quando o perfil for PROFISSIONAL, " +
                    "especialidade e horarioTrabalho são obrigatórios.")
    public ResponseEntity<DetalheResponse> inserir(@Valid @RequestBody InserirRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.inserir(dto));
    }

    // -----------------------------------------------------------------------
    // RFS02 – Consultar Funcionário
    // -----------------------------------------------------------------------
    @GetMapping("/login/{login}")
    @Operation(summary = "RFS02 – Consultar por login",
            description = "Retorna todos os dados do funcionário (exceto senha).")
    public ResponseEntity<DetalheResponse> consultarPorLogin(
            @Parameter(description = "Login do funcionário") @PathVariable String login) {
        return ResponseEntity.ok(service.consultarPorLogin(login));
    }

    @GetMapping("/nome")
    @Operation(summary = "RFS02 – Consultar por nome",
            description = "Retorna login e perfil de cada funcionário com o nome informado.")
    public ResponseEntity<List<ResumoNomeResponse>> consultarPorNome(
            @Parameter(description = "Nome ou parte do nome") @RequestParam String nome) {
        return ResponseEntity.ok(service.consultarPorNome(nome));
    }

    @GetMapping("/perfil")
    @Operation(summary = "RFS02 – Consultar por perfil",
            description = "Retorna login e nome completo de cada funcionário com o perfil informado.")
    public ResponseEntity<List<ResumoPerfilResponse>> consultarPorPerfil(
            @Parameter(description = "Perfil: ADMINISTRADOR, RECEPCIONISTA ou PROFISSIONAL")
            @RequestParam PerfilFuncionario perfil) {
        return ResponseEntity.ok(service.consultarPorPerfil(perfil));
    }

    // -----------------------------------------------------------------------
    // RFS03 – Editar Funcionário
    // -----------------------------------------------------------------------
    @PutMapping("/{login}")
    @Operation(summary = "RFS03 – Editar Funcionário",
            description = "Atualiza os dados do funcionário. Login e Status não podem ser alterados.")
    public ResponseEntity<DetalheResponse> editar(
            @PathVariable String login,
            @Valid @RequestBody EditarRequest dto) {
        return ResponseEntity.ok(service.editar(login, dto));
    }

    // -----------------------------------------------------------------------
    // RFS04 – Inativar Funcionário
    // -----------------------------------------------------------------------
    @PatchMapping("/{login}/inativar")
    @Operation(summary = "RFS04 – Inativar Funcionário",
            description = "Inativa o funcionário. Agendamentos futuros serão cancelados (RFS19).")
    public ResponseEntity<Void> inativar(@PathVariable String login) {
        service.inativar(login);
        return ResponseEntity.noContent().build();
    }
}