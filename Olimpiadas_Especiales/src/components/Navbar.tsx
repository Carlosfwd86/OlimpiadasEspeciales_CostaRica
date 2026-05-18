import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';
import { s3Url } from '../utils/s3';

const Navbar = (): React.JSX.Element => {
  const navegar = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);

  const handleCerrarSesion = async (): Promise<void> => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      await logout();
      navegar("/");
    }
  };

  const toggleMenu = (nombre: string) => {
    setMenuAbierto(prev => (prev === nombre ? null : nombre));
  };

  const itemsNav = [
    { label: 'Inicio', ruta: '/' },
    { label: 'Nosotros', ruta: '/nosotros' },
    { label: 'Involúcrate', ruta: null },
    { label: 'Programas', ruta: null },
    { label: 'Contacto', ruta: '/contacto' },
  ];

  return (
    <nav className="navbar_principal">
      {/* Logo */}
      <div className="navbar_logotipo" onClick={() => navegar("/")}>
        <img src={s3Url('img/Logo Olimpiadas.png')} alt="Logo Olimpiadas Especiales" className="icono_rojo_so" />
      </div>

      {/* Menú central */}
      <ul className="lista_navegacion">
        {itemsNav.map((item) => (
          <li
            key={item.label}
            className={`enlace_nav${item.ruta === null ? ' enlace_nav--dropdown' : ''}`}
            onClick={() => item.ruta ? navegar(item.ruta) : toggleMenu(item.label)}
          >
            {item.label}
            {item.ruta === null && <span className="dropdown_flecha">&#8964;</span>}
            {item.ruta === null && menuAbierto === item.label && (
              <ul className="dropdown_menu">
                <li className="dropdown_item">Próximamente...</li>
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Sección derecha: auth + botón */}
      <div className="navbar_acciones">
        {isAuthenticated && user ? (
          <>
            <span
              className="saludo_usuario"
              onClick={() => navegar("/perfil")}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <i className="fa-solid fa-circle-user" style={{ color: '#E00000' }}></i>
              Hola, <strong>{user.nombre ? user.nombre.split(' ')[0] : 'Usuario'}</strong>
            </span>
            {user.rol_id === 1 && (
              <button className="boton_accion_rojo" onClick={() => navegar("/admin")} style={{ padding: '8px 15px', fontSize: '12px', background: '#1e293b' }}>
                PANEL ADMIN
              </button>
            )}
            <button className="boton_accion_rojo" onClick={() => navegar("/perfil")} style={{ padding: '8px 15px', fontSize: '12px' }}>
              MI PERFIL
            </button>
            <button className="boton_cerrar_sesion" onClick={handleCerrarSesion}>CERRAR SESIÓN</button>
          </>
        ) : (
          <button className="boton_registrate" onClick={() => navegar("/plataforma-registro")}>
            REGÍSTRATE
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
