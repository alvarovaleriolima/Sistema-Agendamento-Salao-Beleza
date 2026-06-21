import { useState } from 'react';
import { api, type AuthSession } from '../../../services/api';

type Tipo = 'funcionario' | 'cliente';

interface LoginPageProps {
  onLogin: (session: AuthSession) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [tipo, setTipo] = useState<Tipo>('funcionario');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const trocarTipo = (t: Tipo) => {
    setTipo(t);
    setErro('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login.trim() || !senha) {
      setErro('Informe login e senha.');
      return;
    }
    setLoading(true);
    setErro('');
    try {
      if (tipo === 'funcionario') {
        const usuario = await api.auth.loginFuncionario(login.trim(), senha);
        onLogin({ tipo: 'funcionario', usuario });
      } else {
        const usuario = await api.auth.loginCliente(login.trim(), senha);
        onLogin({ tipo: 'cliente', usuario });
      }
    } catch (e: any) {
      setErro(e.message || 'Login ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="s-login-screen">
      <div className="s-login-card">
        <div className="s-login-logo">
          <div className="s-login-logo-icon">✂</div>
          <h1>Salão</h1>
          <span>Gestão</span>
        </div>

        <div className="s-login-tabs">
          <button
            type="button"
            className={`s-login-tab${tipo === 'funcionario' ? ' active' : ''}`}
            onClick={() => trocarTipo('funcionario')}
          >
            Funcionário
          </button>
          <button
            type="button"
            className={`s-login-tab${tipo === 'cliente' ? ' active' : ''}`}
            onClick={() => trocarTipo('cliente')}
          >
            Cliente
          </button>
        </div>

        <form className="s-login-form" onSubmit={submit}>
          {erro && <div className="s-login-error">{erro}</div>}

          <div className="s-field">
            <label className="s-label">Login</label>
            <input
              className="s-input"
              value={login}
              onChange={e => setLogin(e.target.value)}
              placeholder="login.usuario"
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="s-field">
            <label className="s-label">Senha</label>
            <input
              type="password"
              className="s-input"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="s-btn-primary s-login-submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="s-login-hint">
          Acesso restrito a {tipo === 'funcionario' ? 'funcionários' : 'clientes'} cadastrados
          e ativos no sistema.
        </p>
      </div>
    </div>
  );
}