import { useState, useEffect } from 'react';
import { api, type AgendamentoResponse, type ClienteResponse, type FuncionarioResponse, type ServicoResponse, type AuthSession } from '../../../services/api';

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

export function AgendamentoForm({ item, session, onSubmit, onCancel, loading, initialServicoId }: {
  item?: AgendamentoResponse; session: AuthSession; onSubmit: (d: object) => void; onCancel: () => void; loading: boolean; initialServicoId?: string;
}) {
  const isEdit = !!item;
  const isCliente = session.tipo === 'cliente';
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [profissionais, setProfissionais] = useState<FuncionarioResponse[]>([]);
  const [servicos, setServicos] = useState<ServicoResponse[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [f, setF] = useState({
    clienteLogin: item?.clienteLogin || (isCliente ? session.usuario.login : ''),
    funcionarioLogin: item?.funcionarioLogin || '',
    servicoId: item ? String(item.servicoId) : (initialServicoId || ''),
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
            {isCliente ? (
              <input className="s-input" value={session.usuario.nomeCompleto} disabled />
            ) : (
              <>
                <select className={`s-select${erros.clienteLogin ? ' error' : ''}`} value={f.clienteLogin} onChange={e => set('clienteLogin', e.target.value)}>
                  <option value="">Selecione o cliente...</option>
                  {clientes.map(c => <option key={c.login} value={c.login}>{c.nomeCompleto}</option>)}
                </select>
                {erros.clienteLogin && <span className="s-field-error">{erros.clienteLogin}</span>}
              </>
            )}
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
            {initialServicoId ? (
               <input className="s-input" value={servicos.find(s => String(s.id) === initialServicoId)?.nome || ''} disabled />
            ) : (
              <select className={`s-select${erros.servicoId ? ' error' : ''}`} value={f.servicoId} onChange={e => set('servicoId', e.target.value)}>
                <option value="">Selecione o serviço...</option>
                {servicos.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nome} · {s.duracaoMinutos}min · {formatPreco(s.preco)}
                  </option>
                ))}
              </select>
            )}
            {erros.servicoId && !initialServicoId && <span className="s-field-error">{erros.servicoId}</span>}
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
