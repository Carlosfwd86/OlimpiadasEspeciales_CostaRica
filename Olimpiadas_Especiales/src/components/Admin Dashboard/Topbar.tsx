import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/Topbar.css';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import type { Activity } from '../../types';

interface TopbarProps {
  onSearch?: (query: string) => void;
  onTabChange: (tab: string) => void;
}

export default function Topbar({ onSearch, onTabChange }: TopbarProps): React.JSX.Element {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>('');
  const [showNotif, setShowNotif] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Activity[]>([]);

  useEffect(() => {
    if (showNotif) {
      ServicesAdmin.getActivities()
        .then(data => setNotifications(data.slice(0, 5)))
        .catch(err => console.error(err));
    }
  }, [showNotif]);

  const handleNav = (path: string): void => {
    navigate(path);
    setShowProfile(false);
    setShowNotif(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  return (
    <header className="admin-topbar">
      <nav className="topbar-nav">
        <a href="#" className="topbar-link active" onClick={(e) => { e.preventDefault(); onTabChange('resumen'); }}>Panel</a>
        <a href="#" className="topbar-link" onClick={(e) => { e.preventDefault(); onTabChange('usuarios_tab'); }}>Usuarios</a>
        <a href="#" className="topbar-link" onClick={(e) => { e.preventDefault(); onTabChange('configuracion'); }}>Configuración</a>
      </nav>

      <div className="topbar-actions">
        <div className="search-container">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Buscar atletas, sedes, etc..."
            className="search-input"
            value={query}
            onChange={handleSearchChange}
          />
        </div>

        <div className="dropdown-container">
          <button className="notification-btn" onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}>
            <i className="fa-solid fa-bell"></i>
            <span className="notification-badge"></span>
          </button>

          <button className="notification-btn" title="Ver Sitio Público" onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>
            <i className="fa-solid fa-globe"></i>
          </button>

          {showNotif && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <h4>Notificaciones</h4>
                <button style={{ border: 'none', background: 'none', color: '#3b82f6', fontSize: '11px', cursor: 'pointer' }}>Limpiar</button>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length > 0 ? notifications.map((n, idx) => (
                  <div key={n.id ?? idx} className="notification-item">
                    <span className="notif-title">{n.title}</span>
                    <span className="notif-desc">{n.details} • {n.time}</span>
                  </div>
                )) : <p style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: '#86868b' }}>No tienes notificaciones</p>}
              </div>
            </div>
          )}
        </div>

        <div className="dropdown-container">
          <div className="profile-btn" onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}>
            <div className="profile-avatar-icon">
              <i className="fa-solid fa-user"></i>
            </div>
          </div>

          {showProfile && (
            <div className="dropdown-menu" style={{ width: '200px' }}>
              <div className="dropdown-header">
                <h4 style={{ fontSize: '12px', color: '#86868b' }}>ADMINISTRADOR</h4>
              </div>
              <button className="dropdown-item" onClick={() => onTabChange('perfil')}>
                <i className="fa-solid fa-circle-user"></i> Mi Perfil
              </button>
              <button className="dropdown-item" onClick={() => onTabChange('configuracion')}>
                <i className="fa-solid fa-gear"></i> Configuración
              </button>
              <div style={{ borderTop: '1px solid #f1f3f5', marginTop: '5px', paddingTop: '5px' }}>
                <button className="dropdown-item" style={{ color: '#e62334' }} onClick={() => handleNav('/')}>
                  <i className="fa-solid fa-arrow-right-from-bracket"></i> Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
