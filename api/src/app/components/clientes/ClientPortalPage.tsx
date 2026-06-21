import { useState, useEffect } from 'react';
import { api, type ServicoResponse, type AuthSession } from '../../../services/api';
import { SIcon } from '../SIcon';
import { SModal } from '../SModal';
import { AgendamentoForm } from '../agendamentos/AgendamentoForm';

function formatPreco(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function ClientPortalPage({ session, toast }: { session: AuthSession; toast: (m: string, t?: 'success' | 'error') => void }) {
  const [servicos, setServicos] = useState<ServicoResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal control
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedServicoId, setSelectedServicoId] = useState<string | undefined>();
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.servicos.ativos()
      .then(setServicos)
      .catch((e: any) => toast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  const openAgendamento = (servicoId: number) => {
    setSelectedServicoId(String(servicoId));
    setModalOpen(true);
  };

  const handleAgendar = async (data: object) => {
    setFormLoading(true);
    try {
      await api.agendamentos.criar(data);
      toast('Agendamento criado com sucesso! Em breve te esperamos.', 'success');
      setModalOpen(false);
      setSelectedServicoId(undefined);
    } catch (e: any) {
      toast(e.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <div className="s-header" style={{ paddingBottom: 32 }}>
        <div className="s-header-top" style={{ flexDirection: 'column', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 36 }}>Olá, {session.usuario.nomeCompleto.split(' ')[0]}!</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
              Seja bem-vindo(a) ao seu portal exclusivo.
            </p>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--cream-dark)', padding: '8px 14px', borderRadius: 20, border: '1px solid var(--cream-darker)' }}>
            <SIcon name="map-pin" size={14} style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-soft)' }}>
              Nosso endereço: Rua das Flores, 123 - Centro, Lavras/MG
            </span>
          </div>
        </div>
      </div>

      <div className="s-content" style={{ paddingTop: 0 }}>
        <div style={{ marginBottom: 24, marginTop: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 500, color: 'var(--ink)' }}>
            Serviços Disponíveis
          </h3>
          <p style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
            Escolha um serviço abaixo e agende o seu horário rapidamente.
          </p>
        </div>

        {loading ? (
          <div className="s-spinner-wrap"><div className="s-spinner" /></div>
        ) : servicos.length === 0 ? (
          <div className="s-empty">
            <div className="s-empty-icon">✨</div>
            <p>Nenhum serviço ativo no momento.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {servicos.map(s => (
              <div key={s.id} style={{
                background: 'var(--white)',
                border: '1px solid var(--cream-darker)',
                borderRadius: 8,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow)';
              }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.1 }}>
                    {s.nome}
                  </h4>
                  <div style={{ background: 'var(--cream)', color: 'var(--ink-soft)', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500 }}>
                    {s.duracaoMinutos} min
                  </div>
                </div>
                
                <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.5, marginBottom: 24, flex: 1 }}>
                  {s.descricao}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--cream-dark)', paddingTop: 16 }}>
                  <span style={{ fontSize: 18, fontWeight: 500, color: 'var(--ink)' }}>
                    {formatPreco(s.preco)}
                  </span>
                  <button className="s-btn-primary" onClick={() => openAgendamento(s.id)}>
                    Agendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SModal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Agendamento" large>
        <AgendamentoForm 
          session={session} 
          onSubmit={handleAgendar}
          onCancel={() => setModalOpen(false)} 
          loading={formLoading} 
          initialServicoId={selectedServicoId}
        />
      </SModal>
    </>
  );
}
