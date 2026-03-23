import React from 'react';
import '../styles/Contacto.css';

const Contacto = () => {
  return (
    <div className="contenedor_contacto_principal">
      {/* --- BANNER SUPERIOR CON IMAGEN --- */}
      <div className="banner_contacto">
        <div className="overlay_banner"></div>
        <h1 className="titulo_contacto">CONTÁCTANOS</h1>
      </div>

      {/* --- TARJETAS DE INFORMACIÓN --- */}
      <div className="contenedor_tarjetas_contacto">
        
        {/* Tarjeta 1: Teléfono */}
        <div className="tarjeta_contacto">
          <div className="circulo_icono">
            {/* SVG Teléfono */}
            <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <h3>Teléfono</h3>
          <p>314 823 3684</p>
        </div>

        {/* Tarjeta 2: Email */}
        <div className="tarjeta_contacto">
          <div className="circulo_icono">
            {/* SVG Carta / Email */}
            <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h3>Email</h3>
          <p>direccion@olimpiadas.org</p> 
        </div>

        {/* Tarjeta 3: Redes Sociales */}
        <div className="tarjeta_contacto">
          <div className="circulo_icono">
            {/* SVG Link / Redes */}
            <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <h3>Redes Sociales</h3>
          <ul className="lista_redes">
            <li>
              <span className="icono_mini_red">f</span> Facebook
            </li>
            <li>
              <span className="icono_mini_red">📷</span> Instagram
            </li>
            <li>
              <span className="icono_mini_red">in</span> LinkedIn
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Contacto;
