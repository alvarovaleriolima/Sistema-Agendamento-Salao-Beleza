import { useState, useEffect, useCallback } from 'react';
import { api, type AgendamentoResponse, type StatusAgendamento, type ClienteResponse, type FuncionarioResponse, type ServicoResponse } from '../../../services/api';
import { SModal } from '../SModal';
import { SConfirm } from '../SConfirm';
import { SIcon } from '../SIcon';

function dtMask(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 12);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  if (d.length <= 10) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4, 8)} ${d.slice(8)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4, 8)} ${d.slice(8, 10)}:${d.slice(10)}`;
}

function formatPreco(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const STATUS_LABEL: Record<StatusAgendamento, string> = {
  AGENDADO: 'Agendado', CONCLUIDO: 'Concluído', CANCELADO: 'Cancelado',
};

function AgendamentoForm({ item, onSubmit, onCancel, loading }: {
  item?: AgendamentoResponse; onSubmit: (d: object) => void; onCancel: () => void; loading: boolean;
}) {
  const isEdit = !!item;
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [profissionais, setProfissionais] = useState<FuncionarioResponse[]>([]);
  const [servicos, setServicos] = useState<ServicoResponse[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [f, setF] = useState({
    clienteLogin: item?.clienteLogin || '',
    funcionarioLogin: item?.funcionarioLogin || '',
    servicoId: item ? String(item.servicoId) : '',
    dataHora: item?.dataHora || '',
    status: item?.status || 'AGENDADO',
    observacao: item?.observacao || '',
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit) return;
    setLoadingData(true);
    Promise.all([api.clientes.ativos(), api.funcionarios.profissionaisAtivos(), api.servicos.ativos()])
      .then(([c, p, s]) => { setClientes(c); setProfissionais(p); setServicos(s); })
      .finally(() => setLoadingData(false));
  }, [isEdit]);

  const set = (k: string, v: string) => { setF(p => ({ ...p, [k]: v })); setErros(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!isEdit) {
      if (!f.clienteLogin) e.clienteLogin = 'Obrigatório';
      if (!f.funcionarioLogin) e.funcionarioLogin = 'Obrigatório';
      if (!f.servicoId) e.servicoId = 'Obrigatório';
    }
    if (!f.dataHora.match(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/)) e.dataHora = 'Formato: DD/MM/AAAA HH:MM';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    if (isEdit) {
      onSubmit({ dataHora: f.dataHora, status: f.status, observacao: f.observacao || undefined });
    } else {
      onSubmit({
        clienteLogin: f.clienteLogin, funcionarioLogin: f.funcionarioLogin,
        servicoId: parseInt(f.servicoId), dataHora: f.dataHora,
        observacao: f.observacao || undefined,
      });
    }
  };

  if (loadingData) {
    return <div className="s-spinner-wrap"><div className="s-spinner" /></div>;
  }

  return (
    <div className="s-form-grid">
      {!isEdit && (
        <>
          <div className="s-field">
            <label className="s-label">Cliente <span className="s-req">*</span></label>
            <select className={`s-select${erros.clienteLogin ? ' error' : ''}`} value={f.clienteLogin} onChange={e => set('clienteLogin', e.target.value)}>
              <option value="">Selecione o cliente...</option>
              {clientes.map(c => <option key={c.login} value={c.login}>{c.nomeCompleto}</option>)}
            </select>
            {erros.clienteLogin && <span className="s-field-error">{erros.clienteLogin}</span>}
          </div>

          <div className="s-field">
            <label className="s-label">Profissional <span className="s-req">*</span></label>
            <select className={`s-select${erros.funcionarioLogin ? ' error' : ''}`} value={f.funcionarioLogin} onChange={e => set('funcionarioLogin', e.target.value)}>
              <option value="">Selecione o profissional...</option>
              {profissionais.map(p => (
                <option key={p.login} value={p.login}>
                  {p.nomeCompleto}{p.especialidade ? ` · ${p.especialidade.charAt(0) + p.especialidade.slice(1).toLowerCase()}` : ''}
                </option>
              ))}
            </select>
            {erros.funcionarioLogin && <span className="s-field-error">{erros.funcionarioLogin}</span>}
          </div>

          <div className="s-field s-form-full">
            <label className="s-label">Serviço <span className="s-req">*</span></label>
            <select className={`s-select${erros.servicoId ? ' error' : ''}`} value={f.servicoId} onChange={e => set('servicoId', e.target.value)}>
              <option value="">Selecione o serviço...</option>
              {servicos.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nome} · {s.duracaoMinutos}min · {formatPreco(s.preco)}
                </option>
              ))}
            </select>
            {erros.servicoId && <span className="s-field-error">{erros.servicoId}</span>}
          </div>
        </>
      )}

      {isEdit && (
        <div className="s-field s-form-full" style={{ background: 'var(--cream-dark)', borderRadius: 4, padding: '10px 12px', border: '1px solid var(--cream-darker)' }}>
          <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--ink-soft)' }}>
            <span><strong style={{ color: 'var(--ink)', display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cliente</strong>{item.clienteNome}</span>
            <span><strong style={{ color: 'var(--ink)', display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Profissional</strong>{item.funcionarioNome}</span>
            <span><strong style={{ color: 'var(--ink)', display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Serviço</strong>{item.servicoNome}</span>
          </div>
        </div>
      )}

      <div className="s-field">
        <label className="s-label">Data e Hora <span className="s-req">*</span></label>
        <input className={`s-input${erros.dataHora ? ' error' : ''}`} value={f.dataHora}
          onChange={e => set('dataHora', dtMask(e.target.value))} placeholder="DD/MM/AAAA HH:MM" />
        {erros.dataHora && <span className="s-field-error">{erros.dataHora}</span>}
      </div>

      {isEdit && (
        <div className="s-field">
          <label className="s-label">Status</label>
          <select className="s-select" value={f.status} onChange={e => set('status', e.target.value)}>
            <option value="AGENDADO">Agendado</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
      )}

      <div className="s-field s-form-full">
        <label className="s-label">Observação</label>
        <textarea className="s-textarea" value={f.observacao} onChange={e => set('observacao', e.target.value)} placeholder="Observações adicionais..." />
      </div>

      <div className="s-modal-actions s-form-full">
        <button className="s-btn-cancel" onClick={onCancel} disabled={loading}>Cancelar</button>
        <button className="s-btn-primary" onClick={submit} disabled={loading}>
          {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Agendar'}
        </button>
      </div>
    </div>
  );
}

const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'AGENDADO', label: 'Agendados' },
  { value: 'CONCLUIDO', label: 'Concluídos' },
  { value: 'CANCELADO', label: 'Cancelados' },
] as const;

export function AgendamentosPage({ toast }: { toast: (m: string, t?: 'success' | 'error') => void }) {
  const [items, setItems] = useState<AgendamentoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusAgendamento | ''>('');
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<AgendamentoResponse | undefined>();
  const [confirmItem, setConfirmItem] = useState<AgendamentoResponse | undefined>();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const load = useCallback(async (sf = statusFilter) => {
    setLoading(true);
    try { setItems(await api.agendamentos.listar(sf || undefined)); }
    catch (e: any) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleFilterChange = (v: StatusAgendamento | '') => {
    setStatusFilter(v);
    setLoading(true);
    api.agendamentos.listar(v || undefined)
      .then(setItems)
      .catch((e: any) => toast(e.message, 'error'))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (data: object) => {
    setFormLoading(true);
    try {
      if (editItem) { await api.agendamentos.editar(editItem.id, data); toast('Agendamento atualizado!'); }
      else { await api.agendamentos.criar(data); toast('Agendamento criado!'); }
      setModal(false); setEditItem(undefined); load();
    } catch (e: any) { toast(e.message, 'error'); }
    finally { setFormLoading(false); }
  };

  const handleCancelar = async () => {
    if (!confirmItem) return;
    setConfirmLoading(true);
    try {
      await api.agendamentos.cancelar(confirmItem.id);
      toast('Agendamento cancelado.');
      setConfirmItem(undefined); load();
    } catch (e: any) { toast(e.message, 'error'); }
    finally { setConfirmLoading(false); }
  };

  return (
    <>
      <div className="s-header">
        <div className="s-header-top">
          <div><h2>Agendamentos</h2><p>Gerencie os agendamentos do salão</p></div>
          <button className="s-btn-primary" onClick={() => { setEditItem(undefined); setModal(true); }}>
            <SIcon name="plus" /> Novo Agendamento
          </button>
        </div>
        <div className="s-filter-tabs">
          {STATUS_FILTERS.map(sf => (
            <button key={sf.value} className={`s-filter-tab${statusFilter === sf.value ? ' active' : ''}`}
              onClick={() => handleFilterChange(sf.value as StatusAgendamento | '')}>
              {sf.label}
            </button>
          ))}
          <button className="s-btn-icon" style={{ marginLeft: 'auto' }} onClick={() => load()} title="Recarregar"><SIcon name="refresh" size={14} /></button>
        </div>
      </div>

      <div className="s-content">
        {loading ? (
          <div className="s-spinner-wrap"><div className="s-spinner" /></div>
        ) : items.length === 0 ? (
          <div className="s-empty">
            <div className="s-empty-icon">📅</div>
            <p>Nenhum agendamento encontrado</p>
            <small>Crie um novo agendamento para começar</small>
          </div>
        ) : (
          <div className="s-table-wrap">
            <table>
              <thead>
                <tr>{['Data e Hora', 'Cliente', 'Profissional', 'Serviço', 'Valor', 'Status', 'Ações'].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="s-cell-name" style={{ fontFamily: 'var(--font-display)', fontSize: 15 }}>
                        {item.dataHora.split(' ')[0]}
                      </div>
                      <div className="s-cell-sub">{item.dataHora.split(' ')[1]}</div>
                    </td>
                    <td>
                      <div className="s-cell-name">{item.clienteNome}</div>
                      <div className="s-cell-sub s-cell-mono">{item.clienteLogin}</div>
                    </td>
                    <td>
                      <div className="s-cell-name">{item.funcionarioNome}</div>
                      <div className="s-cell-sub s-cell-mono">{item.funcionarioLogin}</div>
                    </td>
                    <td>
                      <div>{item.servicoNome}</div>
                      <div className="s-cell-sub">{item.duracaoMinutos} min</div>
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--ink-soft)' }}>{formatPreco(item.valorServico)}</td>
                    <td>
                      <span className={`s-badge s-badge-${item.status.toLowerCase()}`}>
                        <span className="s-badge-dot" />{STATUS_LABEL[item.status]}
                      </span>
                      {item.observacao && <div className="s-cell-sub" style={{ marginTop: 3 }}>{item.observacao}</div>}
                    </td>
                    <td>
                      <div className="s-actions">
                        {item.status !== 'CANCELADO' && (
                          <button className="s-action-btn" onClick={() => { setEditItem(item); setModal(true); }} title="Editar"><SIcon name="edit" size={13} /></button>
                        )}
                        {item.status === 'AGENDADO' && (
                          <button className="s-action-btn danger" onClick={() => setConfirmItem(item)} title="Cancelar"><SIcon name="ban" size={13} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="s-table-footer">{items.length} {items.length === 1 ? 'agendamento' : 'agendamentos'}</div>
          </div>
        )}
      </div>

      <SModal open={modal} onClose={() => { setModal(false); setEditItem(undefined); }}
        title={editItem ? 'Editar Agendamento' : 'Novo Agendamento'} large>
        <AgendamentoForm item={editItem} onSubmit={handleSubmit}
          onCancel={() => { setModal(false); setEditItem(undefined); }} loading={formLoading} />
      </SModal>

      <SConfirm open={!!confirmItem} title="Cancelar Agendamento"
        message={`Cancelar o agendamento de "${confirmItem?.clienteNome}" em ${confirmItem?.dataHora}?`}
        confirmLabel="Cancelar Agendamento" onConfirm={handleCancelar}
        onCancel={() => setConfirmItem(undefined)} loading={confirmLoading} />
    </>
  );
}
