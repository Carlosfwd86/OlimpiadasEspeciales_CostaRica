import React from 'react';
import '../../style/Sidebar.css';
import logoUrl from '../../img/Logo Olimpiadas.png';

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <img 
          src={logoUrl} 
          alt="Special Olympics Logo" 
          className="logo-img" 
        />
      </div>

      <div className="sidebar-menu-section">
        <h4 className="sidebar-heading">MENÚ PRINCIPAL</h4>
        <ul className="sidebar-nav">
          <li 
            className={`nav-item ${activeTab === 'resumen' ? 'active' : ''}`}
            onClick={() => onTabChange('resumen')}
          >
            <i className="fa-solid fa-border-all nav-icon"></i>
            Resumen
          </li>
          <li 
            className={`nav-item ${activeTab === 'registros' ? 'active' : ''}`}
            onClick={() => onTabChange('registros')}
          >
            <i className="fa-solid fa-list-check nav-icon"></i>
            Registros
          </li>
          <li 
            className={`nav-item ${activeTab === 'atletas' ? 'active' : ''}`}
            onClick={() => onTabChange('atletas')}
          >
            <i className="fa-solid fa-users nav-icon"></i>
            Directorio Oficial
          </li>
          <li 
            className={`nav-item ${activeTab === 'competiciones' ? 'active' : ''}`}
            onClick={() => onTabChange('competiciones')}
          >
            <i className="fa-solid fa-trophy nav-icon"></i>
            Competiciones y Eventos
          </li>
          <li 
            className={`nav-item ${activeTab === 'consultas' ? 'active' : ''}`}
            onClick={() => onTabChange('consultas')}
          >
            <i className="fa-solid fa-envelope-open-text nav-icon"></i>
            Mensajes
          </li>
        </ul>
      </div>

      <div className="sidebar-menu-section" style={{ marginTop: '20px' }}>
        <h4 className="sidebar-heading">ANALÍTICA Y DATOS</h4>
        <ul className="sidebar-nav">
          <li 
            className={`nav-item ${activeTab === 'rendimiento' ? 'active' : ''}`}
            onClick={() => onTabChange('rendimiento')}
          >
            <i className="fa-solid fa-chart-line nav-icon"></i>
            Rendimiento
          </li>
          <li 
            className={`nav-item ${activeTab === 'regiones' ? 'active' : ''}`}
            onClick={() => onTabChange('regiones')}
          >
            <i className="fa-solid fa-location-dot nav-icon"></i>
            Regiones
          </li>
          <li 
            className={`nav-item ${activeTab === 'bitacora' ? 'active' : ''}`}
            onClick={() => onTabChange('bitacora')}
          >
            <i className="fa-solid fa-clock-rotate-left nav-icon"></i>
            Bitácora
          </li>
          <li 
            className={`nav-item ${activeTab === 'reportes' ? 'active' : ''}`}
            onClick={() => onTabChange('reportes')}
          >
            <i className="fa-solid fa-file-lines nav-icon"></i>
            Reportes
          </li>
        </ul>
      </div>



    </aside>

  );
}
