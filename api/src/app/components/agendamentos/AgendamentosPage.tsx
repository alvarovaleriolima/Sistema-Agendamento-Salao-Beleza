import { useState, useEffect, useCallback } from 'react';
import { api, type AgendamentoResponse, type StatusAgendamento, type AuthSession } from '../../../services/api';
import { SModal } from '../SModal';
import { SConfirm } from '../SConfirm';
import { SIcon } from '../SIcon';
import { AgendamentoForm } from './AgendamentoForm';

function formatPreco(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'AGENDADO', label: 'Agendados' },
  { value: 'CONCLUIDO', label: 'Concluídos' },
  { value: 'CANCELADO', label: 'Cancelados' },
] as const;

const STATUS_LABEL: Record<StatusAgendamento, string> = {
  AGENDADO: 'Agendado',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

export function AgendamentosPage({ session, toast }: { session: AuthSession; toast: (m: string, t?: 'success' | 'error') => void }) {
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
        <AgendamentoForm item={editItem} session={session} onSubmit={handleSubmit}
          onCancel={() => { setModal(false); setEditItem(undefined); }} loading={formLoading} />
      </SModal>

      <SConfirm open={!!confirmItem} title="Cancelar Agendamento"
        message={`Cancelar o agendamento de "${confirmItem?.clienteNome}" em ${confirmItem?.dataHora}?`}
        confirmLabel="Cancelar Agendamento" onConfirm={handleCancelar}
        onCancel={() => setConfirmItem(undefined)} loading={confirmLoading} />
    </>
  );
}
