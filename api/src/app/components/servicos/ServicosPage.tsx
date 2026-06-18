import { useState, useEffect, useCallback } from 'react';
import { api, type ServicoResponse } from '../../../services/api';
import { SModal } from '../SModal';
import { SConfirm } from '../SConfirm';
import { SIcon } from '../SIcon';

function formatPreco(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function ServicoForm({ item, onSubmit, onCancel, loading }: {
  item?: ServicoResponse; onSubmit: (d: object) => void; onCancel: () => void; loading: boolean;
}) {
  const [f, setF] = useState({
    nome: item?.nome || '', descricao: item?.descricao || '',
    preco: item ? String(item.preco) : '',
    duracaoMinutos: item ? String(item.duracaoMinutos) : '',
    status: item?.status || 'ATIVO',
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => { setF(p => ({ ...p, [k]: v })); setErros(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!f.nome.trim()) e.nome = 'Obrigatório';
    const preco = parseFloat(f.preco.replace(',', '.'));
    if (isNaN(preco) || preco <= 0) e.preco = 'Informe um valor válido';
    const dur = parseInt(f.duracaoMinutos);
    if (isNaN(dur) || dur < 5) e.duracaoMinutos = 'Mínimo 5 minutos';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    onSubmit({
      nome: f.nome, descricao: f.descricao || undefined,
      preco: parseFloat(f.preco.replace(',', '.')),
      duracaoMinutos: parseInt(f.duracaoMinutos),
      status: f.status,
    });
  };

  return (
    <div className="s-form-grid">
      <div className="s-field s-form-full">
        <label className="s-label">Nome do Serviço <span className="s-req">*</span></label>
        <input className={`s-input${erros.nome ? ' error' : ''}`} value={f.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex: Corte feminino" />
        {erros.nome && <span className="s-field-error">{erros.nome}</span>}
      </div>

      <div className="s-field s-form-full">
        <label className="s-label">Descrição</label>
        <textarea className="s-textarea" value={f.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Descrição opcional do serviço" />
      </div>

      <div className="s-field">
        <label className="s-label">Preço (R$) <span className="s-req">*</span></label>
        <input className={`s-input${erros.preco ? ' error' : ''}`} value={f.preco} onChange={e => set('preco', e.target.value)} placeholder="Ex: 85.00" />
        {erros.preco && <span className="s-field-error">{erros.preco}</span>}
      </div>

      <div className="s-field">
        <label className="s-label">Duração (minutos) <span className="s-req">*</span></label>
        <input type="number" min="5" className={`s-input${erros.duracaoMinutos ? ' error' : ''}`} value={f.duracaoMinutos} onChange={e => set('duracaoMinutos', e.target.value)} placeholder="Ex: 60" />
        {erros.duracaoMinutos && <span className="s-field-error">{erros.duracaoMinutos}</span>}
      </div>

      <div className="s-field">
        <label className="s-label">Status</label>
        <select className="s-select" value={f.status} onChange={e => set('status', e.target.value)}>
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
        </select>
      </div>

      <div className="s-modal-actions s-form-full">
        <button className="s-btn-cancel" onClick={onCancel} disabled={loading}>Cancelar</button>
        <button className="s-btn-primary" onClick={submit} disabled={loading}>
          {loading ? 'Salvando...' : item ? 'Salvar Alterações' : 'Cadastrar'}
        </button>
      </div>
    </div>
  );
}

export function ServicosPage({ toast }: { toast: (m: string, t?: 'success' | 'error') => void }) {
  const [items, setItems] = useState<ServicoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<ServicoResponse | undefined>();
  const [confirmItem, setConfirmItem] = useState<ServicoResponse | undefined>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'ATIVO' | 'INATIVO'>('TODOS');

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api.servicos.listar()); }
    catch (e: any) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = statusFilter === 'TODOS' ? items : items.filter(i => i.status === statusFilter);

  const handleSubmit = async (data: object) => {
    setFormLoading(true);
    try {
      if (editItem) { await api.servicos.editar(editItem.id, data); toast('Serviço atualizado!'); }
      else { await api.servicos.criar(data); toast('Serviço cadastrado!'); }
      setModal(false); setEditItem(undefined); load();
    } catch (e: any) { toast(e.message, 'error'); }
    finally { setFormLoading(false); }
  };

  const handleInativar = async () => {
    if (!confirmItem) return;
    setConfirmLoading(true);
    try {
      await api.servicos.inativar(confirmItem.id);
      toast(`Serviço "${confirmItem.nome}" inativado.`);
      setConfirmItem(undefined); load();
    } catch (e: any) { toast(e.message, 'error'); }
    finally { setConfirmLoading(false); }
  };

  return (
    <>
      <div className="s-header">
        <div className="s-header-top">
          <div><h2>Serviços</h2><p>Gerencie os serviços oferecidos pelo salão</p></div>
          <button className="s-btn-primary" onClick={() => { setEditItem(undefined); setModal(true); }}>
            <SIcon name="plus" /> Novo Serviço
          </button>
        </div>
        <div className="s-filter-tabs">
          {(['TODOS', 'ATIVO', 'INATIVO'] as const).map(s => (
            <button key={s} className={`s-filter-tab${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s === 'TODOS' ? 'Todos' : s === 'ATIVO' ? 'Ativos' : 'Inativos'}
            </button>
          ))}
          <button className="s-btn-icon" style={{ marginLeft: 'auto' }} onClick={load} title="Recarregar"><SIcon name="refresh" size={14} /></button>
        </div>
      </div>

      <div className="s-content">
        {loading ? (
          <div className="s-spinner-wrap"><div className="s-spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="s-empty">
            <div className="s-empty-icon">✂</div>
            <p>Nenhum serviço encontrado</p>
            <small>Cadastre um novo serviço para começar</small>
          </div>
        ) : (
          <div className="s-table-wrap">
            <table>
              <thead><tr>{['Serviço', 'Duração', 'Preço', 'Status', 'Ações'].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="s-cell-name">{item.nome}</div>
                      {item.descricao && <div className="s-cell-sub">{item.descricao}</div>}
                    </td>
                    <td style={{ color: 'var(--ink-soft)' }}>{item.duracaoMinutos} min</td>
                    <td style={{ color: 'var(--ink-soft)', fontWeight: 500 }}>{formatPreco(item.preco)}</td>
                    <td>
                      <span className={`s-badge s-badge-${item.status === 'ATIVO' ? 'ativo' : 'inativo'}`}>
                        <span className="s-badge-dot" />{item.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <div className="s-actions">
                        <button className="s-action-btn" onClick={() => { setEditItem(item); setModal(true); }} title="Editar"><SIcon name="edit" size={13} /></button>
                        {item.status === 'ATIVO' && (
                          <button className="s-action-btn danger" onClick={() => setConfirmItem(item)} title="Inativar"><SIcon name="ban" size={13} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="s-table-footer">{filtered.length} {filtered.length === 1 ? 'serviço' : 'serviços'}</div>
          </div>
        )}
      </div>

      <SModal open={modal} onClose={() => { setModal(false); setEditItem(undefined); }}
        title={editItem ? `Editar: ${editItem.nome}` : 'Novo Serviço'}>
        <ServicoForm item={editItem} onSubmit={handleSubmit}
          onCancel={() => { setModal(false); setEditItem(undefined); }} loading={formLoading} />
      </SModal>

      <SConfirm open={!!confirmItem} title="Inativar Serviço"
        message={`Tem certeza que deseja inativar "${confirmItem?.nome}"?`}
        onConfirm={handleInativar} onCancel={() => setConfirmItem(undefined)} loading={confirmLoading} />
    </>
  );
}
