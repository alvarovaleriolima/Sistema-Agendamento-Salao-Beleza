import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Pencil, UserX, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { clientesApi, type ClienteResponse } from '../../../services/api';
import { Modal } from '../Modal';
import { ConfirmDialog } from '../ConfirmDialog';
import { ClienteForm } from './ClienteForm';

function formatDate(iso: string): string {
  if (!iso) return '—';
  // API returns "dd/MM/yyyy" already due to @JsonFormat
  if (iso.includes('/')) return iso;
  // Fallback: parse ISO date
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function ClientesPage() {
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'login'>('nome');

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ClienteResponse | undefined>();
  const [inativarTarget, setInativarTarget] = useState<ClienteResponse | undefined>();
  const [inativarLoading, setInativarLoading] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const dados = await clientesApi.listarTodos();
      setClientes(dados);
    } catch (err: any) {
      toast.error(err.message ?? 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const handleSearch = async () => {
    if (!search.trim()) { carregar(); return; }
    setLoading(true);
    try {
      let result: ClienteResponse[] = [];
      if (searchType === 'nome') {
        result = await clientesApi.buscarPorNome(search.trim()) as ClienteResponse[];
      } else {
        const c = await clientesApi.buscarPorLogin(search.trim());
        result = [c];
      }
      setClientes(result);
    } catch (err: any) {
      toast.error(err.message ?? 'Nenhum resultado encontrado');
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (data: any) => {
    setFormLoading(true);
    try {
      if (editTarget) {
        await clientesApi.editar(editTarget.login, data);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await clientesApi.criar(data);
        toast.success('Cliente cadastrado com sucesso!');
      }
      setModalOpen(false);
      setEditTarget(undefined);
      carregar();
    } catch (err: any) {
      toast.error(err.message ?? 'Erro ao salvar cliente');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInativar = async () => {
    if (!inativarTarget) return;
    setInativarLoading(true);
    try {
      await clientesApi.inativar(inativarTarget.login);
      toast.success(`${inativarTarget.nomeCompleto} foi inativado(a).`);
      setInativarTarget(undefined);
      carregar();
    } catch (err: any) {
      toast.error(err.message ?? 'Erro ao inativar cliente');
    } finally {
      setInativarLoading(false);
    }
  };

  const openCreate = () => { setEditTarget(undefined); setModalOpen(true); };
  const openEdit = (c: ClienteResponse) => { setEditTarget(c); setModalOpen(true); };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Clientes</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Gerencie o cadastro de clientes do salão</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-primary-foreground hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <Plus size={16} />
            Novo Cliente
          </button>
        </div>

        {/* Busca */}
        <div className="flex gap-3 mt-5">
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(['nome', 'login'] as const).map((type) => (
              <button
                key={type}
                onClick={() => { setSearchType(type); setSearch(''); }}
                className="px-4 py-2 text-sm capitalize transition-colors"
                style={{
                  backgroundColor: searchType === type ? 'var(--primary)' : 'var(--card)',
                  color: searchType === type ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                }}
              >
                {type === 'nome' ? 'Nome' : 'Login'}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={`Buscar por ${searchType}...`}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-ring/30"
                style={{ backgroundColor: 'var(--input-background)' }}
              />
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-primary-foreground"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Buscar
            </button>
            <button
              onClick={carregar}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
              title="Recarregar"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="flex-1 overflow-auto px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : clientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search size={22} className="text-muted-foreground" />
            </div>
            <p className="text-foreground">Nenhum cliente encontrado</p>
            <p className="text-muted-foreground text-sm mt-1">Tente uma busca diferente ou cadastre um novo cliente</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border" style={{ backgroundColor: 'var(--muted)' }}>
                  {['Nome', 'Login', 'Nascimento', 'Telefone', 'Status', 'Ações'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clientes.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm text-foreground">{c.nomeCompleto}</div>
                      {c.email && <div className="text-xs text-muted-foreground">{c.email}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{c.login}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(c.dataNascimento)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.telefone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${
                          c.status === 'ATIVO'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-stone-50 text-stone-500 border-stone-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'ATIVO' ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                        {c.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        {c.status === 'ATIVO' && (
                          <button
                            onClick={() => setInativarTarget(c)}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
                            title="Inativar"
                          >
                            <UserX size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
              {clientes.length} {clientes.length === 1 ? 'cliente' : 'clientes'}
            </div>
          </div>
        )}
      </div>

      {/* Modal Criar/Editar */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(undefined); }}
        title={editTarget ? `Editar: ${editTarget.nomeCompleto}` : 'Novo Cliente'}
      >
        <ClienteForm
          cliente={editTarget}
          onSubmit={handleSubmitForm}
          onCancel={() => { setModalOpen(false); setEditTarget(undefined); }}
          loading={formLoading}
        />
      </Modal>

      {/* Dialog Inativar */}
      <ConfirmDialog
        open={!!inativarTarget}
        title="Inativar Cliente"
        message={`Tem certeza que deseja inativar "${inativarTarget?.nomeCompleto}"? Agendamentos futuros serão cancelados e horários liberados.`}
        confirmLabel="Inativar"
        onConfirm={handleInativar}
        onCancel={() => setInativarTarget(undefined)}
        loading={inativarLoading}
      />
    </div>
  );
}
