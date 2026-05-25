import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import '../styles/Navbar.css';
import { s3Url } from '../utils/s3';

const MOBILE_BREAKPOINT = 768;

type SubItem = {
  titulo: string;
  desc: string;
  icon: string;
  ruta: string;
  color: string;
};

type NavItem = {
  label: string;
  ruta: string | null;
  subItems?: SubItem[];
};

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isMobile;
};

const Navbar = (): React.JSX.Element => {
  const navegar = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const isMobile = useIsMobile();

  const cerrarMenuMovil = useCallback(() => {
    setMenuMovilAbierto(false);
    setMenuAbierto(null);
  }, []);

  useEffect(() => {
    if (!isMobile) cerrarMenuMovil();
  }, [isMobile, cerrarMenuMovil]);

  useEffect(() => {
    document.body.style.overflow = menuMovilAbierto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuMovilAbierto]);

  const handleCerrarSesion = async (): Promise<void> => {
    cerrarMenuMovil();
    Swal.fire({
      title: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e62334',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
        navegar('/');
      }
    });
  };

  const toggleMenu = (nombre: string) => {
    setMenuAbierto(prev => (prev === nombre ? null : nombre));
  };

  const navegarSubItem = (sub: SubItem) => {
    if (sub.ruta.startsWith('http')) {
      window.open(sub.ruta, '_blank');
    } else if (sub.ruta.includes('/formulario') && !isAuthenticated) {
      setMenuAbierto(null);
      cerrarMenuMovil();
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
        if (result.isConfirmed) navegar('/login');
      });
      return;
    } else {
      navegar(sub.ruta);
    }
    setMenuAbierto(null);
    cerrarMenuMovil();
  };

  const navegarRuta = (ruta: string) => {
    navegar(ruta);
    cerrarMenuMovil();
  };

  const itemsNav: NavItem[] = [
    { label: 'Inicio', ruta: '/' },
    { label: 'Nosotros', ruta: '/nosotros' },
    {
      label: 'Involúcrate',
      ruta: null,
      subItems: [
        { titulo: 'Conviértete en Atleta', desc: 'El corazón del movimiento: niños y adultos que encuentran alegría.', icon: 'fa-person-running', ruta: '/formulario?rol=atleta', color: 'azul' },
        { titulo: 'Conviértete en Entrenador', desc: 'Sé el mentor que marca la diferencia en nuestros campeones.', icon: 'fa-bullhorn', ruta: '/formulario?rol=entrenador', color: 'rojo' },
        { titulo: 'Conviértete en Voluntario', desc: 'La columna vertebral: apoya en eventos y entrenamientos.', icon: 'fa-handshake-angle', ruta: '/formulario?rol=voluntario', color: 'verde' },
        { titulo: 'Aporta tu Grano de Arena', desc: 'Ayúdanos a construir un mundo más inclusivo con tu donación.', icon: 'fa-hand-holding-heart', ruta: 'https://donaciones.olimpiadasespeciales.org/', color: 'rosa' },
        { titulo: '¿Tienes dudas?', desc: 'Contáctanos para resolver cualquier inquietud antes de empezar.', icon: 'fa-circle-question', ruta: '/contacto', color: 'gris' }
      ]
    },
    { label: 'Programas', ruta: null },
    { label: 'Contacto', ruta: '/contacto' }
  ];

  const irPerfilOAdmin = () => {
    if (user?.rol_id === 1) {
      navegar('/admin');
    } else {
      navegar('/perfil');
    }
    cerrarMenuMovil();
  };

  const renderAccionesAuth = (claseContenedor = 'navbar_acciones', modoDrawer = false) => (
    <div className={claseContenedor}>
      {isAuthenticated && user ? (
        modoDrawer ? (
          <>
            <div className="navbar_usuario_bloque">
              <button type="button" className="saludo_usuario saludo_usuario--drawer" onClick={irPerfilOAdmin}>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Perfil" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <i className="fa-solid fa-circle-user" />
                )}
                <span>Hola, <strong>{user.nombre ? user.nombre.split(' ')[0] : 'Usuario'}</strong></span>
              </button>
              {user.rol_id === 1 && (
                <button
                  type="button"
                  className="boton_usuario_compact boton_usuario_compact--admin"
                  onClick={() => { navegar('/admin'); cerrarMenuMovil(); }}
                >
                  <i className="fa-solid fa-gauge-high" aria-hidden />
                  Panel Admin
                </button>
              )}
              {user.rol_id !== 1 && (
                <button
                  type="button"
                  className="boton_usuario_compact boton_usuario_compact--perfil"
                  onClick={() => { navegar('/perfil'); cerrarMenuMovil(); }}
                >
                  <i className="fa-solid fa-user" aria-hidden />
                  Mi Perfil
                </button>
              )}
            </div>
            <button type="button" className="boton_cerrar_sesion boton_cerrar_sesion--drawer" onClick={handleCerrarSesion}>
              CERRAR SESIÓN
            </button>
          </>
        ) : (
          <>
            <span
              className="saludo_usuario"
              onClick={irPerfilOAdmin}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Perfil" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <i className="fa-solid fa-circle-user" style={{ color: '#E00000' }} />
              )}
              Hola, <strong>{user.nombre ? user.nombre.split(' ')[0] : 'Usuario'}</strong>
            </span>
            {user.rol_id === 1 && (
              <button type="button" className="boton_panel_admin" onClick={() => navegar('/admin')}>
                PANEL ADMIN
              </button>
            )}
            {user.rol_id !== 1 && (
              <button type="button" className="boton_accion_rojo" onClick={() => navegar('/perfil')}>
                MI PERFIL
              </button>
            )}
            <button type="button" className="boton_cerrar_sesion" onClick={handleCerrarSesion}>
              CERRAR SESIÓN
            </button>
          </>
        )
      ) : (
        <button type="button" className="boton_registrate" onClick={() => { navegar('/plataforma-registro'); cerrarMenuMovil(); }}>
          REGÍSTRATE
        </button>
      )}
    </div>
  );

  const renderListaNav = (modoMovil: boolean) => (
    <ul className={`lista_navegacion${modoMovil ? ' lista_navegacion--movil' : ''}`}>
      {itemsNav.map((item) => (
        <li
          key={item.label}
          className={`enlace_nav${item.ruta === null ? ' enlace_nav--dropdown' : ''}${modoMovil ? ' enlace_nav--movil' : ''}`}
          onClick={() => (item.ruta ? navegarRuta(item.ruta) : toggleMenu(item.label))}
        >
          <span className="enlace_nav_label">
            {item.label}
            {item.ruta === null && (
              <span className={`dropdown_flecha${menuAbierto === item.label ? ' dropdown_flecha--abierta' : ''}`}>&#8964;</span>
            )}
          </span>

          {item.label === 'Involúcrate' && menuAbierto === 'Involúcrate' && (
            <ul className={`dropdown_menu premium_dropdown${modoMovil ? ' dropdown_menu--movil' : ''}`}>
              {item.subItems?.map((sub, idx) => (
                <li
                  key={idx}
                  className={`dropdown_item_premium item--${sub.color}`}
                  onClick={(e) => { e.stopPropagation(); navegarSubItem(sub); }}
                >
                  <div className="dropdown_icon_box">
                    <i className={`fa-solid ${sub.icon}`} />
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
            <ul className={`dropdown_menu${modoMovil ? ' dropdown_menu--movil' : ''}`}>
              {item.label === 'Programas' && (
                <li className="dropdown_item" onClick={(e) => { e.stopPropagation(); navegarRuta('/programas'); }}>
                  Ver Programas
                </li>
              )}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <nav className={`navbar_principal${isMobile ? ' navbar_principal--movil' : ''}`}>
        <div className="navbar_logotipo" onClick={() => navegar('/')}>
          <img src={s3Url('img/Logo Olimpiadas.png')} alt="Logo Olimpiadas Especiales" className="icono_rojo_so" />
        </div>

        {!isMobile && (
          <>
            {renderListaNav(false)}
            {renderAccionesAuth()}
          </>
        )}

        {isMobile && (
          <button
            type="button"
            className="navbar_hamburguesa"
            aria-label={menuMovilAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuMovilAbierto}
            onClick={() => setMenuMovilAbierto(prev => !prev)}
          >
            <span className={`hamburguesa_linea${menuMovilAbierto ? ' hamburguesa_linea--arriba' : ''}`} />
            <span className={`hamburguesa_linea${menuMovilAbierto ? ' hamburguesa_linea--medio' : ''}`} />
            <span className={`hamburguesa_linea${menuMovilAbierto ? ' hamburguesa_linea--abajo' : ''}`} />
          </button>
        )}
      </nav>

      {isMobile && (
        <>
          <div
            className={`navbar_overlay${menuMovilAbierto ? ' navbar_overlay--visible' : ''}`}
            onClick={cerrarMenuMovil}
            aria-hidden={!menuMovilAbierto}
          />
          <aside
            className={`navbar_drawer${menuMovilAbierto ? ' navbar_drawer--abierto' : ''}`}
            aria-hidden={!menuMovilAbierto}
          >
            <div className="navbar_drawer_header">
              <span className="navbar_drawer_titulo">Menú</span>
              <button
                type="button"
                className="navbar_drawer_cerrar"
                aria-label="Cerrar menú"
                onClick={cerrarMenuMovil}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="navbar_drawer_contenido">
              {renderListaNav(true)}
              {renderAccionesAuth('navbar_acciones navbar_acciones--drawer', true)}
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Navbar;
