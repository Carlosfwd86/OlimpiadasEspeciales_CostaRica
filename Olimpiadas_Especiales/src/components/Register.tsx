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
    edad: '' // Added missing edad field for validation
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
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    if (formData.edad && parseInt(formData.edad) < 1) {
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
        fechaNacimiento: formData.fechaNacimiento,
        genero: formData.genero,
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

    } catch (err: any) {
      console.error(err);
      Swal.fire({ 
        icon: 'error', 
        title: 'Error de Registro', 
        text: err.message || 'No se pudo completar el registro. Inténtalo de nuevo.' 
      });
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
            <label htmlFor="pais">País</label>
            <input
              type="text"
              id="pais"
              name="pais"
              placeholder="Ingrese el nombre del País"
              value={formData.pais}
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
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              placeholder="Tu fecha de nacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="genero">Genero</label>
            <select
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="NoDecir">Prefiero no decirlo</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
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
