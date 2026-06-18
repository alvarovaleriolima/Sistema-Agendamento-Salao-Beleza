import { useState, useEffect, useCallback } from 'react';
import { api, type FuncionarioResponse } from '../../../services/api';
import { SModal } from '../SModal';
import { SConfirm } from '../SConfirm';
import { SIcon } from '../SIcon';

function phoneMask(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const PERFIS = ['ADMINISTRADOR', 'RECEPCIONISTA', 'PROFISSIONAL'] as const;
const ESPEC = ['CABELO', 'MANICURE', 'PEDICURE', 'ESTETICA', 'MAQUIAGEM', 'DEPILACAO', 'SOBRANCELHA', 'MASSAGEM'];
const PERFIL_LABEL: Record<string, string> = { ADMINISTRADOR: 'Admin', RECEPCIONISTA: 'Recepção', PROFISSIONAL: 'Profissional' };

function FuncionarioForm({ item, onSubmit, onCancel, loading }: {
  item?: FuncionarioResponse; onSubmit: (d: object) => void; onCancel: () => void; loading: boolean;
}) {
  const isEdit = !!item;
  const [f, setF] = useState({
    nomeCompleto: item?.nomeCompleto || '', login: item?.login || '',
    senha: '', senhaAtual: '', perfil: item?.perfil || '',
    telefone: item?.telefone || '', email: item?.email || '',
    status: item?.status || 'ATIVO',
    especialidade: item?.especialidade || '', horarioTrabalho: item?.horarioTrabalho || '',
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => { setF(p => ({ ...p, [k]: v })); setErros(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!f.nomeCompleto.trim()) e.nomeCompleto = 'Obrigatório';
    if (!isEdit && !f.login.trim()) e.login = 'Obrigatório';
    if (!isEdit && f.senha.length < 8) e.senha = 'Mínimo 8 caracteres';
    if (isEdit && f.senha && f.senha.length < 8) e.senha = 'Mínimo 8 caracteres';
    if (isEdit && f.senha && !f.senhaAtual) e.senhaAtual = 'Informe a senha atual';
    if (!f.perfil) e.perfil = 'Obrigatório';
    if (!f.telefone.match(/^\(\d{2}\) \d{5}-\d{4}$/)) e.telefone = 'Formato: (00) 00000-0000';
    if (f.perfil === 'PROFISSIONAL' && !f.especialidade) e.especialidade = 'Obrigatório para profissional';
    if (f.perfil === 'PROFISSIONAL' && !f.horarioTrabalho) e.horarioTrabalho = 'Obrigatório para profissional';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    if (isEdit) {
      const d: Record<string, unknown> = {
        nomeCompleto: f.nomeCompleto, perfil: f.perfil, telefone: f.telefone,
        email: f.email, status: f.status, especialidade: f.especialidade || undefined,
        horarioTrabalho: f.horarioTrabalho || undefined,
      };
      if (f.senha) { d.novaSenha = f.senha; d.senhaAtual = f.senhaAtual; }
      onSubmit(d);
    } else {
      onSubmit({ nomeCompleto: f.nomeCompleto, login: f.login, senha: f.senha, perfil: f.perfil,
        telefone: f.telefone, email: f.email || undefined, status: f.status,
        especialidade: f.especialidade || undefined, horarioTrabalho: f.horarioTrabalho || undefined });
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
        <label className="s-label">Login <span className="s-req">*</span></label>
        <input className={`s-input${erros.login ? ' error' : ''}`} value={f.login} onChange={e => set('login', e.target.value)} disabled={isEdit} placeholder="login.usuario" />
        {erros.login && <span className="s-field-error">{erros.login}</span>}
        {isEdit && <span className="s-field-hint">Não pode ser alterado</span>}
      </div>

      <div className="s-field">
        <label className="s-label">Perfil <span className="s-req">*</span></label>
        <select className={`s-select${erros.perfil ? ' error' : ''}`} value={f.perfil} onChange={e => set('perfil', e.target.value)}>
          <option value="">Selecione...</option>
          {PERFIS.map(p => <option key={p} value={p}>{PERFIL_LABEL[p]}</option>)}
        </select>
        {erros.perfil && <span className="s-field-error">{erros.perfil}</span>}
      </div>

      <div className="s-field">
        <label className="s-label">Telefone <span className="s-req">*</span></label>
        <input className={`s-input${erros.telefone ? ' error' : ''}`} value={f.telefone} onChange={e => set('telefone', phoneMask(e.target.value))} placeholder="(00) 00000-0000" />
        {erros.telefone && <span className="s-field-error">{erros.telefone}</span>}
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

      {f.perfil === 'PROFISSIONAL' && (
        <div className="s-prof-section">
          <div className="s-form-section-label" style={{ gridColumn: '1/-1' }}>Dados do Profissional</div>
          <div className="s-field">
            <label className="s-label">Especialidade <span className="s-req">*</span></label>
            <select className={`s-select${erros.especialidade ? ' error' : ''}`} value={f.especialidade} onChange={e => set('especialidade', e.target.value)}>
              <option value="">Selecione...</option>
              {ESPEC.map(e => <option key={e} value={e}>{e.charAt(0) + e.slice(1).toLowerCase()}</option>)}
            </select>
            {erros.especialidade && <span className="s-field-error">{erros.especialidade}</span>}
          </div>
          <div className="s-field">
            <label className="s-label">Horário <span className="s-req">*</span></label>
            <input className={`s-input${erros.horarioTrabalho ? ' error' : ''}`} value={f.horarioTrabalho} onChange={e => set('horarioTrabalho', e.target.value)} placeholder="08:00 às 18:00" />
            {erros.horarioTrabalho && <span className="s-field-error">{erros.horarioTrabalho}</span>}
          </div>
        </div>
      )}

      {isEdit && (
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
      )}

      {!isEdit && (
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

export function FuncionariosPage({ toast }: { toast: (m: string, t?: 'success' | 'error') => void }) {
  const [items, setItems] = useState<FuncionarioResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'login' | 'perfil'>('nome');
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<FuncionarioResponse | undefined>();
  const [confirmItem, setConfirmItem] = useState<FuncionarioResponse | undefined>();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api.funcionarios.listar()); }
    catch (e: any) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSearch = async () => {
    if (!search.trim()) { load(); return; }
    setLoading(true);
    try {
      let result: FuncionarioResponse[] = [];
      if (searchType === 'nome') result = await api.funcionarios.buscarNome(search.trim());
      else if (searchType === 'login') result = [await api.funcionarios.buscarLogin(search.trim())];
      else result = await api.funcionarios.buscarPerfil(search.trim().toUpperCase());
      setItems(result);
    } catch (e: any) { toast(e.message, 'error'); setItems([]); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (data: object) => {
    setFormLoading(true);
    try {
      if (editItem) { await api.funcionarios.editar(editItem.login, data); toast('Funcionário atualizado!'); }
      else { await api.funcionarios.criar(data); toast('Funcionário cadastrado!'); }
      setModal(false); setEditItem(undefined); load();
    } catch (e: any) { toast(e.message, 'error'); }
    finally { setFormLoading(false); }
  };

  const handleInativar = async () => {
    if (!confirmItem) return;
    setConfirmLoading(true);
    try {
      await api.funcionarios.inativar(confirmItem.login);
      toast(`${confirmItem.nomeCompleto} inativado.`);
      setConfirmItem(undefined); load();
    } catch (e: any) { toast(e.message, 'error'); }
    finally { setConfirmLoading(false); }
  };

  return (
    <>
      <div className="s-header">
        <div className="s-header-top">
          <div><h2>Funcionários</h2><p>Gerencie o cadastro de funcionários do salão</p></div>
          <button className="s-btn-primary" onClick={() => { setEditItem(undefined); setModal(true); }}>
            <SIcon name="plus" /> Novo Funcionário
          </button>
        </div>
        <div className="s-search-bar">
          <div className="s-search-tabs">
            {(['nome', 'login', 'perfil'] as const).map(v => (
              <button key={v} className={`s-search-tab${searchType === v ? ' active' : ''}`} onClick={() => { setSearchType(v); setSearch(''); }}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
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
            <p>Nenhum funcionário encontrado</p>
            <small>Cadastre um novo funcionário ou ajuste a busca</small>
          </div>
        ) : (
          <div className="s-table-wrap">
            <table>
              <thead><tr>{['Nome', 'Login', 'Perfil', 'Telefone', 'Status', 'Ações'].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="s-cell-name">{item.nomeCompleto}</div>
                      {item.email && <div className="s-cell-sub">{item.email}</div>}
                      {item.especialidade && <div className="s-cell-sub">{item.especialidade.charAt(0) + item.especialidade.slice(1).toLowerCase()} · {item.horarioTrabalho}</div>}
                    </td>
                    <td><span className="s-cell-mono">{item.login}</span></td>
                    <td><span className="s-badge s-badge-perfil">{PERFIL_LABEL[item.perfil]}</span></td>
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="s-table-footer">{items.length} {items.length === 1 ? 'funcionário' : 'funcionários'}</div>
          </div>
        )}
      </div>

      <SModal open={modal} onClose={() => { setModal(false); setEditItem(undefined); }}
        title={editItem ? `Editar: ${editItem.nomeCompleto}` : 'Novo Funcionário'}>
        <FuncionarioForm item={editItem} onSubmit={handleSubmit}
          onCancel={() => { setModal(false); setEditItem(undefined); }} loading={formLoading} />
      </SModal>

      <SConfirm open={!!confirmItem} title="Inativar Funcionário"
        message={`Tem certeza que deseja inativar "${confirmItem?.nomeCompleto}"? Agendamentos futuros serão cancelados.`}
        onConfirm={handleInativar} onCancel={() => setConfirmItem(undefined)} loading={confirmLoading} />
    </>
  );
}
