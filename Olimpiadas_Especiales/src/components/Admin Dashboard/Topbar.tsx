import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/Topbar.css';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import type { Activity } from '../../types';

interface TopbarProps {
  onSearch?: (query: string) => void;
  onTabChange: (tab: string) => void;
  activeTab?: string;
}

// Map tab IDs to human-readable breadcrumbs
const TAB_LABELS: Record<string, string> = {
  resumen:       'Panel / Resumen',
  registros:     'Panel / Registros Pendientes',
  atletas:       'Panel / Lista de Atletas',
  consultas:     'Panel / Bandeja de Consultas',
  rendimiento:   'Analítica / Rendimiento',
  regiones:      'Analítica / Regiones',
  reportes:      'Analítica / Reportes',
  usuarios_tab:  'Sistema / Usuarios',
  configuracion: 'Sistema / Configuración',
  perfil:        'Sistema / Mi Perfil',
};

export default function Topbar({ onSearch, onTabChange, activeTab = 'resumen' }: TopbarProps): React.JSX.Element {
  const navigate   = useNavigate();
  const { logout, user } = useAuth();
  const [query,         setQuery]         = useState<string>('');
  const [showNotif,     setShowNotif]     = useState<boolean>(false);
  const [showProfile,   setShowProfile]   = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Activity[]>([]);

  useEffect(() => {
    if (showNotif) {
      ServicesAdmin.getActivities()
        .then(data => setNotifications(data.slice(0, 5)))
        .catch(err  => console.error(err));
    }
  }, [showNotif]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleLogout = (): void => {
    setShowProfile(false);
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Se cerrará tu sesión administrativa.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e60000',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    }).then(result => { if (result.isConfirmed) logout(); });
  };

  const breadcrumb = TAB_LABELS[activeTab] ?? 'Panel Administrativo';
  const userName   = (user as any)?.nombre ?? (user as any)?.name ?? 'Administrador';
  const initials   = userName.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();

  return (
    <header className="admin-topbar">
      {/* Breadcrumb — replaces the redundant nav tabs */}
      <div className="topbar-breadcrumb">
        <span className="breadcrumb-icon"><i className="fa-solid fa-border-all" /></span>
        <span className="breadcrumb-path">{breadcrumb}</span>
      </div>

      <div className="topbar-actions">
        {/* Search */}
        <div className="search-container">
          <i className="fa-solid fa-magnifying-glass search-icon" />
          <input
            type="text"
            placeholder="Buscar atletas, sedes, etc..."
            className="search-input"
            value={query}
            onChange={handleSearchChange}
          />
        </div>

        {/* Notifications */}
        <div className="dropdown-container">
          <button
            className="notification-btn"
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            title="Notificaciones"
          >
            <i className="fa-solid fa-bell" />
            {notifications.length > 0 && <span className="notification-badge" />}
          </button>

          {showNotif && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <h4>Actividad Reciente</h4>
                <button
                  style={{ border: 'none', background: 'none', color: '#3b82f6', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => setShowNotif(false)}
                >
                  Cerrar
                </button>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length > 0
                  ? notifications.map((n, idx) => (
                    <div key={n.id ?? idx} className="notification-item">
                      <span className="notif-title">{n.title}</span>
                      <span className="notif-desc">{n.details} · {n.time}</span>
                    </div>
                  ))
                  : <p style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>Sin actividad reciente</p>
                }
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="dropdown-container">
          <div
            className="profile-btn"
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            title={userName}
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div className="profile-avatar-icon">{initials}</div>
            )}
          </div>

          {showProfile && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{userName}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Administrador</p>
                </div>
              </div>
              <button className="dropdown-item" onClick={() => { onTabChange('perfil'); setShowProfile(false); }}>
                <i className="fa-solid fa-circle-user" /> Mi Perfil
              </button>
              <button className="dropdown-item" onClick={() => { navigate('/'); setShowProfile(false); }}>
                <i className="fa-solid fa-house" /> Volver al Sitio
              </button>
              <div style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0' }} />
              <button className="dropdown-item" onClick={handleLogout} style={{ color: '#e60000' }}>
                <i className="fa-solid fa-right-from-bracket" style={{ color: '#e60000' }} /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
