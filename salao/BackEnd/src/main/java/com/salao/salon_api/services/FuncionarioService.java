package com.salao.salon_api.services;

import com.salao.salon_api.dto.funcionario.DetalheResponse;
import com.salao.salon_api.dto.funcionario.EditarRequest;
import com.salao.salon_api.dto.funcionario.InserirRequest;
import com.salao.salon_api.dto.funcionario.ResumoNomeResponse;
import com.salao.salon_api.dto.funcionario.ResumoPerfilResponse;
import com.salao.salon_api.enums.PerfilFuncionario;
import com.salao.salon_api.enums.Status;
import com.salao.salon_api.exceptions.RecursoNaoEncontradoException;
import com.salao.salon_api.exceptions.RegraDeNegocioException;
import com.salao.salon_api.models.Funcionario;
import com.salao.salon_api.repositories.FuncionarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Regras de negócio para Funcionário — RFS01, RFS02, RFS03, RFS04.
 */
@Service
@RequiredArgsConstructor
public class FuncionarioService {

    private final FuncionarioRepository repository;

    // -----------------------------------------------------------------------
    // RFS01 – Inserir Funcionário
    // -----------------------------------------------------------------------
    @Transactional
    public DetalheResponse inserir(InserirRequest dto) {
        validarLoginUnico(dto.login());
        validarCamposProfissional(dto.perfil(), dto.especialidade(), dto.horarioTrabalho());

        Funcionario f = Funcionario.builder()
                .nomeCompleto(dto.nomeCompleto())
                .login(dto.login())
                .senha(dto.senha())
                .perfil(dto.perfil())
                .telefone(dto.telefone())
                .email(dto.email())
                .status(Status.ATIVO)
                .especialidade(dto.especialidade())
                .horarioTrabalho(dto.horarioTrabalho())
                .build();

        return DetalheResponse.from(repository.save(f));
    }

    // -----------------------------------------------------------------------
    // RFS02 – Consultar Funcionário
    // -----------------------------------------------------------------------

    /** Busca por login — retorna dados completos (sem senha) */
    @Transactional(readOnly = true)
    public DetalheResponse consultarPorLogin(String login) {
        return DetalheResponse.from(buscarPorLoginOuLancar(login));
    }

    /** Busca por nome — retorna login + perfil de cada resultado */
    @Transactional(readOnly = true)
    public List<ResumoNomeResponse> consultarPorNome(String nome) {
        return repository.findByNomeCompletoContainingIgnoreCase(nome)
                .stream()
                .map(ResumoNomeResponse::from)
                .toList();
    }

    /** Busca por perfil — retorna login + nome de cada resultado */
    @Transactional(readOnly = true)
    public List<ResumoPerfilResponse> consultarPorPerfil(PerfilFuncionario perfil) {
        return repository.findByPerfil(perfil)
                .stream()
                .map(ResumoPerfilResponse::from)
                .toList();
    }
    @Transactional(readOnly = true)
    public List<DetalheResponse> listarTodos() {
        return repository.findAll()
            .stream()
            .map(DetalheResponse::from)
            .toList();
    }

    // -----------------------------------------------------------------------
    // RFS03 – Editar Funcionário
    // Login não pode ser alterado; Status não pode ser alterado aqui.
    // -----------------------------------------------------------------------
    @Transactional
    public DetalheResponse editar(String login, EditarRequest dto) {
        Funcionario f = buscarPorLoginOuLancar(login);
        validarCamposProfissional(dto.perfil(), dto.especialidade(), dto.horarioTrabalho());

        f.setNomeCompleto(dto.nomeCompleto());
        f.setSenha(dto.senha());
        f.setPerfil(dto.perfil());
        f.setTelefone(dto.telefone());
        f.setEmail(dto.email());
        f.setEspecialidade(dto.especialidade());
        f.setHorarioTrabalho(dto.horarioTrabalho());
        // Status NÃO é alterado aqui (RFS03 – Nota)

        return DetalheResponse.from(repository.save(f));
    }

    // -----------------------------------------------------------------------
    // RFS04 – Inativar Funcionário
    // -----------------------------------------------------------------------
    @Transactional
    public void inativar(String login) {
        Funcionario f = buscarPorLoginOuLancar(login);

        if (f.getStatus() == Status.INATIVO) {
            throw new RegraDeNegocioException("Funcionário já está inativo.");
        }

        f.setStatus(Status.INATIVO);
        repository.save(f);
        // TODO: cancelar agendamentos futuros e executar RFS19 (NotificacaoService)
    }

    // -----------------------------------------------------------------------
    // Helpers internos
    // -----------------------------------------------------------------------

    private Funcionario buscarPorLoginOuLancar(String login) {
        return repository.findByLogin(login)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Funcionário não encontrado com o login: " + login));
    }

    private void validarLoginUnico(String login) {
        if (repository.existsByLogin(login)) {
            throw new RegraDeNegocioException(
                    "Já existe um funcionário cadastrado com o login: " + login);
        }
    }

    /**
     * RFS01: quando perfil = PROFISSIONAL, especialidade e horário são obrigatórios.
     */
    private void validarCamposProfissional(PerfilFuncionario perfil,
                                            String especialidade,
                                            String horarioTrabalho) {
        if (perfil == PerfilFuncionario.PROFISSIONAL) {
            if (especialidade == null || especialidade.isBlank()) {
                throw new RegraDeNegocioException(
                        "Campo 'especialidade' é obrigatório para o perfil PROFISSIONAL.");
            }
            if (horarioTrabalho == null || horarioTrabalho.isBlank()) {
                throw new RegraDeNegocioException(
                        "Campo 'horarioTrabalho' é obrigatório para o perfil PROFISSIONAL.");
            }
        }
    }
}
