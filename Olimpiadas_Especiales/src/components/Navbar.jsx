import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navegar = useNavigate();

  // VERDE: Funciones de navegación con nombres en español
  const irAlInicio = () => navegar("/");
  const irANosotros = () => navegar("/nosotros");
  const irAEventos = () => navegar("/eventos");
  const irAVoluntarios = () => navegar("/voluntarios");
  const irAContacto = () => navegar("/contacto");
  const irALogin = () => navegar("/login");
  const irARegistro = () => console.log("Registro");
  
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
        
        <div style={{ display: 'flex', gap: '10px' }}>
              <button className="boton_accion_blanco" onClick={irALogin}>
                INICIAR SESIÓN
              </button>
              <button className="boton_accion_rojo" onClick={irARegistro}>
                REGISTRO
              </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;