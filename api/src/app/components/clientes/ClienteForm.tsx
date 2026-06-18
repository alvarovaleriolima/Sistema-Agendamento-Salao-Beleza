import { useForm } from 'react-hook-form';
import type { ClienteResponse, ClienteRequest, ClienteUpdateRequest, Status } from '../../../services/api';

interface FormValues {
  nomeCompleto: string;
  dataNascimento: string;
  login: string;
  senha: string;
  senhaAtual: string;
  novaSenha: string;
  telefone: string;
  email: string;
  status: Status | '';
}

interface ClienteFormProps {
  cliente?: ClienteResponse;
  onSubmit: (data: ClienteRequest | ClienteUpdateRequest) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function applyDateMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
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

export function ClienteForm({ cliente, onSubmit, onCancel, loading }: ClienteFormProps) {
  const isEdit = !!cliente;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      nomeCompleto: cliente?.nomeCompleto ?? '',
      dataNascimento: cliente?.dataNascimento ?? '',
      login: cliente?.login ?? '',
      senha: '',
      senhaAtual: '',
      novaSenha: '',
      telefone: cliente?.telefone ?? '',
      email: cliente?.email ?? '',
      status: cliente?.status ?? '',
    },
  });

  const novaSenha = watch('novaSenha');

  const handleFormSubmit = async (values: FormValues) => {
    if (isEdit) {
      const update: ClienteUpdateRequest = {};
      if (values.nomeCompleto !== cliente.nomeCompleto) update.nomeCompleto = values.nomeCompleto;
      if (values.dataNascimento !== (cliente.dataNascimento ?? '')) update.dataNascimento = values.dataNascimento;
      if (values.telefone !== cliente.telefone) update.telefone = values.telefone;
      if (values.email !== (cliente.email ?? '')) update.email = values.email;
      if (values.status) update.status = values.status as Status;
      if (values.novaSenha) {
        update.novaSenha = values.novaSenha;
        update.senhaAtual = values.senhaAtual;
      }
      await onSubmit(update);
    } else {
      const create: ClienteRequest = {
        nomeCompleto: values.nomeCompleto,
        dataNascimento: values.dataNascimento,
        login: values.login,
        senha: values.senha,
        telefone: values.telefone,
        email: values.email || undefined,
        status: values.status as Status,
      };
      await onSubmit(create);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 space-y-4">
      {/* Nome */}
      <div>
        <label className="block text-sm mb-1.5 text-foreground">
          Nome Completo <span className="text-destructive">*</span>
        </label>
        <input
          {...register('nomeCompleto', { required: 'Nome completo é obrigatório' })}
          className={fieldClass(!!errors.nomeCompleto)}
          style={{ backgroundColor: 'var(--input-background)' }}
          placeholder="Ex: João Souza"
        />
        {errors.nomeCompleto && <p className="text-destructive text-xs mt-1">{errors.nomeCompleto.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Data de Nascimento */}
        <div>
          <label className="block text-sm mb-1.5 text-foreground">
            Data de Nascimento <span className="text-destructive">*</span>
          </label>
          <input
            {...register('dataNascimento', {
              required: 'Data de nascimento é obrigatória',
              pattern: { value: /^\d{2}\/\d{2}\/\d{4}$/, message: 'Formato: DD/MM/AAAA' },
            })}
            className={fieldClass(!!errors.dataNascimento)}
            style={{ backgroundColor: 'var(--input-background)' }}
            placeholder="DD/MM/AAAA"
            onChange={(e) => setValue('dataNascimento', applyDateMask(e.target.value))}
          />
          {errors.dataNascimento && <p className="text-destructive text-xs mt-1">{errors.dataNascimento.message}</p>}
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
            placeholder="Ex: joao.souza"
            disabled={isEdit}
          />
          {errors.login && <p className="text-destructive text-xs mt-1">{errors.login.message}</p>}
          {isEdit && <p className="text-muted-foreground text-xs mt-1">Login não pode ser alterado</p>}
        </div>

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
          {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Cliente'}
        </button>
      </div>
    </form>
  );
}
