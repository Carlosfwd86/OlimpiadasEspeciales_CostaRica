import React from 'react';
import "../styles/Navbar.css"

const Navbar = () => {

  // VERDE: Funciones de navegación con nombres en español
  const irAlInicio = () => console.log("Inicio");
  const irANosotros = () => console.log("Nosotros");
  const irAEventos = () => console.log("Eventos");
  const irAVoluntarios = () => console.log("Voluntarios");
  const irAContacto = () => console.log("Contacto");
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
          <li className="enlace_nav" onClick={irANosotros}>NOSOTROS</li>
          <li className="enlace_nav" onClick={irAEventos}>EVENTOS</li>
          <li className="enlace_nav" onClick={irAVoluntarios}>VOLUNTARIOS</li>
          <li className="enlace_nav" onClick={irAContacto}>CONTACTO</li>
        </ul>
        
        <button className="boton_accion_rojo" onClick={irARegistro}>
          REGISTRO
        </button>
      </div>
    </nav>
  );
};

export default Navbar;