import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = (): React.JSX.Element => {
  const navegar = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleCerrarSesion = async (): Promise<void> => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      await logout();
      navegar("/");
    }
  };

  return (
    <nav className="navbar_principal">
      <div className="navbar_logotipo" onClick={() => navegar("/")}>
        <img src="/img/Logo Olimpiadas.png" alt="Logo Olimpiadas Especiales" className="icono_rojo_so" />
      </div>
      <div className="navbar_menu_derecha">
        <ul className="lista_navegacion">
          <li className="enlace_nav" onClick={() => navegar("/")}>INICIO</li>
          <li className="enlace_nav" onClick={() => navegar("/nosotros")}>NOSOTROS</li>
          <li className="enlace_nav" onClick={() => navegar("/eventos")}>EVENTOS</li>
          <li className="enlace_nav" onClick={() => navegar("/contacto")}>CONTÁCTANOS</li>
          <li className="enlace_nav" onClick={() => navegar("/plataforma-registro")}
            style={{ background: '#FF0000', color: '#ffffff', padding: '8px 18px', borderRadius: '50px', fontWeight: '900', letterSpacing: '0.05em' }}>
            INSCRIBIRSE
          </li>
        </ul>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isAuthenticated && user ? (
            <>
              <span className="saludo_usuario" onClick={() => navegar("/perfil")} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <i className="fa-solid fa-circle-user" style={{ color: '#E00000' }}></i>
                Hola, <strong>{user.nombre ? user.nombre.split(' ')[0] : 'Usuario'}</strong>
              </span>
              
              {/* Si es admin, mostrar botón al panel */}
              {user.rol_id === 1 && (
                <button className="boton_accion_rojo" onClick={() => navegar("/admin")} style={{ padding: '8px 15px', fontSize: '12px', background: '#1e293b' }}>PANEL ADMIN</button>
              )}
              
              <button className="boton_accion_rojo" onClick={() => navegar("/perfil")} style={{ padding: '8px 15px', fontSize: '12px' }}>MI PERFIL</button>
              <button className="boton_cerrar_sesion" onClick={handleCerrarSesion}>CERRAR SESIÓN</button>
            </>
          ) : (
            <button className="boton_accion_blanco" onClick={() => navegar("/login")}>INICIAR SESIÓN</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

