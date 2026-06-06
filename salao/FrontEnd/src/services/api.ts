const BASE_URL = 'http://localhost:8080/api';

// ── Types ────────────────────────────────────────────────────────────────────

export type PerfilFuncionario = 'ADMINISTRADOR' | 'RECEPCIONISTA' | 'PROFISSIONAL';
export type Especialidade =
  | 'CABELO' | 'MANICURE' | 'PEDICURE' | 'ESTETICA'
  | 'MAQUIAGEM' | 'DEPILACAO' | 'SOBRANCELHA' | 'MASSAGEM';
export type Status = 'ATIVO' | 'INATIVO';

export interface FuncionarioResponse {
  id: number;
  nomeCompleto: string;
  login: string;
  perfil: PerfilFuncionario;
  telefone: string;
  email?: string;
  status: Status;
  especialidade?: Especialidade;
  horarioTrabalho?: string;
}

export interface FuncionarioRequest {
  nomeCompleto: string;
  login: string;
  senha: string;
  perfil: PerfilFuncionario;
  telefone: string;
  email?: string;
  status: Status;
  especialidade?: Especialidade;
  horarioTrabalho?: string;
}

export interface FuncionarioUpdateRequest {
  nomeCompleto?: string;
  novaSenha?: string;
  senhaAtual?: string;
  perfil?: PerfilFuncionario;
  telefone?: string;
  email?: string;
  status?: Status;
  especialidade?: Especialidade;
  horarioTrabalho?: string;
}

export interface ClienteResponse {
  id: number;
  nomeCompleto: string;
  dataNascimento: string;
  login: string;
  telefone: string;
  email?: string;
  status: Status;
}

export interface ClienteRequest {
  nomeCompleto: string;
  dataNascimento: string;
  login: string;
  senha: string;
  telefone: string;
  email?: string;
  status: Status;
}

export interface ClienteUpdateRequest {
  nomeCompleto?: string;
  dataNascimento?: string;
  novaSenha?: string;
  senhaAtual?: string;
  telefone?: string;
  email?: string;
  status?: Status;
}

export interface ApiError {
  status: number;
  erro?: string;
  erros?: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const data = await res.json();
  if (!res.ok) {
    const apiError = data as ApiError;
    const message = apiError.erro
      ?? apiError.erros?.join(' | ')
      ?? 'Erro desconhecido';
    throw new Error(message);
  }
  return data as T;
}

function json(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

// ── Funcionários API ─────────────────────────────────────────────────────────

export const funcionariosApi = {
  listarTodos: (): Promise<FuncionarioResponse[]> =>
    fetch(`${BASE_URL}/funcionarios`).then(r => handleResponse<FuncionarioResponse[]>(r)),

  buscarPorNome: (nome: string): Promise<FuncionarioResponse[]> =>
    fetch(`${BASE_URL}/funcionarios/nome?nome=${encodeURIComponent(nome)}`).then(r => handleResponse<FuncionarioResponse[]>(r)),

  buscarPorLogin: (login: string): Promise<FuncionarioResponse> =>
    fetch(`${BASE_URL}/funcionarios/login/${encodeURIComponent(login)}`).then(r => handleResponse<FuncionarioResponse>(r)),

  buscarPorPerfil: (perfil: PerfilFuncionario): Promise<FuncionarioResponse[]> =>
    fetch(`${BASE_URL}/funcionarios/perfil?perfil=${perfil}`).then(r => handleResponse<FuncionarioResponse[]>(r)),

  criar: (data: FuncionarioRequest): Promise<FuncionarioResponse> =>
    fetch(`${BASE_URL}/funcionarios`, json('POST', data)).then(r => handleResponse<FuncionarioResponse>(r)),

  editar: (login: string, data: FuncionarioUpdateRequest): Promise<FuncionarioResponse> =>
    fetch(`${BASE_URL}/funcionarios/${encodeURIComponent(login)}`, json('PUT', data)).then(r => handleResponse<FuncionarioResponse>(r)),

  inativar: (login: string): Promise<void> =>
    fetch(`${BASE_URL}/funcionarios/${encodeURIComponent(login)}/inativar`, { method: 'PATCH' }).then(r => handleResponse<void>(r)),
};

// ── Clientes API ─────────────────────────────────────────────────────────────

export const clientesApi = {
  listarTodos: (): Promise<ClienteResponse[]> =>
    fetch(`${BASE_URL}/clientes`).then(r => handleResponse<ClienteResponse[]>(r)),

  buscarPorNome: (nome: string): Promise<ClienteResponse[]> =>
    fetch(`${BASE_URL}/clientes/nome?nome=${encodeURIComponent(nome)}`).then(r => handleResponse<ClienteResponse[]>(r)),

  buscarPorLogin: (login: string): Promise<ClienteResponse> =>
    fetch(`${BASE_URL}/clientes/login/${encodeURIComponent(login)}`).then(r => handleResponse<ClienteResponse>(r)),

  criar: (data: ClienteRequest): Promise<ClienteResponse> =>
    fetch(`${BASE_URL}/clientes`, json('POST', data)).then(r => handleResponse<ClienteResponse>(r)),

  editar: (login: string, data: ClienteUpdateRequest): Promise<ClienteResponse> =>
    fetch(`${BASE_URL}/clientes/${encodeURIComponent(login)}`, json('PUT', data)).then(r => handleResponse<ClienteResponse>(r)),

  inativar: (login: string): Promise<void> =>
    fetch(`${BASE_URL}/clientes/${encodeURIComponent(login)}/inativar`, { method: 'PATCH' }).then(r => handleResponse<void>(r)),
};