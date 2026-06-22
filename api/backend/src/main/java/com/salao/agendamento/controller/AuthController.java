package com.salao.agendamento.controller;

import com.salao.agendamento.dto.ClienteResponseDTO;
import com.salao.agendamento.dto.ErrorResponseDTO;
import com.salao.agendamento.dto.FuncionarioResponseDTO;
import com.salao.agendamento.dto.LoginRequestDTO;
import com.salao.agendamento.entity.Cliente;
import com.salao.agendamento.entity.Funcionario;
import com.salao.agendamento.enums.Status;
import com.salao.agendamento.repository.ClienteRepository;
import com.salao.agendamento.repository.FuncionarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.mindrot.jbcrypt.BCrypt;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final FuncionarioRepository funcionarioRepository;
    private final ClienteRepository clienteRepository;

    public AuthController(FuncionarioRepository funcionarioRepository, ClienteRepository clienteRepository) {
        this.funcionarioRepository = funcionarioRepository;
        this.clienteRepository = clienteRepository;
    }

    @PostMapping("/funcionario/login")
    public ResponseEntity<?> loginFuncionario(@RequestBody LoginRequestDTO request) {
        Funcionario funcionario = funcionarioRepository.findByLogin(request.getLogin())
                .filter(f -> BCrypt.checkpw(request.getSenha(), f.getSenha()) && f.getStatus() == Status.ATIVO)
                .orElse(null);

        if (funcionario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDTO("Invalid credentials or inactive account"));
        }

        FuncionarioResponseDTO response = FuncionarioResponseDTO.fromEntity(funcionario);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cliente/login")
    public ResponseEntity<?> loginCliente(@RequestBody LoginRequestDTO request) {
        Cliente cliente = clienteRepository.findByLogin(request.getLogin())
                .filter(c -> BCrypt.checkpw(request.getSenha(), c.getSenha()) && c.getStatus() == Status.ATIVO)
                .orElse(null);

        if (cliente == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDTO("Invalid credentials or inactive account"));
        }

        ClienteResponseDTO response = ClienteResponseDTO.fromEntity(cliente);
        return ResponseEntity.ok(response);
    }
}
