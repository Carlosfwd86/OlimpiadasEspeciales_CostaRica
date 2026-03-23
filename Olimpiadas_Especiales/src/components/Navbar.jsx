import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navegar = useNavigate();
  const [usuarioSesion, setUsuarioSesion] = useState(null);

  // Leer sesión al montar y cada vez que cambie localStorage
  useEffect(() => {
    const sesion = localStorage.getItem('usuarioSesion');
    if (sesion) {
      setUsuarioSesion(JSON.parse(sesion));
    }

    // Escuchar cambios de sesión desde otras pestañas o el mismo componente
    const handleStorageChange = () => {
      const s = localStorage.getItem('usuarioSesion');
      setUsuarioSesion(s ? JSON.parse(s) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sesionActualizada', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sesionActualizada', handleStorageChange);
    };
  }, []);

  // Funciones de navegación
  const irAlInicio = () => navegar("/");
  const irANosotros = () => navegar("/nosotros");
  const irAEventos = () => navegar("/eventos");
  const irAVoluntarios = () => navegar("/voluntarios");
  const irAContacto = () => navegar("/contacto");
  const irALogin = () => navegar("/login");
  const irARegistro = () => console.log("Registro");
  const irAPanelAdmin = () => navegar("/admin");

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioSesion');
    setUsuarioSesion(null);
    navegar("/");
  };

  return (
    <nav className="navbar_principal">
      <div className="navbar_logotipo" onClick={irAlInicio}>
        <div className="icono_rojo_so"></div>
        <div className="textos_logo">
          <span className="nombre_organizacion">OLIMPÍADAS ESPECIALES</span>
          <span className="nombre_pais">COSTA RICA</span>
        </div>
      </div>

      <div className="navbar_menu_derecha">
        <ul className="lista_navegacion">
          <li className="enlace_nav" onClick={irAlInicio}>INICIO</li>
          <li className="enlace_nav" onClick={irANosotros}>NOSOTROS</li>
          <li className="enlace_nav" onClick={irAEventos}>EVENTOS</li>
          <li className="enlace_nav" onClick={irAVoluntarios}>VOLUNTARIOS</li>
          <li className="enlace_nav" onClick={irAContacto}>CONTÁCTANOS</li>
        </ul>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {usuarioSesion ? (
            /* --- Sesión activa: saludo + botón cerrar sesión --- */
            <>
              <span className="saludo_usuario">
                Hola, <strong>{usuarioSesion.cedula}</strong>
              </span>
              <button className="boton_cerrar_sesion" onClick={cerrarSesion}>
                {/* Ícono de salida (SVG inline) */}
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
              <button className="boton_accion_rojo" onClick={irARegistro}>
                REGISTRO
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;