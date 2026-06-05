import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Pencil, UserX, RefreshCw, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { funcionariosApi, type FuncionarioResponse, type PerfilFuncionario } from '../../../services/api';
import { Modal } from '../Modal';
import { ConfirmDialog } from '../ConfirmDialog';
import { FuncionarioForm } from './FuncionarioForm';

const perfilLabel: Record<PerfilFuncionario, string> = {
  ADMINISTRADOR: 'Administrador(a)',
  RECEPCIONISTA: 'Recepcionista',
  PROFISSIONAL: 'Profissional',
};

const perfilColors: Record<PerfilFuncionario, string> = {
  ADMINISTRADOR: 'bg-amber-50 text-amber-800 border-amber-200',
  RECEPCIONISTA: 'bg-blue-50 text-blue-800 border-blue-200',
  PROFISSIONAL: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

export function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<FuncionarioResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'login' | 'perfil'>('nome');
  const [perfilFilter, setPerfilFilter] = useState<PerfilFuncionario | ''>('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FuncionarioResponse | undefined>();
  const [inativarTarget, setInativarTarget] = useState<FuncionarioResponse | undefined>();
  const [inativarLoading, setInativarLoading] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const dados = await funcionariosApi.listarTodos();
      setFuncionarios(dados);
    } catch (err: any) {
      toast.error(err.message ?? 'Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const handleSearch = async () => {
    if (!search.trim() && searchType !== 'perfil') {
      carregar();
      return;
    }
    setLoading(true);
    try {
      let result: FuncionarioResponse[] = [];
      if (searchType === 'nome') {
        result = await funcionariosApi.buscarPorNome(search.trim()) as FuncionarioResponse[];
      } else if (searchType === 'login') {
        const f = await funcionariosApi.buscarPorLogin(search.trim());
        result = [f];
      } else if (searchType === 'perfil' && perfilFilter) {
        result = await funcionariosApi.buscarPorPerfil(perfilFilter) as FuncionarioResponse[];
      }
      setFuncionarios(result);
    } catch (err: any) {
      toast.error(err.message ?? 'Nenhum resultado encontrado');
      setFuncionarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (data: any) => {
    setFormLoading(true);
    try {
      if (editTarget) {
        await funcionariosApi.editar(editTarget.login, data);
        toast.success('Funcionário atualizado com sucesso!');
      } else {
        await funcionariosApi.criar(data);
        toast.success('Funcionário cadastrado com sucesso!');
      }
      setModalOpen(false);
      setEditTarget(undefined);
      carregar();
    } catch (err: any) {
      toast.error(err.message ?? 'Erro ao salvar funcionário');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInativar = async () => {
    if (!inativarTarget) return;
    setInativarLoading(true);
    try {
      await funcionariosApi.inativar(inativarTarget.login);
      toast.success(`${inativarTarget.nomeCompleto} foi inativado(a).`);
      setInativarTarget(undefined);
      carregar();
    } catch (err: any) {
      toast.error(err.message ?? 'Erro ao inativar funcionário');
    } finally {
      setInativarLoading(false);
    }
  };

  const openCreate = () => { setEditTarget(undefined); setModalOpen(true); };
  const openEdit = (f: FuncionarioResponse) => { setEditTarget(f); setModalOpen(true); };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Funcionários</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Gerencie o cadastro de funcionários do salão</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-primary-foreground hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <Plus size={16} />
            Novo Funcionário
          </button>
        </div>

        {/* Busca */}
        <div className="flex gap-3 mt-5">
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(['nome', 'login', 'perfil'] as const).map((type) => (
              <button
                key={type}
                onClick={() => { setSearchType(type); setSearch(''); setPerfilFilter(''); }}
                className="px-4 py-2 text-sm capitalize transition-colors"
                style={{
                  backgroundColor: searchType === type ? 'var(--primary)' : 'var(--card)',
                  color: searchType === type ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                }}
              >
                {type === 'nome' ? 'Nome' : type === 'login' ? 'Login' : 'Perfil'}
              </button>
            ))}
          </div>

          {searchType === 'perfil' ? (
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <select
                  value={perfilFilter}
                  onChange={(e) => setPerfilFilter(e.target.value as PerfilFuncionario | '')}
                  className="w-full pl-3 pr-8 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-ring/30 appearance-none"
                  style={{ backgroundColor: 'var(--input-background)' }}
                >
                  <option value="">Selecione o perfil...</option>
                  <option value="ADMINISTRADOR">Administrador(a)</option>
                  <option value="RECEPCIONISTA">Recepcionista</option>
                  <option value="PROFISSIONAL">Profissional</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-primary-foreground"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Search size={15} /> Buscar
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="flex-1 overflow-auto px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : funcionarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search size={22} className="text-muted-foreground" />
            </div>
            <p className="text-foreground">Nenhum funcionário encontrado</p>
            <p className="text-muted-foreground text-sm mt-1">Tente uma busca diferente ou cadastre um novo funcionário</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border" style={{ backgroundColor: 'var(--muted)' }}>
                  {['Nome', 'Login', 'Perfil', 'Telefone', 'Especialidade', 'Status', 'Ações'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {funcionarios.map((f) => (
                  <tr key={f.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm text-foreground">{f.nomeCompleto}</div>
                      {f.email && <div className="text-xs text-muted-foreground">{f.email}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{f.login}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${perfilColors[f.perfil]}`}>
                        {perfilLabel[f.perfil]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{f.telefone}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {f.especialidade ? f.especialidade.charAt(0) + f.especialidade.slice(1).toLowerCase() : '—'}
                      {f.horarioTrabalho && <div className="text-xs">{f.horarioTrabalho}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${
                          f.status === 'ATIVO'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-stone-50 text-stone-500 border-stone-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${f.status === 'ATIVO' ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                        {f.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(f)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        {f.status === 'ATIVO' && (
                          <button
                            onClick={() => setInativarTarget(f)}
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
              {funcionarios.length} {funcionarios.length === 1 ? 'funcionário' : 'funcionários'}
            </div>
          </div>
        )}
      </div>

      {/* Modal Criar/Editar */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(undefined); }}
        title={editTarget ? `Editar: ${editTarget.nomeCompleto}` : 'Novo Funcionário'}
      >
        <FuncionarioForm
          funcionario={editTarget}
          onSubmit={handleSubmitForm}
          onCancel={() => { setModalOpen(false); setEditTarget(undefined); }}
          loading={formLoading}
        />
      </Modal>

      {/* Dialog Inativar */}
      <ConfirmDialog
        open={!!inativarTarget}
        title="Inativar Funcionário"
        message={`Tem certeza que deseja inativar "${inativarTarget?.nomeCompleto}"? Agendamentos futuros serão cancelados.`}
        confirmLabel="Inativar"
        onConfirm={handleInativar}
        onCancel={() => setInativarTarget(undefined)}
        loading={inativarLoading}
      />
    </div>
  );
}
