import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navegar = useNavigate();
  const [usuarioSesion, setUsuarioSesion] = useState(null);
  const [logoUrl, setLogoUrl] = useState('/img/Logo Olimpiadas.png');

  // 1. Cargar sesión inicial segura
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const sesion = localStorage.getItem('usuarioSesion');
        setUsuarioSesion(sesion ? JSON.parse(sesion) : null);
      } catch (e) {
        console.error("Error interpretando la sesión:", e);
        setUsuarioSesion(null);
      }
    };

    handleStorageChange(); // Ejecutar al inicio

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sesionActualizada', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sesionActualizada', handleStorageChange);
    };
  }, []);

  // 2. Cargar Logo Dinámico
  useEffect(() => {
    fetch('http://localhost:3001/system_settings')
      .then(res => res.json())
      .then(data => {
        if (data?.logo_url) setLogoUrl(data.logo_url);
      })
      .catch(err => console.error("Error cargando logo en Navbar:", err));
  }, []);

  // Funciones de navegación
  const irAlInicio = () => navegar("/");
  const irANosotros = () => navegar("/nosotros");
  const irAEventos = () => navegar("/eventos");
  const irAContacto = () => navegar("/contacto");
  const irALogin = () => navegar("/login");
  const irAPlataformaRegistro = () => navegar("/plataforma-registro");
  const irAPanelAdmin = () => navegar("/admin");
  const irAPerfil = () => navegar("/perfil");

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioSesion');
    setUsuarioSesion(null);
    navegar("/");
  };

  return (
    <nav className="navbar_principal">
      <div className="navbar_logotipo" onClick={irAlInicio}>
        <img src={logoUrl} alt="Logo Olimpiadas Especiales" className="icono_rojo_so" />
      </div>

      <div className="navbar_menu_derecha">
        <ul className="lista_navegacion">
          <li className="enlace_nav" onClick={irAlInicio}>INICIO</li>
          <li className="enlace_nav" onClick={irANosotros}>NOSOTROS</li>
          <li className="enlace_nav" onClick={irAEventos}>EVENTOS</li>
          <li className="enlace_nav" onClick={irAContacto}>CONTÁCTANOS</li>
          <li
            className="enlace_nav"
            onClick={irAPlataformaRegistro}
            style={{
              background: '#FF0000',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: '50px',
              fontWeight: '900',
              letterSpacing: '0.05em',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#cc0000'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FF0000'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            INSCRIBIRSE
          </li>
        </ul>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {usuarioSesion ? (
            /* --- Sesión activa: saludo + botón cerrar sesión --- */
            <>
              <span 
                className="saludo_usuario" 
                onClick={usuarioSesion.rol === 'admin' ? irAPanelAdmin : irAPerfil} 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <i className="fa-solid fa-circle-user" style={{ color: '#E00000' }}></i>
                Hola, <strong>{usuarioSesion.nombre ? usuarioSesion.nombre.split(' ')[0] : 'Admin'}</strong>
              </span>
              <button 
                className="boton_accion_rojo" 
                onClick={usuarioSesion.rol === 'admin' ? irAPanelAdmin : irAPerfil} 
                style={{ padding: '8px 15px', fontSize: '12px' }}
              >
                {usuarioSesion.rol === 'admin' ? 'VER PANEL' : 'MI PERFIL'}
              </button>
              <button className="boton_cerrar_sesion" onClick={cerrarSesion}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: '6px', verticalAlign: 'middle' }}
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                CERRAR SESIÓN
              </button>
            </>
          ) : (
            /* --- Sin sesión: botones de login y registro --- */
            <>
              <button className="boton_accion_blanco" onClick={irALogin}>
                INICIAR SESIÓN
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;