import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type {
  FuncionarioResponse,
  FuncionarioRequest,
  FuncionarioUpdateRequest,
  PerfilFuncionario,
  Especialidade,
  Status,
} from '../../../services/api';

interface FormValues {
  nomeCompleto: string;
  login: string;
  senha: string;
  senhaAtual: string;
  novaSenha: string;
  perfil: PerfilFuncionario | '';
  telefone: string;
  email: string;
  status: Status | '';
  especialidade: Especialidade | '';
  horarioTrabalho: string;
}

interface FuncionarioFormProps {
  funcionario?: FuncionarioResponse;
  onSubmit: (data: FuncionarioRequest | FuncionarioUpdateRequest) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const perfisOptions: { value: PerfilFuncionario; label: string }[] = [
  { value: 'ADMINISTRADOR', label: 'Administrador(a)' },
  { value: 'RECEPCIONISTA', label: 'Recepcionista' },
  { value: 'PROFISSIONAL', label: 'Profissional' },
];

const especialidadeOptions: { value: Especialidade; label: string }[] = [
  { value: 'CABELO', label: 'Cabelo' },
  { value: 'MANICURE', label: 'Manicure' },
  { value: 'PEDICURE', label: 'Pedicure' },
  { value: 'ESTETICA', label: 'Estética' },
  { value: 'MAQUIAGEM', label: 'Maquiagem' },
  { value: 'DEPILACAO', label: 'Depilação' },
  { value: 'SOBRANCELHA', label: 'Sobrancelha' },
  { value: 'MASSAGEM', label: 'Massagem' },
];

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function fieldClass(hasError: boolean) {
  return `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-ring/30 ${
    hasError ? 'border-destructive' : 'border-border'
  }`;
}

function selectClass(hasError: boolean) {
  return `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-ring/30 bg-input-background ${
    hasError ? 'border-destructive' : 'border-border'
  }`;
}

export function FuncionarioForm({ funcionario, onSubmit, onCancel, loading }: FuncionarioFormProps) {
  const isEdit = !!funcionario;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      nomeCompleto: funcionario?.nomeCompleto ?? '',
      login: funcionario?.login ?? '',
      senha: '',
      senhaAtual: '',
      novaSenha: '',
      perfil: funcionario?.perfil ?? '',
      telefone: funcionario?.telefone ?? '',
      email: funcionario?.email ?? '',
      status: funcionario?.status ?? '',
      especialidade: funcionario?.especialidade ?? '',
      horarioTrabalho: funcionario?.horarioTrabalho ?? '',
    },
  });

  const perfil = watch('perfil');
  const novaSenha = watch('novaSenha');
  const isProfissional = perfil === 'PROFISSIONAL';

  const handleFormSubmit = async (values: FormValues) => {
    if (isEdit) {
      const update: FuncionarioUpdateRequest = {};
      if (values.nomeCompleto !== funcionario.nomeCompleto) update.nomeCompleto = values.nomeCompleto;
      if (values.perfil) update.perfil = values.perfil as PerfilFuncionario;
      if (values.telefone !== funcionario.telefone) update.telefone = values.telefone;
      if (values.email !== (funcionario.email ?? '')) update.email = values.email;
      if (values.status) update.status = values.status as Status;
      if (values.especialidade) update.especialidade = values.especialidade as Especialidade;
      if (values.horarioTrabalho !== (funcionario.horarioTrabalho ?? '')) update.horarioTrabalho = values.horarioTrabalho;
      if (values.novaSenha) {
        update.novaSenha = values.novaSenha;
        update.senhaAtual = values.senhaAtual;
      }
      await onSubmit(update);
    } else {
      const create: FuncionarioRequest = {
        nomeCompleto: values.nomeCompleto,
        login: values.login,
        senha: values.senha,
        perfil: values.perfil as PerfilFuncionario,
        telefone: values.telefone,
        email: values.email || undefined,
        status: values.status as Status,
        especialidade: isProfissional ? (values.especialidade as Especialidade) : undefined,
        horarioTrabalho: isProfissional ? values.horarioTrabalho : undefined,
      };
      await onSubmit(create);
    }
  };

  useEffect(() => {
    if (!isProfissional) {
      setValue('especialidade', '');
      setValue('horarioTrabalho', '');
    }
  }, [isProfissional, setValue]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 space-y-4">
      {/* Nome Completo */}
      <div>
        <label className="block text-sm mb-1.5 text-foreground">
          Nome Completo <span className="text-destructive">*</span>
        </label>
        <input
          {...register('nomeCompleto', { required: 'Nome completo é obrigatório' })}
          className={fieldClass(!!errors.nomeCompleto)}
          style={{ backgroundColor: 'var(--input-background)' }}
          placeholder="Ex: Maria Silva"
        />
        {errors.nomeCompleto && <p className="text-destructive text-xs mt-1">{errors.nomeCompleto.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Login */}
        <div>
          <label className="block text-sm mb-1.5 text-foreground">
            Login <span className="text-destructive">*</span>
          </label>
          <input
            {...register('login', { required: !isEdit && 'Login é obrigatório' })}
            className={fieldClass(!!errors.login)}
            style={{ backgroundColor: 'var(--input-background)' }}
            placeholder="Ex: maria.silva"
            disabled={isEdit}
          />
          {errors.login && <p className="text-destructive text-xs mt-1">{errors.login.message}</p>}
          {isEdit && <p className="text-muted-foreground text-xs mt-1">Login não pode ser alterado</p>}
        </div>

        {/* Perfil */}
        <div>
          <label className="block text-sm mb-1.5 text-foreground">
            Perfil <span className="text-destructive">*</span>
          </label>
          <select
            {...register('perfil', { required: 'Perfil é obrigatório', validate: v => v !== '' || 'Perfil é obrigatório' })}
            className={selectClass(!!errors.perfil)}
          >
            <option value="">Selecione...</option>
            {perfisOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors.perfil && <p className="text-destructive text-xs mt-1">{errors.perfil.message}</p>}
        </div>
      </div>

      {/* Senha (criar) */}
      {!isEdit && (
        <div>
          <label className="block text-sm mb-1.5 text-foreground">
            Senha <span className="text-destructive">*</span>
          </label>
          <input
            type="password"
            {...register('senha', {
              required: 'Senha é obrigatória',
              minLength: { value: 8, message: 'Senha deve ter no mínimo 8 caracteres' },
            })}
            className={fieldClass(!!errors.senha)}
            style={{ backgroundColor: 'var(--input-background)' }}
            placeholder="Mínimo 8 caracteres"
          />
          {errors.senha && <p className="text-destructive text-xs mt-1">{errors.senha.message}</p>}
        </div>
      )}

      {/* Alterar senha (editar) */}
      {isEdit && (
        <div className="rounded-lg border border-border p-4 space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Alterar senha (opcional)</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1.5 text-foreground">Senha Atual</label>
              <input
                type="password"
                {...register('senhaAtual', {
                  validate: (v) => !novaSenha || v !== '' || 'Informe a senha atual para alterar',
                })}
                className={fieldClass(!!errors.senhaAtual)}
                style={{ backgroundColor: 'var(--input-background)' }}
              />
              {errors.senhaAtual && <p className="text-destructive text-xs mt-1">{errors.senhaAtual.message}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1.5 text-foreground">Nova Senha</label>
              <input
                type="password"
                {...register('novaSenha', {
                  minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                })}
                className={fieldClass(!!errors.novaSenha)}
                style={{ backgroundColor: 'var(--input-background)' }}
              />
              {errors.novaSenha && <p className="text-destructive text-xs mt-1">{errors.novaSenha.message}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Telefone */}
        <div>
          <label className="block text-sm mb-1.5 text-foreground">
            Telefone <span className="text-destructive">*</span>
          </label>
          <input
            {...register('telefone', {
              required: 'Telefone é obrigatório',
              pattern: { value: /^\(\d{2}\) \d{5}-\d{4}$/, message: 'Formato: (00) 00000-0000' },
            })}
            className={fieldClass(!!errors.telefone)}
            style={{ backgroundColor: 'var(--input-background)' }}
            placeholder="(00) 00000-0000"
            onChange={(e) => setValue('telefone', applyPhoneMask(e.target.value))}
          />
          {errors.telefone && <p className="text-destructive text-xs mt-1">{errors.telefone.message}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm mb-1.5 text-foreground">
            Status <span className="text-destructive">*</span>
          </label>
          <select
            {...register('status', { required: 'Status é obrigatório', validate: v => v !== '' || 'Status é obrigatório' })}
            className={selectClass(!!errors.status)}
          >
            <option value="">Selecione...</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>
          {errors.status && <p className="text-destructive text-xs mt-1">{errors.status.message}</p>}
        </div>
      </div>

      {/* E-mail */}
      <div>
        <label className="block text-sm mb-1.5 text-foreground">E-mail</label>
        <input
          type="email"
          {...register('email')}
          className={fieldClass(false)}
          style={{ backgroundColor: 'var(--input-background)' }}
          placeholder="email@exemplo.com"
        />
      </div>

      {/* Campos do Profissional */}
      {isProfissional && (
        <div className="rounded-lg border border-border p-4 space-y-4" style={{ backgroundColor: 'var(--muted)' }}>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Dados do Profissional</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1.5 text-foreground">
                Especialidade <span className="text-destructive">*</span>
              </label>
              <select
                {...register('especialidade', {
                  validate: (v) => !isProfissional || v !== '' || 'Especialidade é obrigatória para Profissional',
                })}
                className={selectClass(!!errors.especialidade)}
              >
                <option value="">Selecione...</option>
                {especialidadeOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {errors.especialidade && <p className="text-destructive text-xs mt-1">{errors.especialidade.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1.5 text-foreground">
                Horário de Trabalho <span className="text-destructive">*</span>
              </label>
              <input
                {...register('horarioTrabalho', {
                  validate: (v) => !isProfissional || v.trim() !== '' || 'Horário de trabalho é obrigatório para Profissional',
                })}
                className={fieldClass(!!errors.horarioTrabalho)}
                style={{ backgroundColor: 'var(--input-background)' }}
                placeholder="09:00 às 18:00"
              />
              {errors.horarioTrabalho && <p className="text-destructive text-xs mt-1">{errors.horarioTrabalho.message}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-2 text-sm rounded-lg border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 text-sm rounded-lg text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Funcionário'}
        </button>
      </div>
    </form>
  );
}
