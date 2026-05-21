import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/auth/forgot-password', { correo_electronico: email });
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error al procesar tu solicitud.');
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
          transition: transform 0.3s ease;
        }
        .login-card:hover {
          transform: translateY(-2px);
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
        .success-message {
          background: #f0fdf4;
          color: #15803d;
          padding: 16px;
          border-radius: 12px;
          font-size: 14px;
          margin-bottom: 24px;
          border: 1px solid #dcfce7;
          line-height: 1.6;
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

      <button className="boton_regresar" onClick={() => navigate('/login')}>
        <i className="fa-solid fa-arrow-left"></i> Volver a Login
      </button>

      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: '#fff5f5', marginBottom: '16px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e62334" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8"></path>
              <path d="M12 18h.01"></path>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
            </svg>
          </div>
          <h1 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '8px', marginTop: '0' }}>¿Olvidaste tu contraseña?</h1>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>
            No te preocupes. Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        {error && <div className="error-message"><i className="fa-solid fa-circle-exclamation"></i> {error}</div>}

        {success ? (
          <div>
            <div className="success-message">
              <i className="fa-solid fa-circle-check" style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}></i>
              Si el correo electrónico está registrado en nuestro sistema, recibirás un enlace de recuperación en los próximos minutos. Por favor, revisa también tu bandeja de correo no deseado (spam).
            </div>
            <button className="btn-login" onClick={() => navigate('/login')}>
              Volver al Inicio de Sesión
            </button>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Correo Electrónico</label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Enviando enlace...' : 'Enviar Enlace de Recuperación'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
