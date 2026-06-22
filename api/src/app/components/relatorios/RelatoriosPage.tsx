import { useState, useEffect } from 'react';
import { api, FaturamentoReportDTO, DesempenhoReportDTO, FuncionarioResponse } from '../../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface RelatoriosPageProps {
  toast: (type: 'success' | 'error', msg: string) => void;
}

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#14b8a6', '#6366f1', '#ec4899'];

export function RelatoriosPage({ toast }: RelatoriosPageProps) {
  const [dataInicio, setDataInicio] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().substring(0, 10));
  const [dataFim, setDataFim] = useState(new Date().toISOString().substring(0, 10));
  const [funcionarioId, setFuncionarioId] = useState<number | ''>('');
  
  const [faturamento, setFaturamento] = useState<FaturamentoReportDTO | null>(null);
  const [desempenho, setDesempenho] = useState<DesempenhoReportDTO | null>(null);
  const [funcionarios, setFuncionarios] = useState<FuncionarioResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.funcionarios.listar().then(setFuncionarios).catch(e => toast('error', e.message));
  }, []);

  const formatDateTime = (dateStr: string, isEnd = false) => {
    // backend expects dd/MM/yyyy HH:mm
    const d = new Date(dateStr + (isEnd ? 'T23:59:59' : 'T00:00:00'));
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  };

  const gerar = async () => {
    if (!dataInicio || !dataFim) {
      toast('error', 'Preencha as datas inicial e final.');
      return;
    }
    setLoading(true);
    try {
      const inicioFmt = formatDateTime(dataInicio);
      const fimFmt = formatDateTime(dataFim, true);
      
      const [resFat, resDes] = await Promise.all([
        api.relatorios.faturamento(inicioFmt, fimFmt, funcionarioId === '' ? undefined : Number(funcionarioId)),
        api.relatorios.desempenho(inicioFmt, fimFmt)
      ]);
      setFaturamento(resFat);
      setDesempenho(resDes);
    } catch (e: any) {
      toast('error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="s-page">
      <div className="s-page-header">
        <h2>Relatórios e Dashboard</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="s-input" style={{ width: 'auto' }} />
          <span>até</span>
          <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="s-input" style={{ width: 'auto' }} />
          <select value={funcionarioId} onChange={e => setFuncionarioId(e.target.value)} className="s-input" style={{ width: 'auto' }}>
            <option value="">Todos os Profissionais</option>
            {funcionarios.map(f => <option key={f.id} value={f.id}>{f.nomeCompleto}</option>)}
          </select>
          <button className="s-btn s-btn-primary" onClick={gerar} disabled={loading}>
            {loading ? 'Gerando...' : 'Gerar Relatório'}
          </button>
        </div>
      </div>

      <div className="s-page-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {faturamento && desempenho && (
          <>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1, padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Faturamento Total Bruto</h3>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(faturamento.totalBruto)}
                </div>
              </div>
              <div style={{ flex: 1, padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Cancelamentos / Faltas</h3>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>
                  {desempenho.canceladosCount}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 400px', padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '320px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Ranking de Serviços (Top 10)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={desempenho.servicoRanking.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="servicoNome" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                    <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Agendamentos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: '1 1 400px', padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '320px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Performance por Profissional</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={desempenho.profissionalPerformance} dataKey="count" nameKey="profissionalNome" cx="50%" cy="50%" outerRadius={90} fill="#8884d8" label>
                      {desempenho.profissionalPerformance.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Detalhamento Financeiro</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="s-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                      <th style={{ padding: '12px' }}>Data/Hora Agendamento</th>
                      <th style={{ padding: '12px' }}>Cliente</th>
                      <th style={{ padding: '12px' }}>Profissional</th>
                      <th style={{ padding: '12px' }}>Serviço</th>
                      <th style={{ padding: '12px' }}>Status Agend.</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faturamento.itens.map(item => (
                      <tr key={item.agendamentoId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px' }}>{item.dataHoraAgendamento}</td>
                        <td style={{ padding: '12px' }}>{item.clienteNome}</td>
                        <td style={{ padding: '12px' }}>{item.profissionalNome}</td>
                        <td style={{ padding: '12px' }}>{item.servicoNome}</td>
                        <td style={{ padding: '12px' }}>{item.statusAgendamento}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500', color: '#0f172a' }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorServico)}
                        </td>
                      </tr>
                    ))}
                    {faturamento.itens.length === 0 && (
                      <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Nenhum pagamento encontrado no período selecionado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        {!faturamento && !loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            Selecione o período e clique em Gerar Relatório para visualizar o dashboard.
          </div>
        )}
      </div>
    </div>
  );
}
