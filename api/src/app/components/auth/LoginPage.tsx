import { useState } from 'react';
import { api, AuthSession } from '../../../services/api';
import { SIcon } from '../SIcon';

function telMask(v: string) {
  v = v.replace(/\D/g, '');
  if (v.length <= 2) return v;
  if (v.length <= 6) return `(${v.slice(0,2)}) ${v.slice(2)}`;
  if (v.length <= 10) return `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
  return `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7,11)}`;
}

function dtMask(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4, 8)}`;
}

interface LoginPageProps {
  onLogin: (session: AuthSession) => void;
  toast: (msg: string, type?: 'success' | 'error') => void;
}

export function LoginPage({ onLogin, toast }: LoginPageProps) {
  const [tipo, setTipo] = useState<'funcionario' | 'cliente'>('funcionario');
  const [isRegistering, setIsRegistering] = useState(false);
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  
  const [regNome, setRegNome] = useState('');
  const [regNascimento, setRegNascimento] = useState('');
  const [regTelefone, setRegTelefone] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!login || !senha) {
      setErro('Preencha os campos de login e senha.');
      return;
    }
    
    setErro('');
    setLoading(true);
    
    try {
      if (tipo === 'funcionario') {
        const usuario = await api.auth.loginFuncionario(login, senha);
        const session: AuthSession = { tipo: 'funcionario', usuario };
        localStorage.setItem('@Salao:session', JSON.stringify(session));
        onLogin(session);
        toast(`Bem-vindo(a), ${usuario.nomeCompleto}!`, 'success');
      } else {
        const usuario = await api.auth.loginCliente(login, senha);
        const session: AuthSession = { tipo: 'cliente', usuario };
        localStorage.setItem('@Salao:session', JSON.stringify(session));
        onLogin(session);
        toast(`Bem-vindo(a), ${usuario.nomeCompleto}!`, 'success');
      }
    } catch (err: any) {
      setErro(err.message || 'Credenciais inválidas ou usuário inativo.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!login || !senha || !regNome || !regNascimento || !regTelefone) {
      setErro('Preencha os campos obrigatórios (*).');
      return;
    }
    setErro('');
    setLoading(true);
    try {
      await api.clientes.criar({
        nomeCompleto: regNome,
        dataNascimento: regNascimento,
        telefone: regTelefone,
        email: regEmail || undefined,
        login,
        senha,
        status: 'ATIVO'
      });
      const usuario = await api.auth.loginCliente(login, senha);
      const session: AuthSession = { tipo: 'cliente', usuario };
      localStorage.setItem('@Salao:session', JSON.stringify(session));
      onLogin(session);
      toast(`Cadastro realizado com sucesso! Bem-vindo(a), ${usuario.nomeCompleto}!`, 'success');
    } catch (err: any) {
      setErro(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="s-login-screen">
      <div className="s-login-card">
        <div className="s-login-logo">
          <div className="s-login-logo-icon">
            <SIcon name="scissors" size={24} />
          </div>
          <h1>Salão</h1>
          <span>Gestão</span>
        </div>

        <div className="s-login-tabs">
          <button
            className={`s-login-tab ${tipo === 'funcionario' ? 'active' : ''}`}
            onClick={() => { setTipo('funcionario'); setErro(''); setIsRegistering(false); }}
          >
            Funcionário
          </button>
          <button
            className={`s-login-tab ${tipo === 'cliente' ? 'active' : ''}`}
            onClick={() => { setTipo('cliente'); setErro(''); setIsRegistering(false); }}
          >
            Cliente
          </button>
        </div>

        <form className="s-login-form" onSubmit={isRegistering ? handleRegister : handleLogin}>
          {erro && <div className="s-login-error">{erro}</div>}

          {isRegistering && (
            <>
              <div className="s-field">
                <label className="s-label">Nome Completo *</label>
                <input type="text" className="s-input" value={regNome} onChange={e => setRegNome(e.target.value)} placeholder="Digite seu nome completo" disabled={loading} autoFocus />
              </div>
              <div className="s-field">
                <label className="s-label">Data de Nascimento *</label>
                <input type="text" className="s-input" value={regNascimento} onChange={e => setRegNascimento(dtMask(e.target.value))} placeholder="DD/MM/AAAA" disabled={loading} />
              </div>
              <div className="s-field">
                <label className="s-label">Telefone *</label>
                <input type="text" className="s-input" value={regTelefone} onChange={e => setRegTelefone(telMask(e.target.value))} placeholder="(00) 00000-0000" disabled={loading} />
              </div>
              <div className="s-field">
                <label className="s-label">Email (Opcional)</label>
                <input type="email" className="s-input" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="Digite seu email" disabled={loading} />
              </div>
            </>
          )}

          <div className="s-field">
            <label className="s-label">Login {isRegistering ? '*' : ''}</label>
            <input
              type="text"
              className="s-input"
              value={login}
              onChange={e => setLogin(e.target.value)}
              placeholder="Digite seu login"
              disabled={loading}
              autoFocus={!isRegistering}
            />
          </div>

          <div className="s-field">
            <label className="s-label">Senha {isRegistering ? '*' : ''}</label>
            <input
              type="password"
              className="s-input"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              disabled={loading}
            />
          </div>

          <button type="submit" className="s-btn-primary s-login-submit" disabled={loading}>
            {loading ? (
              <div className="s-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
            ) : isRegistering ? (
              <>
                <SIcon name="user" size={16} /> Cadastrar
              </>
            ) : (
              <>
                <SIcon name="log-in" size={16} /> Entrar
              </>
            )}
          </button>
        </form>

        <p className="s-login-hint">
          {isRegistering ? (
            <>
              Já tem uma conta? <button type="button" style={{ background: 'transparent', border: 'none', color: 'var(--gold)', textDecoration: 'underline', padding: 0, cursor: 'pointer', font: 'inherit' }} onClick={() => { setIsRegistering(false); setErro(''); }}>Faça login aqui</button>.
            </>
          ) : tipo === 'cliente' ? (
            <>
              Ainda não tem conta? <button type="button" style={{ background: 'transparent', border: 'none', color: 'var(--gold)', textDecoration: 'underline', padding: 0, cursor: 'pointer', font: 'inherit' }} onClick={() => { setIsRegistering(true); setErro(''); }}>Cadastre-se aqui</button>.
            </>
          ) : (
            'Caso não saiba suas credenciais, entre em contato com a administração do salão.'
          )}
        </p>
      </div>
    </div>
  );
}
