import React from 'react';
import '../styles/Navbar.css';

const Navbar = () => {

  // VERDE: Funciones de navegación con nombres en español
  const irAlInicio = () => console.log("Inicio");
  const irANosotros = () => console.log("Nosotros");
  const irAProgramas = () => console.log("Programas");
  const irASumate = () => console.log("Súmate");
  const irAParticipa = () => console.log("Participa");
  const irARegistrate = () => console.log("Registro");
  const irAHazteSocio = () => console.log("Socio");

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
          <li className="enlace_nav" onClick={irAProgramas}>PROGRAMAS</li>
          <li className="enlace_nav" onClick={irASumate}>SÚMATE</li>
          <li className="enlace_nav" onClick={irAParticipa}>PARTICIPA</li>
          <li className="enlace_nav" onClick={irARegistrate}>REGÍSTRATE</li>
        </ul>
        
        <button className="boton_accion_rojo" onClick={irAHazteSocio}>
          HAZTE SOCIO
        </button>
      </div>
    </nav>
  );
};

export default Navbar;