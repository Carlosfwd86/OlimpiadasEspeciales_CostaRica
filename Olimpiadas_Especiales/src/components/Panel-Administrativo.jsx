import React, { useState, useEffect } from 'react';
import '../style/AdminDashboard.css';

// Importaremos los subcomponentes conforme los vayamos creando
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import StatCard from './StatCard';
import ChartSection from './ChartSection';
import PendingTable from './PendingTable';
import ActivityFeed from './ActivityFeed';
import ModalNuevoRegistro from './ModalNuevoRegistro';

export default function PanelAdministrativo() {
  const [stats, setStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editData, setEditData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/estadisticas_generales')
      .then(response => response.json())
      .then(data => setStats(data))
      .catch(error => console.error("Error al cargar estadísticas:", error));
  }, []);

  const handleExport = () => alert("Exportando datos a CSV/PDF...");
  
  const handleNewEntry = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEditEntry = (reg) => {
    setEditData(reg);
    setIsModalOpen(true);
  };

  const handleSaveSuccess = () => setRefreshTrigger(prev => prev + 1);

  return (
    <div className="admin-dashboard-layout">
      <Sidebar />
      <main className="admin-main-content">
        <Topbar onSearch={(q) => setSearchQuery(q)} />
        
        <div className="admin-dashboard-body">
          <div className="dashboard-header">
            <div>
              <h1>Panel Administrativo</h1>
              <p>Resumen en tiempo real de las actividades de Olimpiadas Especiales Costa Rica.</p>
            </div>
            <div className="header-actions">
              <button className="btn-export" onClick={handleExport}>
                <i className="fa-solid fa-download"></i> Exportar
              </button>
              <button className="btn-new-entry" onClick={handleNewEntry}>+ Nuevo Registro</button>
            </div>
          </div>

          {stats ? (
            <div className="stat-cards-grid">
              <StatCard 
                icon="fa-solid fa-user-plus" 
                iconColor="blue"
                title="Total de Registros" 
                value={stats.totalRegistros.valor} 
                percentage={stats.totalRegistros.porcentaje} 
                trend={stats.totalRegistros.tendencia} 
              />
              <StatCard 
                icon="fa-solid fa-dumbbell" 
                iconColor="red"
                title="Atletas Activos" 
                value={stats.atletasActivos.valor} 
                percentage={stats.atletasActivos.porcentaje} 
                trend={stats.atletasActivos.tendencia} 
              />
              <StatCard 
                icon="fa-solid fa-clipboard-list" 
                iconColor="yellow"
                title="Revisiones Pendientes" 
                value={stats.revisionesPendientes.valor} 
                text={stats.revisionesPendientes.textoExtra} 
              />
              <StatCard 
                icon="fa-solid fa-users" 
                iconColor="purple"
                title="Voluntarios" 
                value={stats.voluntarios.valor} 
                percentage={stats.voluntarios.porcentaje} 
                trend={stats.voluntarios.tendencia} 
              />
            </div>
          ) : (
            <div className="stat-cards-grid"><p>Cargando estadísticas...</p></div>
          )}

          <ChartSection />
          <PendingTable refreshTrigger={refreshTrigger} onEdit={handleEditEntry} searchQuery={searchQuery} />
          <ActivityFeed />
        </div>
      </main>

      {/* Modal para ingresar nuevos atletas */}
      <ModalNuevoRegistro 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaveSuccess={handleSaveSuccess}
        editData={editData}
      />
    </div>
  );
}
