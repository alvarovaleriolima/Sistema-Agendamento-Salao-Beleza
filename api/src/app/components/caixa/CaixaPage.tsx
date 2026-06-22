import { useState, useEffect, useCallback } from 'react';
import { api, PagamentoResponse } from '../../../services/api';
import { SIcon } from '../SIcon';
import { SModal } from '../SModal';

interface Props {
  toast: (msg: string, type?: 'success' | 'error') => void;
}

export function CaixaPage({ toast }: Props) {
  const [items, setItems] = useState<PagamentoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'PENDENTE' | 'PAGO'>('PENDENTE');

  const [modalItem, setModalItem] = useState<PagamentoResponse | null>(null);
  const [formaPagamento, setFormaPagamento] = useState('PIX');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.pagamentos.porStatus(tab);
      // Sort: Pendentes por dataHora (mais antigos primeiro), Pagos por dataPagamento (mais recentes)
      if (tab === 'PENDENTE') {
        data.sort((a, b) => a.dataHoraAgendamento.localeCompare(b.dataHoraAgendamento));
      } else {
        data.sort((a, b) => (b.dataPagamento || '').localeCompare(a.dataPagamento || ''));
      }
      setItems(data);
    } catch (e: any) {
      toast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [tab, toast]);

  useEffect(() => { load(); }, [load]);

  const handleOpenReceive = (p: PagamentoResponse) => {
    setModalItem(p);
    setFormaPagamento('PIX');
  };

  const handleReceive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalItem) return;
    setSaving(true);
    try {
      await api.pagamentos.editar(modalItem.id, {
        status: 'PAGO',
        formaPagamento,
        dataPagamento: new Date().toISOString().split('T')[0] // yyyy-mm-dd format needed by LocalDate
      });
      toast(`Pagamento de R$ ${modalItem.valor.toFixed(2).replace('.', ',')} recebido!`, 'success');
      setModalItem(null);
      load();
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="s-header">
        <div className="s-header-top">
          <div><h2>Controle de Caixa</h2><p>Gerencie os pagamentos e faturamento dos agendamentos</p></div>
        </div>
        <div className="s-search-bar">
          <div className="s-search-tabs">
            <button className={`s-search-tab${tab === 'PENDENTE' ? ' active' : ''}`} onClick={() => setTab('PENDENTE')}>Pendentes</button>
            <button className={`s-search-tab${tab === 'PAGO' ? ' active' : ''}`} onClick={() => setTab('PAGO')}>Recebidos</button>
          </div>
        </div>
      </div>

      <div className="s-content">
        {loading ? (
          <div className="s-spinner-wrap"><div className="s-spinner" /></div>
        ) : items.length === 0 ? (
          <div className="s-empty">
            <div className="s-empty-icon"><SIcon name="dollar-sign" size={32} /></div>
            <p>Nenhum pagamento {tab === 'PENDENTE' ? 'pendente' : 'recebido'} encontrado.</p>
          </div>
        ) : (
          <div className="s-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Serviço</th>
                  <th>Profissional</th>
                  <th>{tab === 'PENDENTE' ? 'Agendamento' : 'Data Pagamento'}</th>
                  <th>Valor</th>
                  {tab === 'PAGO' && <th>Forma de Pagamento</th>}
                  <th>Status</th>
                  {tab === 'PENDENTE' && <th style={{ width: 100 }}>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {items.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.clienteNome}</strong></td>
                    <td>{p.servicoNome}</td>
                    <td>{p.profissionalNome}</td>
                    <td>{tab === 'PENDENTE' ? p.dataHoraAgendamento : p.dataPagamento}</td>
                    <td>R$ {p.valor.toFixed(2).replace('.', ',')}</td>
                    {tab === 'PAGO' && <td>{p.formaPagamento?.replace('_', ' ')}</td>}
                    <td>
                      <span className={`s-badge ${p.status === 'PAGO' ? 'success' : 'warning'}`}>
                        {p.status}
                      </span>
                    </td>
                    {tab === 'PENDENTE' && (
                      <td>
                        <div className="s-actions">
                          <button className="s-btn-primary" onClick={() => handleOpenReceive(p)} style={{ padding: '4px 12px', fontSize: '12px' }}>
                            Receber
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SModal open={!!modalItem} onClose={() => setModalItem(null)} title="Receber Pagamento" width={400}>
        <form onSubmit={handleReceive}>
          <div className="s-content">
            <div className="s-field">
              <label className="s-label">Cliente</label>
              <div style={{ padding: '8px', background: 'var(--bg-card)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px' }}>
                {modalItem?.clienteNome}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="s-field">
                <label className="s-label">Serviço</label>
                <div style={{ padding: '8px', background: 'var(--bg-card)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px' }}>
                  {modalItem?.servicoNome}
                </div>
              </div>
              <div className="s-field">
                <label className="s-label">Valor (R$)</label>
                <div style={{ padding: '8px', background: 'var(--bg-card)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px', fontWeight: '600', color: 'var(--primary)' }}>
                  {modalItem?.valor.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>

            <div className="s-field">
              <label className="s-label">Forma de Pagamento</label>
              <select className="s-input" value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)} required>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="PIX">PIX</option>
                <option value="CARTAO_DEBITO">Cartão de Débito</option>
                <option value="CARTAO_CREDITO">Cartão de Crédito</option>
              </select>
            </div>
          </div>
          <div className="s-modal-footer">
            <button type="button" className="s-btn-secondary" onClick={() => setModalItem(null)}>Cancelar</button>
            <button type="submit" className="s-btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Confirmar Recebimento'}
            </button>
          </div>
        </form>
      </SModal>
    </>
  );
}
