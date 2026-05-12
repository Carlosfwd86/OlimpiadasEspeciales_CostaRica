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
    } catch (err) {
      console.error(err);
      setError('Correo o contraseña incorrectos. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ position: 'relative' }}>
      <style>{`
        .boton_regresar {
          position: absolute;
          top: 30px;
          left: 40px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 22px;
          background: #ffffff;
          border: 1px solid #ff0000;
          border-radius: 12px;
          color: #ff0000;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .boton_regresar:hover {
          background: #f8fafc;
          color: #1e293b;
          border-color: #1e293b;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transform: translateX(-5px);
        }

        .boton_regresar svg {
          transition: transform 0.3s ease;
          stroke: #ff0000;
        }

        .boton_regresar:hover svg {
          transform: translateX(-3px);
          stroke: #1e293b;
        }
      `}</style>

      <button className="boton_regresar" onClick={() => navigate('/')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Regresar
      </button>
      <div className="login-card">
        <h1>Iniciar Sesión</h1>
        <p>Ingresa tus credenciales para acceder a tu perfil</p>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ej: ejemplo@correo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
          ¿No tienes una cuenta? <span onClick={() => navigate('/registro')} style={{ color: '#FF0000', cursor: 'pointer', fontWeight: '600' }}>Regístrate aquí</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
