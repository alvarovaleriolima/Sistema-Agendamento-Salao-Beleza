const BASE = 'http://localhost:8080/api';

export type PerfilFuncionario = 'ADMINISTRADOR' | 'RECEPCIONISTA' | 'PROFISSIONAL';
export type Especialidade = 'CABELO' | 'MANICURE' | 'PEDICURE' | 'ESTETICA' | 'MAQUIAGEM' | 'DEPILACAO' | 'SOBRANCELHA' | 'MASSAGEM';
export type Status = 'ATIVO' | 'INATIVO';
export type StatusAgendamento = 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO';
export type FormaPagamento = 'DINHEIRO' | 'PIX' | 'CARTAO_DEBITO' | 'CARTAO_CREDITO';
export type StatusPagamento = 'PAGO' | 'PENDENTE';

export interface FuncionarioResponse {
  id: number; nomeCompleto: string; login: string; perfil: PerfilFuncionario;
  telefone: string; email?: string; status: Status;
  especialidade?: Especialidade; horarioTrabalho?: string;
}

export interface ClienteResponse {
  id: number; nomeCompleto: string; dataNascimento: string;
  login: string; telefone: string; email?: string; status: Status;
}

export interface ServicoResponse {
  id: number; nome: string; descricao?: string;
  preco: number; duracaoMinutos: number; status: Status;
}

export interface AgendamentoResponse {
  id: number;
  clienteLogin: string; clienteNome: string;
  funcionarioLogin: string; funcionarioNome: string;
  servicoId: number; servicoNome: string;
  valorServico: number; duracaoMinutos: number;
  dataHora: string; status: StatusAgendamento; observacao?: string;
}

export interface PagamentoResponse {
  id: number;
  clienteId: number;
  agendamentoId: number;
  clienteNome: string;
  servicoNome: string;
  profissionalNome: string;
  dataHoraAgendamento: string;
  dataPagamento?: string; // dd/MM/yyyy, vem nulo enquanto PENDENTE
  valor: number;
  formaPagamento?: FormaPagamento;
  status: StatusPagamento;
}

export type AuthSession =
  | { tipo: 'funcionario'; usuario: FuncionarioResponse }
  | { tipo: 'cliente'; usuario: ClienteResponse };

export interface FaturamentoReportItemDTO {
  agendamentoId: number;
  clienteNome: string;
  servicoNome: string;
  profissionalNome: string;
  dataHoraAgendamento: string;
  valorServico: number;
  statusAgendamento: string;
}

export interface FaturamentoReportDTO {
  itens: FaturamentoReportItemDTO[];
  totalBruto: number;
}

export interface ServicoRankingItemDTO {
  servicoNome: string;
  count: number;
}

export interface ProfissionalPerformanceItemDTO {
  profissionalNome: string;
  count: number;
}

export interface DesempenhoReportDTO {
  servicoRanking: ServicoRankingItemDTO[];
  profissionalPerformance: ProfissionalPerformanceItemDTO[];
  canceladosCount: number;
}

export interface HistoricoAtendimentoResponse {
  data: string;
  servico: string;
  profissional: string;
  valor: number;
}

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const opts: RequestInit = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  if (res.status === 204) return undefined as T;
  const data = await res.json();
  if (!res.ok) {
    const msg = data.erro || data.message || 'Erro desconhecido';
    const erros = data.erros ? Object.values(data.erros).join(' | ') : null;
    throw new Error(erros || msg);
  }
  return data as T;
}

