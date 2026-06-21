package com.salao.agendamento.service;

import com.salao.agendamento.dto.*;
import com.salao.agendamento.entity.Agendamento;
import com.salao.agendamento.entity.Funcionario;
import com.salao.agendamento.enums.PerfilFuncionario;
import com.salao.agendamento.enums.Status;
import com.salao.agendamento.enums.StatusAgendamento;
import com.salao.agendamento.exception.NegocioException;
import com.salao.agendamento.exception.RecursoNaoEncontradoException;
import com.salao.agendamento.repository.AgendamentoRepository;
import com.salao.agendamento.repository.FuncionarioRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FuncionarioService {

private final FuncionarioRepository repository;
private final AgendamentoRepository agendamentoRepository;
private final AgendamentoCancelamentoService agendamentoCancelamentoService;

public FuncionarioService(FuncionarioRepository repository,
                          AgendamentoRepository agendamentoRepository,
                          AgendamentoCancelamentoService agendamentoCancelamentoService) {
    this.repository = repository;
    this.agendamentoRepository = agendamentoRepository;
    this.agendamentoCancelamentoService = agendamentoCancelamentoService;
}

    @Transactional
    public FuncionarioResponseDTO inserir(FuncionarioRequestDTO dto) {
        if (repository.existsByLogin(dto.getLogin())) {
            throw new NegocioException("Login '" + dto.getLogin() + "' já está em uso.");
        }
        validarCamposProfissional(dto.getPerfil(), dto.getEspecialidade(), dto.getHorarioTrabalho());

        Funcionario f = new Funcionario();
        f.setNomeCompleto(dto.getNomeCompleto());
        f.setLogin(dto.getLogin());
        f.setSenha(dto.getSenha());
        f.setPerfil(dto.getPerfil());
        f.setTelefone(dto.getTelefone());
        f.setEmail(dto.getEmail());
        f.setStatus(dto.getStatus());
        f.setEspecialidade(dto.getEspecialidade());
        f.setHorarioTrabalho(dto.getHorarioTrabalho());

        return FuncionarioResponseDTO.fromEntity(repository.save(f));
    }

    public List<FuncionarioResponseDTO> listarTodos() {
        return repository.findAll().stream().map(FuncionarioResponseDTO::fromEntity).toList();
    }

    public List<FuncionarioResponseDTO> listarProfissionaisAtivos() {
        return repository.findByPerfilAndStatus(PerfilFuncionario.PROFISSIONAL, Status.ATIVO)
                .stream().map(FuncionarioResponseDTO::fromEntity).toList();
    }

    public List<FuncionarioResumoDTO> buscarPorNome(String nome) {
        return repository.findByNomeCompletoContainingIgnoreCase(nome)
                .stream().map(FuncionarioResumoDTO::fromEntity).toList();
    }

    public FuncionarioResponseDTO buscarPorLogin(String login) {
        return FuncionarioResponseDTO.fromEntity(getOrThrow(login));
    }

    public List<FuncionarioResumoDTO> buscarPorPerfil(PerfilFuncionario perfil) {
        return repository.findByPerfil(perfil)
                .stream().map(FuncionarioResumoDTO::fromEntity).toList();
    }

    @Transactional
    public FuncionarioResponseDTO editar(String login, FuncionarioUpdateDTO dto) {
        Funcionario f = getOrThrow(login);

        if (dto.getNovaSenha() != null && !dto.getNovaSenha().isBlank()) {
            if (dto.getSenhaAtual() == null || !dto.getSenhaAtual().equals(f.getSenha())) {
                throw new NegocioException("Senha atual incorreta.");
            }
            f.setSenha(dto.getNovaSenha());
        }

        if (dto.getNomeCompleto() != null && !dto.getNomeCompleto().isBlank()) f.setNomeCompleto(dto.getNomeCompleto());
        if (dto.getPerfil() != null) f.setPerfil(dto.getPerfil());
        if (dto.getTelefone() != null && !dto.getTelefone().isBlank()) f.setTelefone(dto.getTelefone());
        if (dto.getEmail() != null) f.setEmail(dto.getEmail());
        if (dto.getStatus() != null) f.setStatus(dto.getStatus());
        if (dto.getEspecialidade() != null) f.setEspecialidade(dto.getEspecialidade());
        if (dto.getHorarioTrabalho() != null) f.setHorarioTrabalho(dto.getHorarioTrabalho());

        validarCamposProfissional(f.getPerfil(), f.getEspecialidade(), f.getHorarioTrabalho());
        return FuncionarioResponseDTO.fromEntity(repository.save(f));
    }

    @Transactional
    public void inativar(String login) {
        Funcionario f = getOrThrow(login);
        if (f.getStatus() == Status.INATIVO) throw new NegocioException("Funcionário já está inativo.");

        // Cancel future agendamentos and send notifications
        LocalDateTime agora = LocalDateTime.now();
        List<Agendamento> futuros = agendamentoRepository.findByFuncionarioAndDataHoraAfterAndStatus(f, agora, StatusAgendamento.AGENDADO);
        for (Agendamento a : futuros) {
            agendamentoCancelamentoService.cancelar(a.getId());
        }

        f.setStatus(Status.INATIVO);
        repository.save(f);
    }

    public Funcionario getOrThrow(String login) {
        return repository.findByLogin(login)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Funcionário '" + login + "' não encontrado."));
    }

    private void validarCamposProfissional(PerfilFuncionario perfil, Object especialidade, String horario) {
        if (perfil == PerfilFuncionario.PROFISSIONAL) {
            if (especialidade == null) throw new NegocioException("Especialidade é obrigatória para Profissional.");
            if (horario == null || horario.isBlank()) throw new NegocioException("Horário de trabalho é obrigatório para Profissional.");
        }
    }
}
