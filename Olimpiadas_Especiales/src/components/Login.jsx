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
      // Fetch all user collections from the local server
      const endpoints = ["Admin", "atletas", "entrenadores", "tutores", "voluntarios"];
      const baseUrl = "http://localhost:3001";
      
      const responses = await Promise.all(
        endpoints.map(endpoint => fetch(`${baseUrl}/${endpoint}`).then(res => {
          if (!res.ok) throw new Error(`Error al conectar con ${endpoint}`);
          return res.json();
        }))
      );

      // Flatten all arrays into a single user list
      const todosLosUsuarios = responses.flat();

      // Find user that matches cedula (or correoElectronico for admin) and password/contrasenia
      const usuarioValido = todosLosUsuarios.find(user => {
        const inputCred = formData.cedula.toLowerCase();
        const userCedula = user.cedula ? user.cedula.toString().toLowerCase() : '';
        const userEmail = user.correoElectronico ? user.correoElectronico.toLowerCase() : '';
        
        const matchesIdentifier = userCedula === inputCred || userEmail === inputCred;
        
        const inputPass = formData.contrasenia;
        const userPass = user.password || user.contrasenia;
        
        const matchesPassword = userPass === inputPass;
        
        return matchesIdentifier && matchesPassword;
      });

      if (usuarioValido) {
        // Guardar sesión en localStorage
        localStorage.setItem('usuarioSesion', JSON.stringify(usuarioValido));
        
        // Notificar a la Navbar para que actualice el botón en tiempo real
        window.dispatchEvent(new Event('sesionActualizada'));
        
        alert(`Bienvenido(a), ingresaste como ${usuarioValido.rol}`);
        
        // Redireccionar según el rol
        switch (usuarioValido.rol?.toLowerCase()) {
          case 'admin':
            navigate('/admin');
            break;
          case 'atleta':
            navigate('/perfil');
            break;
          case 'tutor':
            navigate('/perfil');
            break;
          case 'entrenador':
            navigate('/entrenadores');
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
      setError('Ocurrió un error en la autenticación. Asegúrese de que el servidor esté corriendo en el puerto 3001.');
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
