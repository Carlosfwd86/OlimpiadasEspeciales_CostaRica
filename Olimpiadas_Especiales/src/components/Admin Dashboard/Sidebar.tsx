import React from 'react';
import { Link } from 'react-router-dom';
import '../../style/Sidebar.css';
import { s3Url } from '../../utils/s3';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps): React.JSX.Element {
  const { logout } = useAuth();

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <img
          src={s3Url('img/Logo Olimpiadas.png')}
          alt="Special Olympics Logo"
          className="logo-img"
        />
        <span className="logo-text"><b>Olimpiadas</b><br/>Especiales<br/><small>Costa Rica</small></span>
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
            Lista de Atletas
          </li>
          <li
            className={`nav-item ${activeTab === 'consultas' ? 'active' : ''}`}
            onClick={() => onTabChange('consultas')}
          >
            <i className="fa-solid fa-envelope nav-icon"></i>
            Bandeja de Consultas
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
            className={`nav-item ${activeTab === 'reportes' ? 'active' : ''}`}
            onClick={() => onTabChange('reportes')}
          >
            <i className="fa-solid fa-file-lines nav-icon"></i>
            Reportes
          </li>
        </ul>
      </div>

      <div className="sidebar-menu-section" style={{ marginTop: '20px' }}>
        <h4 className="sidebar-heading">SISTEMA</h4>
        <ul className="sidebar-nav">
          <li
            className={`nav-item ${activeTab === 'usuarios_tab' ? 'active' : ''}`}
            onClick={() => onTabChange('usuarios_tab')}
          >
            <i className="fa-solid fa-users-gear nav-icon"></i>
            Usuarios
          </li>
          <li
            className={`nav-item ${activeTab === 'configuracion' ? 'active' : ''}`}
            onClick={() => onTabChange('configuracion')}
          >
            <i className="fa-solid fa-gear nav-icon"></i>
            Configuración
          </li>
          <li
            className={`nav-item ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => onTabChange('perfil')}
          >
            <i className="fa-solid fa-circle-user nav-icon"></i>
            Mi Perfil
          </li>
        </ul>
      </div>

      <div className="sidebar-menu-section" style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <h4 className="sidebar-heading">NAVEGACIÓN</h4>
        <ul className="sidebar-nav">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <li className="nav-item" style={{ color: '#3b82f6' }}>
              <i className="fa-solid fa-house nav-icon"></i>
              Volver al Sitio
            </li>
          </Link>
          <li
            className="nav-item"
            onClick={() => {
              Swal.fire({
                title: '¿Seguro que deseas cerrar la sesión administrativa?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#e62334',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                  logout();
                }
              });
            }}
          >
            <i className="fa-solid fa-right-from-bracket nav-icon"></i>
            Cerrar Sesión
          </li>
        </ul>
      </div>

    </aside>
  );
}
