import '../styles/salon.css';
import { useState } from 'react';
import { useToast, SToasts } from './components/SToast';
import { SIcon } from './components/SIcon';
import { FuncionariosPage } from './components/funcionarios/FuncionariosPage';
import { ClientesPage } from './components/clientes/ClientesPage';
import { ServicosPage } from './components/servicos/ServicosPage';
import { AgendamentosPage } from './components/agendamentos/AgendamentosPage';

type Page = 'funcionarios' | 'clientes' | 'servicos' | 'agendamentos';

const NAV: { id: Page; label: string; icon: string; section: string }[] = [
  { id: 'agendamentos', label: 'Agendamentos', icon: 'calendar', section: 'Agenda' },
  { id: 'funcionarios', label: 'Funcionários', icon: 'users', section: 'Cadastros' },
  { id: 'clientes', label: 'Clientes', icon: 'user', section: 'Cadastros' },
  { id: 'servicos', label: 'Serviços', icon: 'tag', section: 'Cadastros' },
];

export default function App() {
  const [page, setPage] = useState<Page>('agendamentos');
  const { toasts, toast } = useToast();

  const sections = [...new Set(NAV.map(n => n.section))];

  return (
    <div className="s-app">
      {/* Sidebar */}
      <aside className="s-sidebar">
        <div className="s-sidebar-logo">
          <div className="s-sidebar-logo-icon">✂</div>
          <h1>Salão</h1>
          <span>Gestão</span>
        </div>

        {sections.map(section => (
          <div key={section} className="s-sidebar-section">
            <div className="s-sidebar-section-label">{section}</div>
            {NAV.filter(n => n.section === section).map(({ id, label, icon }) => (
              <button
                key={id}
                className={`s-sidebar-item${page === id ? ' active' : ''}`}
                onClick={() => setPage(id)}
              >
                <SIcon name={icon} size={14} />
                {label}
                {page === id && <span className="s-sidebar-dot" />}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* Main */}
      <main className="s-main">
        {page === 'funcionarios' && <FuncionariosPage toast={toast} />}
        {page === 'clientes' && <ClientesPage toast={toast} />}
        {page === 'servicos' && <ServicosPage toast={toast} />}
        {page === 'agendamentos' && <AgendamentosPage toast={toast} />}
      </main>

      <SToasts toasts={toasts} />
    </div>
  );
}
