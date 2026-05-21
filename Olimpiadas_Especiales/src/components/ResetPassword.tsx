import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import apiClient from '../api/apiClient';

const ResetPassword = (): React.JSX.Element => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Falta el token de recuperación. Por favor, solicita un nuevo enlace.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('La contraseña debe contener al menos una letra mayúscula.');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError('La contraseña debe contener al menos un número.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/auth/reset-password', { token, password });
      
      Swal.fire({
        icon: 'success',
        title: '¡Contraseña restablecida!',
        text: 'Tu contraseña se ha actualizado correctamente. Ya puedes iniciar sesión con tu nueva contraseña.',
        confirmButtonColor: '#e62334'
      }).then(() => {
        navigate('/login');
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error al restablecer la contraseña.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'El enlace de recuperación es inválido o ha expirado.',
        confirmButtonColor: '#e62334'
      });
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
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #334155;
        }
        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .password-input-wrapper input {
          width: 100%;
          padding: 12px;
          padding-right: 40px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          box-sizing: border-box;
        }
        .eye-toggle-btn {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
      `}</style>

      <button className="boton_regresar" onClick={() => navigate('/login')}>
        <i className="fa-solid fa-arrow-left"></i> Ir a Login
      </button>

      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: '#fff5f5', marginBottom: '16px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e62334" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '8px', marginTop: '0' }}>Restablecer Contraseña</h1>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>
            Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
          </p>
        </div>

        {error && <div className="error-message"><i className="fa-solid fa-circle-exclamation"></i> {error}</div>}

        {!token ? (
          <div style={{ textAlign: 'center' }}>
            <div className="error-message">
              El enlace es inválido o no contiene un token de recuperación válido.
            </div>
            <button className="btn-login" onClick={() => navigate('/forgot-password')}>
              Solicitar Nuevo Enlace
            </button>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleReset}>
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
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

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Confirmar Nueva Contraseña</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
              {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
