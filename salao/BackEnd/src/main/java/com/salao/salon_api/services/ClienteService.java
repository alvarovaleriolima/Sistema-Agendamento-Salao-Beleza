package com.salao.salon_api.services;

import com.salao.salon_api.dto.cliente.DetalheResponse;
import com.salao.salon_api.dto.cliente.EditarRequest;
import com.salao.salon_api.dto.cliente.InserirRequest;
import com.salao.salon_api.dto.cliente.ResumoNomeResponse;
import com.salao.salon_api.enums.Status;
import com.salao.salon_api.exceptions.RecursoNaoEncontradoException;
import com.salao.salon_api.exceptions.RegraDeNegocioException;
import com.salao.salon_api.models.Cliente;
import com.salao.salon_api.repositories.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Regras de negócio para Cliente — RFS05, RFS06, RFS07, RFS08.
 */
@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository repository;

    // -----------------------------------------------------------------------
    // RFS05 – Inserir Cliente
    // -----------------------------------------------------------------------
    @Transactional
    public DetalheResponse inserir(InserirRequest dto) {
        validarLoginUnico(dto.login());

        Cliente c = Cliente.builder()
                .nomeCompleto(dto.nomeCompleto())
                .dataNascimento(dto.dataNascimento())
                .login(dto.login())
                .senha(dto.senha())
                .telefone(dto.telefone())
                .email(dto.email())
                .status(Status.ATIVO)
                .build();

        return DetalheResponse.from(repository.save(c));
    }

    // -----------------------------------------------------------------------
    // RFS06 – Consultar Cliente
    // -----------------------------------------------------------------------

    /** Busca por login — retorna dados completos (sem senha) */
    @Transactional(readOnly = true)
    public DetalheResponse consultarPorLogin(String login) {
        return DetalheResponse.from(buscarPorLoginOuLancar(login));
    }

    /** Busca por nome — retorna login de cada resultado (RFS06) */
    @Transactional(readOnly = true)
    public List<ResumoNomeResponse> consultarPorNome(String nome) {
        return repository.findByNomeCompletoContainingIgnoreCase(nome)
                .stream()
                .map(ResumoNomeResponse::from)
                .toList();
    }

    // -----------------------------------------------------------------------
    // RFS07 – Editar Cliente
    // Login não pode ser alterado; Status não pode ser alterado aqui.
    // -----------------------------------------------------------------------
    @Transactional
    public DetalheResponse editar(String login, EditarRequest dto) {
        Cliente c = buscarPorLoginOuLancar(login);

        c.setNomeCompleto(dto.nomeCompleto());
        c.setDataNascimento(dto.dataNascimento());
        c.setSenha(dto.senha());
        c.setTelefone(dto.telefone());
        c.setEmail(dto.email());
        // Status NÃO é alterado aqui (RFS07 – Nota)

        return DetalheResponse.from(repository.save(c));
    }

    // -----------------------------------------------------------------------
    // RFS08 – Inativar Cliente
    // -----------------------------------------------------------------------
    @Transactional
    public void inativar(String login) {
        Cliente c = buscarPorLoginOuLancar(login);

        if (c.getStatus() == Status.INATIVO) {
            throw new RegraDeNegocioException("Cliente já está inativo.");
        }

        c.setStatus(Status.INATIVO);
        repository.save(c);
        // TODO: cancelar agendamentos futuros, liberar horário e executar RFS19
    }
    // -----------------------------------------------------------------------
    // Listar todos os clientes (endpoint adicional para facilitar testes)
    // -----------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<DetalheResponse> listarTodos() {
        return repository.findAll()
            .stream()
            .map(DetalheResponse::from)
            .toList();
    }

    // -----------------------------------------------------------------------
    // Helpers internos
    // -----------------------------------------------------------------------

    private Cliente buscarPorLoginOuLancar(String login) {
        return repository.findByLogin(login)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Cliente não encontrado com o login: " + login));
    }

    private void validarLoginUnico(String login) {
        if (repository.existsByLogin(login)) {
            throw new RegraDeNegocioException(
                    "Já existe um cliente cadastrado com o login: " + login);
        }
    }
}
