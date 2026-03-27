import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createUsuario } from '../services/ServicesUsuarios';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correoElectronico: '',
    password: '',
    confirmPassword: '',
    edad: ''
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
        correoElectronico: formData.correoElectronico.toLowerCase(),
        password: formData.password,
        edad: formData.edad
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
    <div className="register-container">
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
