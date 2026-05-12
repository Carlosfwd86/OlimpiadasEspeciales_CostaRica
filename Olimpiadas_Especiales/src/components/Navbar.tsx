import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import type { Usuario } from '../types';

const Navbar = (): React.JSX.Element => {
  const navegar = useNavigate();
  const [usuarioSesion, setUsuarioSesion] = useState<Usuario | null>(null);

  useEffect(() => {
    const sesion = localStorage.getItem('usuarioSesion');
    if (sesion) setUsuarioSesion(JSON.parse(sesion) as Usuario);
    const handle = (): void => {
      const s = localStorage.getItem('usuarioSesion');
      setUsuarioSesion(s ? JSON.parse(s) as Usuario : null);
    };
    window.addEventListener('storage', handle);
    window.addEventListener('sesionActualizada', handle);
    return () => { window.removeEventListener('storage', handle); window.removeEventListener('sesionActualizada', handle); };
  }, []);

  const cerrarSesion = (): void => { localStorage.removeItem('usuarioSesion'); setUsuarioSesion(null); navegar("/"); };

  return (
    <nav className="navbar_principal">
      <div className="navbar_logotipo" onClick={() => navegar("/")}><img src="/img/Logo Olimpiadas.png" alt="Logo Olimpiadas Especiales" className="icono_rojo_so" /></div>
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
          {usuarioSesion ? (
            <>
              <span className="saludo_usuario" onClick={() => navegar("/perfil")} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <i className="fa-solid fa-circle-user" style={{ color: '#E00000' }}></i>
                Hola, <strong>{usuarioSesion.nombre ? String(usuarioSesion.nombre).split(' ')[0] : String(usuarioSesion.cedula ?? '')}</strong>
              </span>
              <button className="boton_accion_rojo" onClick={() => navegar("/perfil")} style={{ padding: '8px 15px', fontSize: '12px' }}>MI PERFIL</button>
              <button className="boton_cerrar_sesion" onClick={cerrarSesion}>CERRAR SESIÓN</button>
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
