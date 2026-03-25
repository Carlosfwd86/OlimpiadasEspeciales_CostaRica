import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Footer.css";
const Footer = () => {
  const navegar = useNavigate();

  // VERDE: Función para navegar a secciones internas
  const irASeccion = (ruta) => {
    navegar(ruta);
    window.scrollTo(0, 0);
  };

  // VERDE: Función para navegar a redes sociales
  const abrirRedSocial = (red) => {
    if (red === 'Facebook') {
      window.open('https://www.facebook.com/OlimpiadasEspecialesCR', '_blank');
    } else if (red === 'Instagram') {
      window.open('http://www.instagram.com/oe_cr', '_blank');
    } else if (red === 'X') {
      window.open('https://x.com/Olimpiadas_CR', '_blank');
    } else {
      console.log("Abriendo: " + red);
    }
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
            <li className="footer_item" onClick={() => irASeccion('/nosotros')}>Nosotros</li>
            <li className="footer_item" onClick={() => irASeccion('/eventos')}>Eventos</li>
            <li className="footer_item" onClick={() => irASeccion('/voluntarios')}>Voluntarios</li>
          </ul>
        </div>

        {/* Redes Sociales */}
        <div className="footer_sociales">
          <h4 className="footer_h4">Síguenos</h4>
          <div className="iconos_contenedor">
            <div className="icono_circulo" onClick={() => abrirRedSocial('Facebook')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"/>
              </svg>
            </div>
            <div className="icono_circulo" onClick={() => abrirRedSocial('Instagram')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            <div className="icono_circulo" onClick={() => abrirRedSocial('X')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
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