import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Topbar.css';

export default function Topbar({ onSearch }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleNav = (path) => {
    navigate(path);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleNotifications = () => {
    alert("Tienes 3 notificaciones nuevas (Simulación)");
  };

  return (
    <header className="admin-topbar">
      <nav className="topbar-nav">
        <a href="#" className="topbar-link active" onClick={(e) => { e.preventDefault(); handleNav('/admin'); }}>Panel</a>
        <a href="#" className="topbar-link" onClick={(e) => { e.preventDefault(); handleNav('/usuarios'); }}>Usuarios</a>
        <a href="#" className="topbar-link" onClick={(e) => { e.preventDefault(); handleNav('/configuracion'); }}>Configuración</a>
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

        <button className="notification-btn" onClick={handleNotifications}>
          <i className="fa-solid fa-bell"></i>
          <span className="notification-badge"></span>
        </button>

        <div className="profile-btn" onClick={() => alert("Abriendo menú de perfil...")}>
          <div className="profile-avatar-icon">
            <i className="fa-solid fa-user"></i>
          </div>
        </div>
      </div>
    </header>
  );
}
