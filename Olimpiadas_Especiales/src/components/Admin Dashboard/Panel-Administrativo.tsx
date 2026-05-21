import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../../style/AdminDashboard.css';

import Sidebar from './Sidebar';

import Topbar from './Topbar';
import StatCard from './StatCard';
import ChartSection from './ChartSection';
import PendingTable from './PendingTable';
import ActivityFeed from './ActivityFeed';
import ModalNuevoRegistro from './ModalNuevoRegistro';
import AthleteTable from './AthleteTable';
import ProfileSection from './ProfileSection';
import SettingsSection from './SettingsSection';
import ReportsSection from './ReportsSection';
import RegionalMap from './RegionalMap';
import ConsultasSection from './ConsultasSection';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import type { Stats, Registro } from '../../types';

export default function PanelAdministrativo(): React.JSX.Element {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [editData, setEditData] = useState<Registro | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('resumen');
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    ServicesAdmin.getStats()
      .then(data => setStats(data))
      .catch(error => console.error("Error al cargar estadísticas:", error));

    ServicesAdmin.getSettings()
      .then(data => { if (data.tema) setTheme(String(data.tema)); })
      .catch(err => console.error("Error al cargar tema:", err));
  }, [refreshTrigger]);

  const handleExport = (): void => {
    ServicesAdmin.getRegistrations(1, 10000, '')
      .then(response => {
        const registros = response.data;
        if (registros.length === 0) { Swal.fire({ title: 'Atención', text: 'No hay datos para exportar.', icon: 'warning', confirmButtonColor: '#e62334' }); return; }
        const headers = "ID,Nombre,Email,Telefono,Deporte,Region,Estado\n";
        const csvContent = registros.map((r: Registro) =>
          `${String(r.id)},"${String(r.name)}","${String(r.email)}","${String(r.phone ?? '')}","${String(r.sport ?? '')}","${String(r.region ?? '')}","${String(r.status)}"`
        ).join("\n");

        const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `reporte_atletas_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(err => console.error("Error al exportar:", err));
  };



  const handleNewEntry = (): void => { setEditData(null); setIsModalOpen(true); };
  const handleEditEntry = (reg: Registro): void => { setEditData(reg); setIsModalOpen(true); };
  const handleSaveSuccess = (): void => setRefreshTrigger(prev => prev + 1);

  return (
    <div className={`admin-dashboard-layout ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="admin-main-content">
        <Topbar onSearch={(q) => setSearchQuery(q)} onTabChange={setActiveTab} activeTab={activeTab} />

        <div className="admin-dashboard-body">
          <div className="dashboard-header">
            <div>
              <h1 style={{ textTransform: 'capitalize' }}>{activeTab === 'resumen' ? 'Panel Administrativo' : activeTab.replace('_', ' ')}</h1>
              <p>{activeTab === 'resumen' ? 'Resumen en tiempo real de las actividades de Olimpiadas Especiales Costa Rica.' : `Gestión de la sección de ${activeTab.replace('_', ' ')}.`}</p>
            </div>
            <div className="header-actions">
              <button className="btn-export" onClick={() => setRefreshTrigger(prev => prev + 1)} title="Actualizar datos">
                <i className="fa-solid fa-rotate"></i>
              </button>
              <button className="btn-export" onClick={handleExport}>
                <i className="fa-solid fa-download"></i> Exportar
              </button>
              <button className="btn-new-entry" onClick={handleNewEntry}>+ Nuevo Registro</button>
            </div>
          </div>

          {/* TAB: RESUMEN */}
          {activeTab === 'resumen' && (
            <>
              {stats ? (
                <div className="stat-cards-grid">
                  <StatCard icon="fa-solid fa-user-plus" iconColor="blue" title="Total de Registros"
                    value={stats.totalRegistros.valor} percentage={stats.totalRegistros.porcentaje} trend={stats.totalRegistros.tendencia} />
                  <StatCard icon="fa-solid fa-dumbbell" iconColor="red" title="Atletas Activos"
                    value={stats.atletasActivos.valor} percentage={stats.atletasActivos.porcentaje} trend={stats.atletasActivos.tendencia} />
                  <StatCard icon="fa-solid fa-clipboard-list" iconColor="yellow" title="Revisiones Pendientes"
                    value={stats.revisionesPendientes.valor} text={stats.revisionesPendientes.textoExtra} />
                  <StatCard icon="fa-solid fa-users" iconColor="purple" title="Voluntarios"
                    value={stats.voluntarios.valor} percentage={stats.voluntarios.porcentaje} trend={stats.voluntarios.tendencia} />
                </div>
              ) : (
                <div className="stat-cards-grid"><p>Cargando estadísticas...</p></div>
              )}
              <ChartSection onTabChange={setActiveTab} />
              <PendingTable refreshTrigger={refreshTrigger} onEdit={handleEditEntry} searchQuery={searchQuery} onActionSuccess={handleSaveSuccess} />
              <ActivityFeed searchQuery={searchQuery} />
            </>
          )}

          {/* TAB: REGISTROS */}
          {activeTab === 'registros' && (
            <div className="tab-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <PendingTable refreshTrigger={refreshTrigger} onEdit={handleEditEntry} searchQuery={searchQuery} onActionSuccess={handleSaveSuccess} />
            </div>
          )}

          {/* TAB: ATLETAS */}
          {activeTab === 'atletas' && (
            <div className="tab-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <div style={{ padding: '20px', background: 'var(--admin-white)', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: 'var(--admin-text-main)' }}><i className="fa-solid fa-users" style={{ color: '#3b82f6', marginRight: '10px' }}></i> Base de Datos Oficial de Atletas</h3>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>Listado completo de atletas verificados en el sistema.</p>
              </div>
              <AthleteTable refreshTrigger={refreshTrigger} searchQuery={searchQuery} />
            </div>
          )}


          {/* TAB: RENDIMIENTO */}
          {activeTab === 'rendimiento' && (
            <div className="tab-container">
              <ChartSection onTabChange={setActiveTab} />
              <ActivityFeed searchQuery={searchQuery} />
            </div>
          )}

          {/* TAB: REGIONES */}
          {activeTab === 'regiones' && (
            <div className="tab-container" style={{ padding: '20px' }}>
              <RegionalMap />
            </div>
          )}
          
          {activeTab === 'consultas' && <ConsultasSection searchQuery={searchQuery} />}

          {activeTab === 'reportes'      && <ReportsSection searchQuery={searchQuery} />}
          {activeTab === 'usuarios_tab'  && <SettingsSection onThemeChange={setTheme} view="usuarios"      searchQuery={searchQuery} />}
          {activeTab === 'configuracion' && <SettingsSection onThemeChange={setTheme} view="configuracion" searchQuery={searchQuery} />}
          {activeTab === 'perfil'        && <SettingsSection onThemeChange={setTheme} view="perfil"        searchQuery={searchQuery} />}
        </div>
      </main>

      <ModalNuevoRegistro
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveSuccess={handleSaveSuccess}
        editData={editData as Registro | null}
      />


    </div>
  );
}
