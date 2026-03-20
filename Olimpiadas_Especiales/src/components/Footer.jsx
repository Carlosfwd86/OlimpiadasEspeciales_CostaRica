import React from 'react';
import '../styles/Footer.css';

const Footer = () => {

  // VERDE: Función para navegar a redes sociales
  const abrirRedSocial = (red) => {
    console.log("Abriendo: " + red);
  };

  // VERDE: Función para ir a secciones legales
  const irAPoliticas = () => {
    console.log("Navegando a políticas de privacidad...");
  };

  return (
    <footer className="footer_principal">
      <div className="footer_contenido">
        
        {/* Sección de Identidad */}
        <div className="footer_info">
          <div className="footer_logo">
            <span className="footer_titulo">OLIMPÍADAS ESPECIALES</span>
            <span className="footer_subtitulo">COSTA RICA</span>
          </div>
          <p className="footer_descripcion">
            Transformando vidas a través del deporte y la inclusión. 
            Únete a nuestra comunidad.
          </p>
        </div>

        {/* Enlaces Rápidos */}
        <div className="footer_enlaces">
          <h4 className="footer_h4">Explorar</h4>
          <ul className="footer_lista">
            <li className="footer_item" onClick={() => abrirRedSocial('Nosotros')}>Nosotros</li>
            <li className="footer_item" onClick={() => abrirRedSocial('Programas')}>Programas</li>
            <li className="footer_item" onClick={() => abrirRedSocial('Noticias')}>Noticias</li>
          </ul>
        </div>

        {/* Redes Sociales */}
        <div className="footer_sociales">
          <h4 className="footer_h4">Síguenos</h4>
          <div className="iconos_contenedor">
            <div className="icono_circulo" onClick={() => abrirRedSocial('Facebook')}>FB</div>
            <div className="icono_circulo" onClick={() => abrirRedSocial('Instagram')}>IG</div>
            <div className="icono_circulo" onClick={() => abrirRedSocial('Twitter')}>TW</div>
          </div>
        </div>
      </div>

      <div className="footer_copyright">
        <p>© 2026 Olimpíadas Especiales Costa Rica - Todos los derechos reservados.</p>
        <span className="link_legal" onClick={irAPoliticas}>Privacidad y Términos</span>
      </div>
    </footer>
  );
};

export default Footer;