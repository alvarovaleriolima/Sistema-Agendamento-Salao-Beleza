import { useState, useEffect, useCallback } from 'react';
import { api, type ClienteResponse } from '../../../services/api';
import { SModal } from '../SModal';
import { SConfirm } from '../SConfirm';
import { SIcon } from '../SIcon';

function phoneMask(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function dateMask(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function ClienteForm({ item, onSubmit, onCancel, loading }: {
  item?: ClienteResponse; onSubmit: (d: object) => void; onCancel: () => void; loading: boolean;
}) {
  const isEdit = !!item;
  const [f, setF] = useState({
    nomeCompleto: item?.nomeCompleto || '', dataNascimento: item?.dataNascimento || '',
    login: item?.login || '', senha: '', senhaAtual: '',
    telefone: item?.telefone || '', email: item?.email || '',
    status: item?.status || 'ATIVO',
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => { setF(p => ({ ...p, [k]: v })); setErros(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!f.nomeCompleto.trim()) e.nomeCompleto = 'Obrigatório';
    if (!f.dataNascimento.match(/^\d{2}\/\d{2}\/\d{4}$/)) e.dataNascimento = 'Formato: DD/MM/AAAA';
    if (!isEdit && !f.login.trim()) e.login = 'Obrigatório';
    if (!isEdit && f.senha.length < 8) e.senha = 'Mínimo 8 caracteres';
    if (isEdit && f.senha && f.senha.length < 8) e.senha = 'Mínimo 8 caracteres';
    if (isEdit && f.senha && !f.senhaAtual) e.senhaAtual = 'Informe a senha atual';
    if (!f.telefone.match(/^\(\d{2}\) \d{5}-\d{4}$/)) e.telefone = 'Formato: (00) 00000-0000';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    if (isEdit) {
      const d: Record<string, unknown> = {
        nomeCompleto: f.nomeCompleto, dataNascimento: f.dataNascimento,
        telefone: f.telefone, email: f.email, status: f.status,
      };
      if (f.senha) { d.novaSenha = f.senha; d.senhaAtual = f.senhaAtual; }
      onSubmit(d);
    } else {
      onSubmit({ nomeCompleto: f.nomeCompleto, dataNascimento: f.dataNascimento,
        login: f.login, senha: f.senha, telefone: f.telefone,
        email: f.email || undefined, status: f.status });
    }
  };

  return (
    <div className="s-form-grid">
      <div className="s-field s-form-full">
        <label className="s-label">Nome Completo <span className="s-req">*</span></label>
        <input className={`s-input${erros.nomeCompleto ? ' error' : ''}`} value={f.nomeCompleto} onChange={e => set('nomeCompleto', e.target.value)} placeholder="Nome completo" />
        {erros.nomeCompleto && <span className="s-field-error">{erros.nomeCompleto}</span>}
      </div>

      <div className="s-field">
        <label className="s-label">Data de Nascimento <span className="s-req">*</span></label>
        <input className={`s-input${erros.dataNascimento ? ' error' : ''}`} value={f.dataNascimento} onChange={e => set('dataNascimento', dateMask(e.target.value))} placeholder="DD/MM/AAAA" />
        {erros.dataNascimento && <span className="s-field-error">{erros.dataNascimento}</span>}
      </div>

      <div className="s-field">
        <label className="s-label">Telefone <span className="s-req">*</span></label>
        <input className={`s-input${erros.telefone ? ' error' : ''}`} value={f.telefone} onChange={e => set('telefone', phoneMask(e.target.value))} placeholder="(00) 00000-0000" />
        {erros.telefone && <span className="s-field-error">{erros.telefone}</span>}
      </div>

      <div className="s-field">
        <label className="s-label">Login <span className="s-req">*</span></label>
        <input className={`s-input${erros.login ? ' error' : ''}`} value={f.login} onChange={e => set('login', e.target.value)} disabled={isEdit} placeholder="login.usuario" />
        {erros.login && <span className="s-field-error">{erros.login}</span>}
        {isEdit && <span className="s-field-hint">Não pode ser alterado</span>}
      </div>

      <div className="s-field">
        <label className="s-label">Status</label>
        <select className="s-select" value={f.status} onChange={e => set('status', e.target.value)}>
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
        </select>
      </div>

      <div className="s-field s-form-full">
        <label className="s-label">E-mail</label>
        <input type="email" className="s-input" value={f.email} onChange={e => set('email', e.target.value)} placeholder="email@exemplo.com" />
      </div>

      {isEdit ? (
        <div className="s-pwd-section">
          <div className="s-form-section-label" style={{ gridColumn: '1/-1' }}>Alterar senha (opcional)</div>
          <div className="s-field">
            <label className="s-label">Senha Atual</label>
            <input type="password" className={`s-input${erros.senhaAtual ? ' error' : ''}`} value={f.senhaAtual} onChange={e => set('senhaAtual', e.target.value)} />
            {erros.senhaAtual && <span className="s-field-error">{erros.senhaAtual}</span>}
          </div>
          <div className="s-field">
            <label className="s-label">Nova Senha</label>
            <input type="password" className={`s-input${erros.senha ? ' error' : ''}`} value={f.senha} onChange={e => set('senha', e.target.value)} placeholder="Mínimo 8 caracteres" />
            {erros.senha && <span className="s-field-error">{erros.senha}</span>}
          </div>
        </div>
      ) : (
        <div className="s-field s-form-full">
          <label className="s-label">Senha <span className="s-req">*</span></label>
          <input type="password" className={`s-input${erros.senha ? ' error' : ''}`} value={f.senha} onChange={e => set('senha', e.target.value)} placeholder="Mínimo 8 caracteres" />
          {erros.senha && <span className="s-field-error">{erros.senha}</span>}
        </div>
      )}

      <div className="s-modal-actions s-form-full">
        <button className="s-btn-cancel" onClick={onCancel} disabled={loading}>Cancelar</button>
        <button className="s-btn-primary" onClick={submit} disabled={loading}>
          {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar'}
        </button>
      </div>
    </div>
  );
}

export function ClientesPage({ toast }: { toast: (m: string, t?: 'success' | 'error') => void }) {
  const [items, setItems] = useState<ClienteResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'login'>('nome');
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<ClienteResponse | undefined>();
  const [confirmItem, setConfirmItem] = useState<ClienteResponse | undefined>();
  const [confirmLgpdItem, setConfirmLgpdItem] = useState<ClienteResponse | undefined>();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [historicoModal, setHistoricoModal] = useState(false);
  const [historicoItem, setHistoricoItem] = useState<ClienteResponse | undefined>();
  const [historicoData, setHistoricoData] = useState<any[]>([]);
  const [historicoLoading, setHistoricoLoading] = useState(false);
  const [histInicio, setHistInicio] = useState('');
  const [histFim, setHistFim] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api.clientes.listar()); }
    catch (e: any) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSearch = async () => {
    if (!search.trim()) { load(); return; }
    setLoading(true);
    try {
      let result: ClienteResponse[];
      if (searchType === 'nome') result = await api.clientes.buscarNome(search.trim());
      else result = [await api.clientes.buscarLogin(search.trim())];
      setItems(result);
    } catch (e: any) { toast(e.message, 'error'); setItems([]); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (data: object) => {
    setFormLoading(true);
    try {
      if (editItem) { await api.clientes.editar(editItem.login, data); toast('Cliente atualizado!'); }
      else { await api.clientes.criar(data); toast('Cliente cadastrado!'); }
      setModal(false); setEditItem(undefined); load();
    } catch (e: any) { toast(e.message, 'error'); }
    finally { setFormLoading(false); }
  };

  const handleInativar = async () => {
    if (!confirmItem) return;
    setConfirmLoading(true);
    try {
      await api.clientes.inativar(confirmItem.login);
      toast(`${confirmItem.nomeCompleto} inativado.`);
      setConfirmItem(undefined); load();
    } catch (e: any) { toast(e.message, 'error'); }
    finally { setConfirmLoading(false); }
  };

  const handleLgpd = async () => {
    if (!confirmLgpdItem) return;
    setConfirmLoading(true);
    try {
      await api.clientes.excluirLgpd(confirmLgpdItem.login);
      toast(`Dados de ${confirmLgpdItem.nomeCompleto} anonimizados.`);
      setConfirmLgpdItem(undefined); load();
    } catch (e: any) { toast(e.message, 'error'); }
    finally { setConfirmLoading(false); }
  };

  const handleOpenHistorico = async (item: ClienteResponse) => {
    setHistoricoItem(item);
    setHistoricoModal(true);
    setHistoricoLoading(true);
    setHistInicio('');
    setHistFim('');
    try {
      const data = await api.clientes.historico(item.login);
      setHistoricoData(data);
    } catch (e: any) {
      toast(e.message, 'error');
    } finally {
      setHistoricoLoading(false);
    }
  };

  const filteredHistorico = historicoData.filter(h => {
    if (!histInicio && !histFim) return true;
    const [d, m, y] = h.data.split(' ')[0].split('/');
    const dateStr = `${y}-${m}-${d}`;
    if (histInicio && dateStr < histInicio) return false;
    if (histFim && dateStr > histFim) return false;
    return true;
  });

  return (
    <>
      <div className="s-header">
        <div className="s-header-top">
          <div><h2>Clientes</h2><p>Gerencie o cadastro de clientes do salão</p></div>
          <button className="s-btn-primary" onClick={() => { setEditItem(undefined); setModal(true); }}>
            <SIcon name="plus" /> Novo Cliente
          </button>
        </div>
        <div className="s-search-bar">
          <div className="s-search-tabs">
            {(['nome', 'login'] as const).map(v => (
              <button key={v} className={`s-search-tab${searchType === v ? ' active' : ''}`} onClick={() => { setSearchType(v); setSearch(''); }}>
                {v === 'nome' ? 'Nome' : 'Login'}
              </button>
            ))}
          </div>
          <div className="s-search-input-wrap">
            <span className="s-search-icon"><SIcon name="search" size={13} /></span>
            <input className="s-search-input" value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder={`Buscar por ${searchType}...`} />
          </div>
          <button className="s-btn-search" onClick={handleSearch}>Buscar</button>
          <button className="s-btn-icon" onClick={load} title="Recarregar"><SIcon name="refresh" size={14} /></button>
        </div>
      </div>

      <div className="s-content">
        {loading ? (
          <div className="s-spinner-wrap"><div className="s-spinner" /></div>
        ) : items.length === 0 ? (
          <div className="s-empty">
            <div className="s-empty-icon">👤</div>
            <p>Nenhum cliente encontrado</p>
            <small>Cadastre um novo cliente ou ajuste a busca</small>
          </div>
        ) : (
          <div className="s-table-wrap">
            <table>
              <thead><tr>{['Nome', 'Login', 'Nascimento', 'Telefone', 'Status', 'Ações'].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="s-cell-name">{item.nomeCompleto}</div>
                      {item.email && <div className="s-cell-sub">{item.email}</div>}
                    </td>
                    <td><span className="s-cell-mono">{item.login}</span></td>
                    <td style={{ color: 'var(--ink-soft)' }}>{item.dataNascimento}</td>
                    <td style={{ color: 'var(--ink-soft)' }}>{item.telefone}</td>
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
                        <button className="s-action-btn" onClick={() => handleOpenHistorico(item)} title="Ver Histórico"><SIcon name="calendar" size={13} /></button>
                        <button className="s-action-btn danger" onClick={() => setConfirmLgpdItem(item)} title="Excluir (LGPD)"><SIcon name="trash-2" size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="s-table-footer">{items.length} {items.length === 1 ? 'cliente' : 'clientes'}</div>
          </div>
        )}
      </div>

      <SModal open={modal} onClose={() => { setModal(false); setEditItem(undefined); }}
        title={editItem ? `Editar: ${editItem.nomeCompleto}` : 'Novo Cliente'}>
        <ClienteForm item={editItem} onSubmit={handleSubmit}
          onCancel={() => { setModal(false); setEditItem(undefined); }} loading={formLoading} />
      </SModal>

      <SConfirm open={!!confirmItem} title="Inativar Cliente"
        message={`Tem certeza que deseja inativar "${confirmItem?.nomeCompleto}"? Agendamentos futuros serão cancelados.`}
        onConfirm={handleInativar} onCancel={() => setConfirmItem(undefined)} loading={confirmLoading} />

      <SConfirm open={!!confirmLgpdItem} title="Exclusão de Dados (LGPD)"
        message={`ATENÇÃO: Deseja apagar definitivamente os dados pessoais de "${confirmLgpdItem?.nomeCompleto}"? Esta ação é irreversível e anonimizará o cadastro, apagando telefone, e-mail e senha.`}
        confirmLabel="Excluir Dados"
        onConfirm={handleLgpd} onCancel={() => setConfirmLgpdItem(undefined)} loading={confirmLoading} />

      <SModal open={historicoModal} onClose={() => setHistoricoModal(false)} title={`Histórico: ${historicoItem?.nomeCompleto}`} width={650}>
        <div className="s-content" style={{ padding: 0 }}>
          <div className="s-search-bar" style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
            <div className="s-field" style={{ margin: 0 }}>
              <label className="s-label" style={{ fontSize: '11px' }}>A partir de</label>
              <input type="date" className="s-input" value={histInicio} onChange={e => setHistInicio(e.target.value)} />
            </div>
            <div className="s-field" style={{ margin: 0 }}>
              <label className="s-label" style={{ fontSize: '11px' }}>Até</label>
              <input type="date" className="s-input" value={histFim} onChange={e => setHistFim(e.target.value)} />
            </div>
          </div>
          {historicoLoading ? (
            <div className="s-spinner-wrap" style={{ minHeight: 200 }}><div className="s-spinner" /></div>
          ) : filteredHistorico.length === 0 ? (
            <div className="s-empty" style={{ minHeight: 200 }}>
              <p>Nenhum atendimento pago/concluído encontrado neste período.</p>
            </div>
          ) : (
            <div className="s-table-wrap" style={{ border: 0, borderRadius: 0 }}>
              <table style={{ margin: 0 }}>
                <thead><tr><th>Data</th><th>Serviço</th><th>Profissional</th><th>Valor Pago</th></tr></thead>
                <tbody>
                  {filteredHistorico.map((h, i) => (
                    <tr key={i}>
                      <td style={{ color: 'var(--ink-soft)' }}>{h.data}</td>
                      <td>{h.servico}</td>
                      <td>{h.profissional}</td>
                      <td>R$ {h.valor.toFixed(2).replace('.', ',')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="s-table-footer">
                Total do Período: R$ {filteredHistorico.reduce((acc, h) => acc + h.valor, 0).toFixed(2).replace('.', ',')}
              </div>
            </div>
          )}
        </div>
      </SModal>
    </>
  );
}
