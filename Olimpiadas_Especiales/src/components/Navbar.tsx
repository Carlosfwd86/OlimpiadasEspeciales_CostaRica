import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
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
    { 
      label: 'Involúcrate', 
      ruta: null,
      subItems: [
        { 
          titulo: 'Conviértete en Atleta', 
          desc: 'El corazón del movimiento: niños y adultos que encuentran alegría.',
          icon: 'fa-person-running',
          ruta: '/formulario?rol=atleta',
          color: 'azul'
        },
        { 
          titulo: 'Conviértete en Entrenador', 
          desc: 'Sé el mentor que marca la diferencia en nuestros campeones.',
          icon: 'fa-bullhorn',
          ruta: '/formulario?rol=entrenador',
          color: 'rojo'
        },
        { 
          titulo: 'Conviértete en Voluntario', 
          desc: 'La columna vertebral: apoya en eventos y entrenamientos.',
          icon: 'fa-handshake-angle',
          ruta: '/formulario?rol=voluntario',
          color: 'verde'
        },
        { 
          titulo: 'Aporta tu Grano de Arena', 
          desc: 'Ayúdanos a construir un mundo más inclusivo con tu donación.',
          icon: 'fa-hand-holding-heart',
          ruta: 'https://donaciones.olimpiadasespeciales.org/',
          color: 'rosa'
        },
        { 
          titulo: '¿Tienes dudas?', 
          desc: 'Contáctanos para resolver cualquier inquietud antes de empezar.',
          icon: 'fa-circle-question',
          ruta: '/contacto',
          color: 'gris'
        }
      ]
    },
    { label: 'Programas', ruta: null },
    { label: 'Contacto', ruta: '/contacto' },
  ];

  // Ya no necesitamos el estado del modal de donar

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
            
            {item.label === 'Involúcrate' && menuAbierto === 'Involúcrate' && (
              <ul className="dropdown_menu premium_dropdown">
                {item.subItems?.map((sub, idx) => (
                  <li 
                    key={idx} 
                    className={`dropdown_item_premium item--${sub.color}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (sub.ruta.startsWith('http')) {
                        window.open(sub.ruta, '_blank');
                      } else if (sub.ruta.includes('/formulario') && !isAuthenticated) {
                        setMenuAbierto(null);
                        Swal.fire({
                          title: 'No has iniciado sesión',
                          text: 'Debes de iniciar sesión o crear una cuenta para poder acceder a los formularios',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#FF0000',
                          cancelButtonColor: '#6c757d',
                          confirmButtonText: 'Iniciar sesión',
                          cancelButtonText: 'Cancelar'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            navegar('/login');
                          }
                        });
                        return;
                      } else {
                        navegar(sub.ruta);
                      }
                      setMenuAbierto(null);
                    }}
                  >
                    <div className="dropdown_icon_box">
                      <i className={`fa-solid ${sub.icon}`}></i>
                    </div>
                    <div className="dropdown_text_box">
                      <span className="dropdown_titulo_item">{sub.titulo}</span>
                      <span className="dropdown_desc_item">{sub.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {item.label !== 'Involúcrate' && item.ruta === null && menuAbierto === item.label && (
              <ul className="dropdown_menu">
                {item.label === 'Programas' && (
                  <li className="dropdown_item" onClick={(e) => { e.stopPropagation(); navegar('/programas'); setMenuAbierto(null); }}>
                    Ver Programas
                  </li>
                )}
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
