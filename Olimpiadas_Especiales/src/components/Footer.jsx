import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Footer.css";

const Footer = () => {
  const navegar = useNavigate();

  const irASeccion = (ruta) => {
    navegar(ruta);
    window.scrollTo(0, 0);
  };

  const abrirRedSocial = (red) => {
    const urls = {
      Facebook: 'https://www.facebook.com/OlimpiadasEspecialesCR',
      Instagram: 'http://www.instagram.com/oe_cr',
      X: 'https://x.com/Olimpiadas_CR',
      YouTube: 'https://www.youtube.com/@OlimpiadasEspeciales',
      LinkedIn: 'https://www.linkedin.com/company/special-olympics-latin-america'
    };
    if (urls[red]) {
      window.open(urls[red], '_blank');
    }
  };

  return (
    <footer className="footer_principal">
      <div className="footer_top">
        <div className="footer_logo_section">
          <img 
            src="/img/Logo Olimpiadas.png" 
            alt="Logo Olimpiadas Especiales" 
            className="footer_logo_img" 
            onClick={() => irASeccion('/')}
          />
          <p className="footer_tagline">
            Cambiando el juego para las personas con discapacidad intelectual.
          </p>
        </div>
        
        <div className="footer_donar_section">
          <button className="boton_donar_footer" onClick={() => window.open('https://donaciones.olimpiadasespeciales.org/', '_blank')}>
            HAZ UNA DONACIÓN
          </button>
        </div>
      </div>

      <div className="footer_grid">
        <div className="footer_col">
          <h4 className="footer_titulo">NOSOTROS</h4>
          <ul className="footer_links">
            <li onClick={() => irASeccion('/nosotros')}>Nuestra Misión</li>
            <li onClick={() => irASeccion('/nosotros')}>Nuestra Historia</li>
            <li onClick={() => irASeccion('/nosotros')}>Liderazgo</li>
            <li onClick={() => irASeccion('/nosotros')}>Impacto</li>
          </ul>
        </div>

        <div className="footer_col">
          <h4 className="footer_titulo">PROGRAMAS</h4>
          <ul className="footer_links">
            <li>Deportes</li>
            <li>Salud</li>
            <li>Escuelas Unificadas</li>
            <li>Liderazgo de Atletas</li>
          </ul>
        </div>

        <div className="footer_col">
          <h4 className="footer_titulo">INVOLÚCRATE</h4>
          <ul className="footer_links">
            <li>Conviértete en Atleta</li>
            <li>Conviértete en Voluntario</li>
            <li>Conviértete en Entrenador</li>
            <li>Encuentra tu Programa</li>
          </ul>
        </div>

        <div className="footer_col">
          <h4 className="footer_titulo">CONTÁCTANOS</h4>
          <ul className="footer_contact_info">
            <li><i className="email_icon">✉</i> <a href="mailto:info@olimpiadasespeciales.or.cr">info@olimpiadasespeciales.or.cr</a></li>
            <li><i className="phone_icon">✆</i> +506 2222-2222</li>
          </ul>
          <div className="footer_social_icons">
            <div className="social_icon" onClick={() => abrirRedSocial('Facebook')} title="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"/></svg>
            </div>
            <div className="social_icon" onClick={() => abrirRedSocial('Instagram')} title="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </div>
            <div className="social_icon" onClick={() => abrirRedSocial('X')} title="X">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </div>
            <div className="social_icon" onClick={() => abrirRedSocial('YouTube')} title="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="footer_bottom">
        <div className="footer_copyright">
          <p>© 2026 Olimpiadas Especiales Costa Rica. Todos los derechos reservados.</p>
        </div>
        <div className="footer_legal">
          <span onClick={() => irASeccion('/privacidad')}>Privacidad</span>
          <span onClick={() => irASeccion('/terminos')}>Términos y Condiciones</span>
          <span onClick={() => irASeccion('/contacto')}>Contáctanos</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;