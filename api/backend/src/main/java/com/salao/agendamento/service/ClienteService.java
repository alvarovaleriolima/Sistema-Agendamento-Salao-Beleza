package com.salao.agendamento.service;

import com.salao.agendamento.dto.*;
import com.salao.agendamento.entity.Cliente;
import com.salao.agendamento.enums.Status;
import com.salao.agendamento.exception.NegocioException;
import com.salao.agendamento.exception.RecursoNaoEncontradoException;
import com.salao.agendamento.repository.AgendamentoRepository;
import com.salao.agendamento.repository.ClienteRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
public class ClienteService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final ClienteRepository repository;
    private final AgendamentoRepository agendamentoRepository;

    public ClienteService(ClienteRepository repository,
                          @Lazy AgendamentoRepository agendamentoRepository) {
        this.repository = repository;
        this.agendamentoRepository = agendamentoRepository;
    }

    @Transactional
    public ClienteResponseDTO inserir(ClienteRequestDTO dto) {
        if (repository.existsByLogin(dto.getLogin())) {
            throw new NegocioException("Login '" + dto.getLogin() + "' já está em uso.");
        }
        Cliente c = new Cliente();
        c.setNomeCompleto(dto.getNomeCompleto());
        c.setDataNascimento(parse(dto.getDataNascimento()));
        c.setLogin(dto.getLogin());
        c.setSenha(dto.getSenha());
        c.setTelefone(dto.getTelefone());
        c.setEmail(dto.getEmail());
        c.setStatus(dto.getStatus());
        return ClienteResponseDTO.fromEntity(repository.save(c));
    }

    public List<ClienteResponseDTO> listarTodos() {
        return repository.findAll().stream().map(ClienteResponseDTO::fromEntity).toList();
    }

    public List<ClienteResponseDTO> listarAtivos() {
        return repository.findByStatus(Status.ATIVO).stream().map(ClienteResponseDTO::fromEntity).toList();
    }

    public List<ClienteResumoDTO> buscarPorNome(String nome) {
        return repository.findByNomeCompletoContainingIgnoreCase(nome)
                .stream().map(ClienteResumoDTO::fromEntity).toList();
    }

    public ClienteResponseDTO buscarPorLogin(String login) {
        return ClienteResponseDTO.fromEntity(getOrThrow(login));
    }

    @Transactional
    public ClienteResponseDTO editar(String login, ClienteUpdateDTO dto) {
        Cliente c = getOrThrow(login);

        if (dto.getNovaSenha() != null && !dto.getNovaSenha().isBlank()) {
            if (dto.getSenhaAtual() == null || !dto.getSenhaAtual().equals(c.getSenha())) {
                throw new NegocioException("Senha atual incorreta.");
            }
            c.setSenha(dto.getNovaSenha());
        }

        if (dto.getNomeCompleto() != null && !dto.getNomeCompleto().isBlank()) c.setNomeCompleto(dto.getNomeCompleto());
        if (dto.getDataNascimento() != null && !dto.getDataNascimento().isBlank()) c.setDataNascimento(parse(dto.getDataNascimento()));
        if (dto.getTelefone() != null && !dto.getTelefone().isBlank()) c.setTelefone(dto.getTelefone());
        if (dto.getEmail() != null) c.setEmail(dto.getEmail());
        if (dto.getStatus() != null) c.setStatus(dto.getStatus());

        return ClienteResponseDTO.fromEntity(repository.save(c));
    }

    @Transactional
    public void inativar(String login) {
        Cliente c = getOrThrow(login);
        if (c.getStatus() == Status.INATIVO) throw new NegocioException("Cliente já está inativo.");

        c.setStatus(Status.INATIVO);
        repository.save(c);

        // Cancela agendamentos futuros deste cliente
        agendamentoRepository.cancelarFuturosPorCliente(c, LocalDateTime.now());
    }

    public Cliente getOrThrow(String login) {
        return repository.findByLogin(login)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente '" + login + "' não encontrado."));
    }

    private LocalDate parse(String data) {
        try {
            return LocalDate.parse(data, FMT);
        } catch (DateTimeParseException e) {
            throw new NegocioException("Data inválida. Use DD/MM/AAAA.");
        }
    }
}
