import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = (): React.JSX.Element => {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await auth.login({ correo_electronico: formData.email, password: formData.password });
      if (loggedInUser && loggedInUser.rol_id === 1) {
        navigate('/admin');
      } else {
        navigate('/perfil');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <style>{`
        .boton_regresar {
          position: absolute;
          top: 30px;
          left: 40px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }
        .boton_regresar:hover {
          background: #f1f5f9;
          color: #e62334;
          border-color: #e62334;
          transform: translateX(-5px);
        }
        .login-card {
            background: white;
            padding: 40px;
            border-radius: 24px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 450px;
        }
        .error-message {
            background: #fef2f2;
            color: #ef4444;
            padding: 12px;
            border-radius: 10px;
            font-size: 14px;
            margin-bottom: 20px;
            border: 1px solid #fee2e2;
            text-align: center;
        }
        .btn-login {
            width: 100%;
            padding: 14px;
            background: #e62334;
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 10px;
            transition: background 0.3s;
        }
        .btn-login:hover { background: #cc1f2e; }
        .btn-login:disabled { background: #cbd5e1; cursor: not-allowed; }
      `}</style>

      <button className="boton_regresar" onClick={() => navigate('/')}>
        <i className="fa-solid fa-arrow-left"></i> Inicio
      </button>

      <div className="login-card">
        <h1 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '8px' }}>Iniciar Sesión</h1>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Ingresa tus credenciales para continuar.</p>

        {error && <div className="error-message"><i className="fa-solid fa-circle-exclamation"></i> {error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Correo Electrónico</label>
            <input type="email" name="email" placeholder="ejemplo@correo.com" value={formData.email} onChange={handleChange} required
                   style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="password">Contraseña</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0'
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
          ¿No tienes una cuenta? <span onClick={() => navigate('/registro')} style={{ color: '#e62334', fontWeight: '700', cursor: 'pointer' }}>Regístrate</span>
        </div>
      </div>
    </div>
  );
};


export default Login;
