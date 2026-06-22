import '../styles/salon.css';
import { useState, useEffect } from 'react';
import { useToast, SToasts } from './components/SToast';
import { SIcon } from './components/SIcon';
import { FuncionariosPage } from './components/funcionarios/FuncionariosPage';
import { ClientesPage } from './components/clientes/ClientesPage';
import { ServicosPage } from './components/servicos/ServicosPage';
import { AgendamentosPage } from './components/agendamentos/AgendamentosPage';
import { LoginPage } from './components/auth/LoginPage';
import { RelatoriosPage } from './components/relatorios/RelatoriosPage';
import { CaixaPage } from './components/caixa/CaixaPage';
import { AuthSession } from '../services/api';

type Page = 'funcionarios' | 'clientes' | 'servicos' | 'agendamentos' | 'relatorios' | 'caixa';


const ALL_NAV: { id: Page; label: string; icon: string; section: string; roles: string[] }[] = [
  { id: 'agendamentos', label: 'Agendamentos', icon: 'calendar', section: 'Agenda', roles: ['ADMINISTRADOR', 'RECEPCIONISTA', 'PROFISSIONAL', 'CLIENTE'] },
  { id: 'caixa', label: 'Caixa', icon: 'dollar-sign', section: 'Gestão', roles: ['ADMINISTRADOR', 'RECEPCIONISTA'] },
  { id: 'relatorios', label: 'Relatórios', icon: 'bar-chart-2', section: 'Gestão', roles: ['ADMINISTRADOR'] },
  { id: 'funcionarios', label: 'Funcionários', icon: 'users', section: 'Cadastros', roles: ['ADMINISTRADOR'] },
  { id: 'clientes', label: 'Clientes', icon: 'user', section: 'Cadastros', roles: ['ADMINISTRADOR', 'RECEPCIONISTA'] },
  { id: 'servicos', label: 'Serviços', icon: 'tag', section: 'Cadastros', roles: ['ADMINISTRADOR'] },
];

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [page, setPage] = useState<Page>('agendamentos');
  const { toasts, toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('@Salao:session');
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('@Salao:session');
      }
    }
  }, []);

  // Determine user role to filter navigation
  const userRole = session?.tipo === 'funcionario' ? session.usuario.perfil : 'CLIENTE';

  function handleLogout() {
    localStorage.removeItem('@Salao:session');
    setSession(null);
  }

  if (!session) {
    return (
      <div className="s-app">
        <LoginPage onLogin={setSession} toast={toast} />
        <SToasts toasts={toasts} />
      </div>
    );
  }

  const navItems = ALL_NAV.filter(n => n.roles.includes(userRole));
  const sections = [...new Set(navItems.map(n => n.section))];

  return (
    <div className="s-app">
      {/* Sidebar */}
      <aside className="s-sidebar">
        <div className="s-sidebar-logo">
          <div className="s-sidebar-logo-icon"><SIcon name="scissors" size={18} /></div>
          <h1>Salão</h1>
          <span>Gestão</span>
        </div>

        {sections.map(section => (
          <div key={section} className="s-sidebar-section">
            <div className="s-sidebar-section-label">{section}</div>
            {navItems.filter(n => n.section === section).map(({ id, label, icon }) => (
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

        <div className="s-sidebar-footer">
          <div className="s-sidebar-user">
            <span className="s-sidebar-user-name">
              {session.tipo === 'funcionario' ? session.usuario.nomeCompleto : session.usuario.nomeCompleto}
            </span>
            <span className="s-sidebar-user-role">
              {session.tipo === 'funcionario' ? session.usuario.perfil : 'CLIENTE'}
            </span>
          </div>
          <button className="s-sidebar-logout" onClick={handleLogout}>
            <SIcon name="log-out" size={14} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="s-main">
        {page === 'funcionarios' && <FuncionariosPage toast={toast} />}
        {page === 'clientes' && <ClientesPage toast={toast} />}
        {page === 'servicos' && <ServicosPage toast={toast} />}
        {page === 'agendamentos' && <AgendamentosPage session={session} toast={toast} />}
        {page === 'caixa' && <CaixaPage toast={toast} />}
        {page === 'relatorios' && <RelatoriosPage toast={toast} />}
      </main>

      <SToasts toasts={toasts} />
    </div>
  );
}
