import { useState } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from './components/Sidebar';
import { FuncionariosPage } from './components/funcionarios/FuncionariosPage';
import { ClientesPage } from './components/clientes/ClientesPage';

type Page = 'funcionarios' | 'clientes';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('funcionarios');

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--background)', fontFamily: 'var(--font-sans)' }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {activePage === 'funcionarios' ? <FuncionariosPage /> : <ClientesPage />}
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
          },
        }}
      />
    </div>
  );
}
