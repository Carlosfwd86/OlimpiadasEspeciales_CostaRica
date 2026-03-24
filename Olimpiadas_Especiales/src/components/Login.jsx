import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ cedula: '', contrasenia: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {

      // Fetch usuarios from API
      const response = await fetch("http://localhost:3000/atletas");
      if (!response.ok) {
        throw new Error("No se pudo conectar con el servidor.");
      }

      const atletas = await resAtletas.json();
      const entrenadores = await resEntrenadores.json();
      const tutores = await resTutores.json();
      const voluntarios = await resVoluntarios.json();

      const todosLosUsuarios = [...atletas, ...entrenadores, ...tutores, ...voluntarios];

      // Find user that matches cedula and contrasenia/password
      const usuarioValido = todosLosUsuarios.find(
        (user) => user.cedula === formData.cedula && (user.contrasenia === formData.contrasenia || user.password === formData.contrasenia)
      );

      if (usuarioValido) {
        // Guardar sesión en localStorage
        localStorage.setItem('usuarioSesion', JSON.stringify(usuarioValido));
        // Notificar a la Navbar para que actualice el botón en tiempo real
        window.dispatchEvent(new Event('sesionActualizada'));
        alert(`Bienvenido(a), ingresaste como ${usuarioValido.rol}`);
        switch (usuarioValido.rol) {
          case 'atleta':
            navigate('/atleta');
            break;
          case 'entrenador':
            navigate('/entrenadores');
            break;
          case 'tutor':
            navigate('/tutor');
            break;
          case 'voluntario':
            navigate('/voluntarios');
            break;
          default:
            navigate('/');
        }
      } else {
        setError('Cédula o contraseña incorrectos.');
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error en la autenticación. Asegúrese de que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Iniciar Sesión</h1>
        <p>Ingresa tus credenciales para acceder a tu perfil</p>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="cedula">Cédula</label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              placeholder="Ej: 111111111"
              value={formData.cedula}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasenia">Contraseña</label>
            <input
              type="password"
              id="contrasenia"
              name="contrasenia"
              placeholder="••••••••"
              value={formData.contrasenia}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