export const api = {
  funcionarios: {
    listar: () => req<FuncionarioResponse[]>('GET', '/funcionarios'),
    buscarNome: (n: string) => req<FuncionarioResponse[]>('GET', `/funcionarios/nome?nome=${encodeURIComponent(n)}`),
    buscarLogin: (l: string) => req<FuncionarioResponse>('GET', `/funcionarios/login/${encodeURIComponent(l)}`),
    buscarPerfil: (p: string) => req<FuncionarioResponse[]>('GET', `/funcionarios/perfil?perfil=${p}`),
    profissionaisAtivos: () => req<FuncionarioResponse[]>('GET', '/funcionarios/profissionais-ativos'),
    criar: (d: object) => req<FuncionarioResponse>('POST', '/funcionarios', d),
    editar: (login: string, d: object) => req<FuncionarioResponse>('PUT', `/funcionarios/${encodeURIComponent(login)}`, d),
    inativar: (login: string) => req<void>('PATCH', `/funcionarios/${encodeURIComponent(login)}/inativar`),
  },
  clientes: {
    listar: () => req<ClienteResponse[]>('GET', '/clientes'),
    buscarNome: (n: string) => req<ClienteResponse[]>('GET', `/clientes/nome?nome=${encodeURIComponent(n)}`),
    buscarLogin: (l: string) => req<ClienteResponse>('GET', `/clientes/login/${encodeURIComponent(l)}`),
    ativos: () => req<ClienteResponse[]>('GET', '/clientes/ativos'),
    criar: (d: object) => req<ClienteResponse>('POST', '/clientes', d),
    editar: (login: string, d: object) => req<ClienteResponse>('PUT', `/clientes/${encodeURIComponent(login)}`, d),
    inativar: (login: string) => req<void>('PATCH', `/clientes/${encodeURIComponent(login)}/inativar`),
    excluirLgpd: (login: string) => req<void>('DELETE', `/clientes/${encodeURIComponent(login)}/lgpd`),
    historico: (login: string) => req<HistoricoAtendimentoResponse[]>('GET', `/clientes/${encodeURIComponent(login)}/historico`),
  },
  servicos: {
    listar: () => req<ServicoResponse[]>('GET', '/servicos'),
    ativos: () => req<ServicoResponse[]>('GET', '/servicos/ativos'),
    criar: (d: object) => req<ServicoResponse>('POST', '/servicos', d),
    editar: (id: number, d: object) => req<ServicoResponse>('PUT', `/servicos/${id}`, d),
    inativar: (id: number) => req<void>('PATCH', `/servicos/${id}/inativar`),
  },
  agendamentos: {
    listar: (status?: string) => req<AgendamentoResponse[]>('GET', status ? `/agendamentos?status=${status}` : '/agendamentos'),
    criar: (d: object) => req<AgendamentoResponse>('POST', '/agendamentos', d),
    editar: (id: number, d: object) => req<AgendamentoResponse>('PUT', `/agendamentos/${id}`, d),
    cancelar: (id: number) => req<void>('PATCH', `/agendamentos/${id}/cancelar`),
  },
  pagamentos: {
    listar: () => req<PagamentoResponse[]>('GET', '/pagamentos'),
    porCliente: (clienteId: number) => req<PagamentoResponse[]>('GET', `/pagamentos/cliente/${clienteId}`),
    porAgendamento: (agendamentoId: number) => req<PagamentoResponse[]>('GET', `/pagamentos/agendamento/${agendamentoId}`),
    porStatus: (status: StatusPagamento) => req<PagamentoResponse[]>('GET', `/pagamentos/status/${status}`),
    criar: (d: object) => req<PagamentoResponse>('POST', '/pagamentos', d),
    editar: (id: number, d: object) => req<PagamentoResponse>('PUT', `/pagamentos/${id}`, d),
    excluir: (id: number) => req<void>('DELETE', `/pagamentos/${id}`),
  },
  auth: {
    loginFuncionario: (login: string, senha: string) =>
      req<FuncionarioResponse>('POST', '/auth/funcionario/login', { login, senha }),
    loginCliente: (login: string, senha: string) =>
      req<ClienteResponse>('POST', '/auth/cliente/login', { login, senha }),
  },
  relatorios: {
    faturamento: (inicio: string, fim: string, funcId?: number) => {
      let q = `?dataInicio=${encodeURIComponent(inicio)}&dataFim=${encodeURIComponent(fim)}`;
      if (funcId) q += `&funcionarioId=${funcId}`;
      return req<FaturamentoReportDTO>('GET', `/relatorios/faturamento${q}`);
    },
    desempenho: (inicio: string, fim: string) => {
      const q = `?dataInicio=${encodeURIComponent(inicio)}&dataFim=${encodeURIComponent(fim)}`;
      return req<DesempenhoReportDTO>('GET', `/relatorios/desempenho${q}`);
    }
  },
};