import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createUsuario } from '../services/ServicesUsuarios';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    correoElectronico: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    edad: '',
    rolUsuario: '',
    otroRol: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    if (parseInt(formData.edad) < 1) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'La edad debe ser un número válido.' });
      return;
    }

    setLoading(true);
    try {
      const newUser = {
        nombre: formData.nombre,
        cedula: formData.cedula,
        correoElectronico: formData.correoElectronico.toLowerCase(),
        telefono: formData.telefono,
        password: formData.password,
        edad: formData.edad,
        rol: formData.rolUsuario === 'otro' ? formData.otroRol : formData.rolUsuario,
        fechaRegistro: new Date().toISOString()
      };

      await createUsuario(newUser);
      
      Swal.fire({
        icon: 'success',
        title: '¡Registro Exitoso!',
        text: 'Ahora puedes iniciar sesión con tu cuenta.',
        confirmButtonColor: '#FF0000'
      }).then(() => {
        navigate('/login');
      });

    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo completar el registro. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container" style={{ position: 'relative' }}>
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

      <button className="boton_regresar" onClick={() => navigate(-1)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Regresar
      </button>
      <div className="register-card">
        <h1>Únete a Nosotros</h1>
        <p>Crea tu cuenta básica para empezar tu camino en Olimpiadas Especiales</p>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Tu nombre y apellidos"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cedula">identificación</label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              placeholder="Ingrese # de cedula"
              value={formData.cedula}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="correoElectronico">Correo Electrónico</label>
            <input
              type="email"
              id="correoElectronico"
              name="correoElectronico"
              placeholder="ejemplo@correo.com"
              value={formData.correoElectronico}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Telefono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              placeholder="ejem: 8888-5050"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rolUsuario">Yo soy:</label>
            <select
              id="rolUsuario"
              name="rolUsuario"
              value={formData.rolUsuario}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #FF0000',
                fontSize: '1rem',
                backgroundColor: '#fff',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              <option value="" disabled>Selecciona una opción</option>
              <option value="atleta">Atleta</option>
              <option value="entrenador">Entrenador</option>
              <option value="tutor">Tutor / Familiar</option>
              <option value="voluntario">Voluntario</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {formData.rolUsuario === 'otro' && (
            <div className="form-group" style={{ animation: 'fadeIn 0.3s ease' }}>
              <label htmlFor="otroRol">Indique cómo quiere registrarse:</label>
              <input
                type="text"
                id="otroRol"
                name="otroRol"
                placeholder="Ej: Patrocinador, Prensa, etc."
                value={formData.otroRol}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="edad">Edad</label>
            <input
              type="number"
              id="edad"
              name="edad"
              placeholder="Tu edad"
              value={formData.edad}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="login-link">
          ¿Ya tienes una cuenta? <span onClick={() => navigate('/login')}>Inicia Sesión</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
