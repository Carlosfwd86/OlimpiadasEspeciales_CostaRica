import React from 'react';
import '../../style/Sidebar.css';
import logoUrl from '../../img/SO_CostaRica-10_logo-removebg-preview.png';

export default function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <img 
          src={logoUrl} 
          alt="Special Olympics Logo" 
          className="logo-img" 
        />
        <span className="logo-text"><b>Olimpiadas</b><br/>Especiales<br/><small>Costa Rica</small></span>
      </div>

      <div className="sidebar-menu-section">
        <h4 className="sidebar-heading">MENÚ PRINCIPAL</h4>
        <ul className="sidebar-nav">
          <li className="nav-item active">
            <i className="fa-solid fa-border-all nav-icon"></i>
            Resumen
          </li>
          <li className="nav-item">
            <i className="fa-solid fa-list-check nav-icon"></i>
            Registros
          </li>
          <li className="nav-item">
            <i className="fa-solid fa-users nav-icon"></i>
            Lista de Atletas
          </li>
          <li className="nav-item">
            <i className="fa-solid fa-trophy nav-icon"></i>
            Competiciones
          </li>
        </ul>
      </div>

      <div className="sidebar-menu-section mt-auto">
        <h4 className="sidebar-heading">ANALÍTICA Y DATOS</h4>
        <ul className="sidebar-nav">
          <li className="nav-item">
            <i className="fa-solid fa-chart-line nav-icon"></i>
            Rendimiento
          </li>
          <li className="nav-item">
            <i className="fa-solid fa-location-dot nav-icon"></i>
            Regiones
          </li>
          <li className="nav-item">
            <i className="fa-solid fa-file-lines nav-icon"></i>
            Reportes
          </li>
        </ul>
      </div>
    </aside>
  );
}
