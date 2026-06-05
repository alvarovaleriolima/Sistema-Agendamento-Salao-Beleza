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

/**
 *  * Endpoints REST para o CRUD de Funcionário.
 *  *
 *  * RFS01 – Inserir  → POST   /api/funcionarios
 *  * RFS02 – Consultar → GET   /api/funcionarios/login/{login}
 *  *                     GET   /api/funcionarios/nome?nome=
 *  *                     GET   /api/funcionarios/perfil?perfil=
 *  * RFS03 – Editar   → PUT   /api/funcionarios/{login}
 *  * RFS04 – Inativar → PATCH /api/funcionarios/{login}/inativar
 *  
 */
@RestController
@RequestMapping("/api/funcionarios")
@RequiredArgsConstructor
@Tag(name = "Funcionários", description = "Gestão de funcionários (RFS01–RFS04)")
public class FuncionarioController {

    private final FuncionarioService service;

       // -----------------------------------------------------------------------
       // RFS01 – Inserir Funcionário
       // Ator: Administrador
       // -----------------------------------------------------------------------
      

    @PostMapping
    @Operation(summary = "RFS01 – Inserir Funcionário",
               description = "Cadastra um novo funcionário. Quando o perfil for PROFISSIONAL, " +
                             "especialidade e horarioTrabalho são obrigatórios.")
    public ResponseEntity<DetalheResponse> inserir(@Valid @RequestBody InserirRequest dto) {
        DetalheResponse response = service.inserir(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

       // -----------------------------------------------------------------------
       // RFS02 – Consultar Funcionário (três modalidades)
       // Ator: Administrador
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
    // Ator: Administrador | Login e Status não são alterados aqui.
    // -----------------------------------------------------------------------
    @PutMapping("/{login}")
    @Operation(summary = "RFS03 – Editar Funcionário",
               description = "Atualiza os dados do funcionário identificado pelo login. " +
                             "Login e Status não podem ser alterados por este endpoint.")
   

    public ResponseEntity<DetalheResponse> editar(
            @PathVariable String login,
            @Valid @RequestBody EditarRequest dto) {
        return ResponseEntity.ok(service.editar(login, dto));
    }

    // -----------------------------------------------------------------------
    // RFS04 – Inativar Funcionário
    // Ator: Administrador
    // -----------------------------------------------------------------------
    @PatchMapping("/{login}/inativar")
    @Operation(summary = "RFS04 – Inativar Funcionário",
               description = "Inativa o funcionário. Agendamentos futuros do profissional " +
                             "serão cancelados e o cliente notificado (RFS19).")
   

    public ResponseEntity<Void> inativar(@PathVariable String login) {
        service.inativar(login);
        return ResponseEntity.noContent().build();
    }
}