import { Users, UserCheck, Scissors } from 'lucide-react';

type Page = 'funcionarios' | 'clientes';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'funcionarios', label: 'Funcionários', icon: UserCheck },
  { id: 'clientes', label: 'Clientes', icon: Users },
];

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside
      className="w-64 shrink-0 flex flex-col h-full"
      style={{ backgroundColor: 'var(--sidebar)', color: 'var(--sidebar-foreground)' }}
    >
      {/* Logo */}
      <div className="px-6 py-7 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--sidebar-primary)', color: 'var(--sidebar-primary-foreground)' }}
          >
            <Scissors size={18} />
          </div>
          <div>
            <p
              className="leading-none tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                color: 'var(--sidebar-foreground)',
              }}
            >
              Salão
            </p>
            <p
              className="text-xs tracking-widest uppercase mt-0.5"
              style={{ color: 'var(--sidebar-primary)', opacity: 0.8 }}
            >
              Gestão
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p
          className="px-3 mb-3 text-xs tracking-widest uppercase"
          style={{ color: 'var(--sidebar-primary)', opacity: 0.6 }}
        >
          Cadastros
        </p>
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left"
              style={{
                backgroundColor: isActive ? 'var(--sidebar-accent)' : 'transparent',
                color: isActive ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                opacity: isActive ? 1 : 0.75,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sidebar-accent)';
                  (e.currentTarget as HTMLElement).style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.opacity = '0.75';
                }
              }}
            >
              <Icon size={16} />
              <span>{label}</span>
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--sidebar-primary)' }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
        <p className="text-xs" style={{ color: 'var(--sidebar-foreground)', opacity: 0.4 }}>
          Sistema de Agendamento
        </p>
      </div>
    </aside>
  );
}
