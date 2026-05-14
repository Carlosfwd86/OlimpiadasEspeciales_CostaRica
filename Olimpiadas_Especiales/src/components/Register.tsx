import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createUsuario } from '../services/ServicesUsuarios';
import '../styles/Register.css';

const Register = (): React.JSX.Element => {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    correoElectronico: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    pais: '',
    genero: '',
    fechaNacimiento: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validaciones de UI
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    if (formData.password.length < 6) {
        Swal.fire({ icon: 'warning', title: 'Seguridad', text: 'La contraseña debe tener al menos 6 caracteres.' });
        return;
    }

    setLoading(true);
    try {
      await createUsuario(formData);
      
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Tu cuenta ha sido creada. Ya puedes iniciar sesión.',
        confirmButtonColor: '#e62334'
      }).then(() => {
        navigate('/login');
      });

    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.response?.data?.details?.[0] || err.message || 'No se pudo completar el registro.';
      Swal.fire({ 
        icon: 'error', 
        title: 'Error de Registro', 
        text: typeof errorMessage === 'object' ? Object.values(errorMessage)[0] : errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
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
        .register-card {
            background: white;
            padding: 40px;
            border-radius: 24px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 550px;
        }
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .btn-register {
            width: 100%;
            padding: 14px;
            background: #e62334;
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 20px;
            transition: background 0.3s;
        }
        .btn-register:hover { background: #cc1f2e; }
        .btn-register:disabled { background: #cbd5e1; cursor: not-allowed; }
      `}</style>

      <button className="boton_regresar" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-arrow-left"></i> Regresar
      </button>

      <div className="register-card">
        <h1 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '8px' }}>Crear Cuenta</h1>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Únete a la familia de Olimpiadas Especiales Costa Rica.</p>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Nombre Completo</label>
            <input type="text" name="nombre" placeholder="Ej. Juan Pérez" value={formData.nombre} onChange={handleChange} required 
                   style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Identificación</label>
              <input type="text" name="cedula" placeholder="123456789" value={formData.cedula} onChange={handleChange} required
                     style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Teléfono</label>
              <input type="text" name="telefono" placeholder="88887777" value={formData.telefono} onChange={handleChange}
                     style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
            </div>
          </div>

          <div className="form-grid" style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>País</label>
              <input type="text" name="pais" placeholder="Costa Rica" value={formData.pais} onChange={handleChange}
                     style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Género</label>
              <select name="genero" value={formData.genero} onChange={handleChange} required
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Correo Electrónico</label>
            <input type="email" name="correoElectronico" placeholder="usuario@correo.com" value={formData.correoElectronico} onChange={handleChange} required
                   style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Fecha de Nacimiento</label>
            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required
                   style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
          </div>

          <div className="form-grid" style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Contraseña</label>
              <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required
                     style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Confirmar</label>
              <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required
                     style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
            </div>
          </div>

          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? 'Procesando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
          ¿Ya tienes cuenta? <span onClick={() => navigate('/login')} style={{ color: '#e62334', fontWeight: '700', cursor: 'pointer' }}>Inicia Sesión</span>
        </div>
      </div>
    </div>
  );
};

export default Register;

