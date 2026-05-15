import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Footer.css";

const Footer = (): React.JSX.Element => {
  const navegar = useNavigate();

  const irASeccion = (ruta: string): void => { navegar(ruta); window.scrollTo(0, 0); };
  const abrirRedSocial = (red: string): void => {
    if (red === 'Facebook') window.open('https://www.facebook.com/OlimpiadasEspecialesCR', '_blank');
    else if (red === 'Instagram') window.open('http://www.instagram.com/oe_cr', '_blank');
    else if (red === 'X') window.open('https://x.com/Olimpiadas_CR', '_blank');
  };

  return (
    <footer className="footer_principal">
      <div className="footer_top">
        <div className="footer_logo_section" onClick={() => irASeccion('/')} style={{ cursor: 'pointer' }}>
          <img src="/img/Logo Olimpiadas.png" alt="Logo Olimpiadas Especiales" className="footer_logo_img" />
          <p className="footer_tagline">Transformando vidas a través del deporte y la inclusión. Únete a nuestra comunidad.</p>
        </div>
        <button className="boton_donar_footer" onClick={() => irASeccion('/contacto')}>Donar Ahora</button>
      </div>

      <div className="footer_grid">
        <div>
          <h4 className="footer_titulo">Explorar</h4>
          <ul className="footer_links">
            <li onClick={() => irASeccion('/nosotros')}>Nosotros</li>
            <li onClick={() => irASeccion('/programas')}>Programas</li>
            <li onClick={() => irASeccion('/eventos')}>Eventos</li>
            <li onClick={() => irASeccion('/entrenadores')}>Entrenadores</li>
          </ul>
        </div>
        
        <div>
          <h4 className="footer_titulo">Participar</h4>
          <ul className="footer_links">
            <li onClick={() => irASeccion('/plataforma-registro')}>Plataforma Registro</li>
            <li onClick={() => irASeccion('/registro')}>Inscribirse</li>
            <li onClick={() => irASeccion('/login')}>Iniciar Sesión</li>
          </ul>
        </div>

        <div>
          <h4 className="footer_titulo">Contacto</h4>
          <ul className="footer_contact_info">
            <li><i className="fa-solid fa-location-dot"></i> San José, Costa Rica</li>
            <li><i className="fa-solid fa-phone"></i> +506 2222-2222</li>
            <li><i className="fa-solid fa-envelope"></i> info@olimpiadasespecialescord.org</li>
          </ul>
        </div>

        <div>
          <h4 className="footer_titulo">Síguenos</h4>
          <div className="footer_social_icons">
            {['Facebook', 'Instagram', 'X'].map(red => (
              <div key={red} className="social_icon" onClick={() => abrirRedSocial(red)}>
                {red === 'Facebook' && <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"/></svg>}
                {red === 'Instagram' && <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>}
                {red === 'X' && <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer_bottom">
        <p>© {new Date().getFullYear()} Olimpíadas Especiales Costa Rica - Todos los derechos reservados.</p>
        <div className="footer_legal">
          <span onClick={() => console.log("Políticas...")}>Privacidad y Términos</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
