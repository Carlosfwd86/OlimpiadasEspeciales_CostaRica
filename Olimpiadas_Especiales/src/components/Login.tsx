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
      await auth.login({ correo_electronico: formData.email, password: formData.password });
      navigate('/perfil');
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

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Contraseña</label>
            <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required
                   style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
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
