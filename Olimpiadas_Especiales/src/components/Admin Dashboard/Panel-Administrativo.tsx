import React, { useState, useEffect } from 'react';
import '../../style/AdminDashboard.css';

// URL base del backend real (configurable por variable de entorno)
const BACKEND_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import StatCard from './StatCard';
import ChartSection from './ChartSection';
import PendingTable from './PendingTable';
import ActivityFeed from './ActivityFeed';
import ModalNuevoRegistro from './ModalNuevoRegistro';
import ModalNuevaCompeticion from './ModalNuevaCompeticion';
import AthleteTable from './AthleteTable';
import ProfileSection from './ProfileSection';
import SettingsSection from './SettingsSection';
import ReportsSection from './ReportsSection';
import RegionalMap from './RegionalMap';
import CompetitionCard from './CompetitionCard';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import type { Stats, Competicion, Registro } from '../../types';

interface CompeticionFormData {
  nombre: string;
  deporte: string;
  fecha: string;
  fechaFin: string;
  ubicacion: string;
  descripcion: string;
  estado: string;
  imagen: string;
  enlace: string;
  [key: string]: unknown;
}

export default function PanelAdministrativo(): React.JSX.Element {
  const [stats, setStats] = useState<Stats | null>(null);
  const [competiciones, setCompeticiones] = useState<Competicion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCompModalOpen, setIsCompModalOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [editData, setEditData] = useState<Registro | Competicion | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('resumen');
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    ServicesAdmin.getStats()
      .then(data => setStats(data))
      .catch(error => console.error("Error al cargar estadísticas:", error));

    ServicesAdmin.getCompeticiones()
      .then(data => setCompeticiones(data))
      .catch(err => console.error("Error al cargar competiciones:", err));

    ServicesAdmin.getSettings()
      .then(data => { if (data.tema) setTheme(String(data.tema)); })
      .catch(err => console.error("Error al cargar tema:", err));
  }, [refreshTrigger]);

  const handleExport = (): void => {
    fetch(`${BACKEND_URL}/registros-pendientes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` }
      })
      .then(res => res.json())
      .then((data: Array<Record<string, unknown>>) => {
        if (data.length === 0) { alert("No hay datos para exportar."); return; }
        const headers = "ID,Nombre,Email,Telefono,Deporte,Region,Estado\n";
        const csvContent = data.map(r =>
          `${String(r.id)},"${String(r.name ?? '')}","${String(r.email ?? '')}","${String(r.phone ?? '')}","${String(r.sport ?? '')}","${String(r.region ?? '')}","${String(r.status ?? '')}"`
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
        <Topbar onSearch={(q) => setSearchQuery(q)} onTabChange={setActiveTab} />

        <div className="admin-dashboard-body">
          <div className="dashboard-header">
            <div>
              <h1 style={{ textTransform: 'capitalize' }}>{activeTab === 'resumen' ? 'Panel Administrativo' : activeTab}</h1>
              <p>{activeTab === 'resumen' ? 'Resumen en tiempo real de las actividades de Olimpiadas Especiales Costa Rica.' : `Gestión de la sección de ${activeTab}.`}</p>
            </div>
            <div className="header-actions">
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
              <ActivityFeed />
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
              <AthleteTable refreshTrigger={refreshTrigger} />
            </div>
          )}

          {/* TAB: COMPETICIONES */}
          {activeTab === 'competiciones' && (
            <div className="tab-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                  <h3 style={{ color: 'var(--admin-text-main)', margin: '0' }}>Gestión de Competiciones y Eventos</h3>
                  <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', margin: '5px 0 0' }}>Organiza y supervisa los próximos eventos deportivos.</p>
                </div>
                <button className="btn-new-entry" onClick={() => { setEditData(null); setIsCompModalOpen(true); }}>
                  + Nuevo Evento / Competición
                </button>
              </div>

              {competiciones.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {competiciones.map(comp => (
                    <CompetitionCard key={comp.id} competition={comp}
                      onEdit={(c) => { setEditData(c); setIsCompModalOpen(true); }}
                      onDelete={(id) => {
                        if (window.confirm("¿Estás seguro de eliminar este evento o competición?")) {
                          ServicesAdmin.deleteCompeticion(id)
                            .then(() => handleSaveSuccess())
                            .catch(err => alert((err as Error).message));
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ padding: '60px', background: 'white', borderRadius: '15px', textAlign: 'center', border: '2px dashed #e2e8f0' }}>
                  <div style={{ fontSize: '60px', color: '#cbd5e1', marginBottom: '20px' }}>
                    <i className="fa-solid fa-calendar-plus"></i>
                  </div>
                  <h3 style={{ color: '#64748b' }}>No hay competiciones o eventos programados</h3>
                  <p style={{ color: '#94a3b8' }}>Comienza creando tu primer evento deportivo nacional.</p>
                  <button className="btn-new-entry" style={{ marginTop: '20px' }} onClick={() => setIsCompModalOpen(true)}>
                    + Crear Evento
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: RENDIMIENTO */}
          {activeTab === 'rendimiento' && (
            <div className="tab-container">
              <ChartSection onTabChange={setActiveTab} />
              <ActivityFeed />
            </div>
          )}

          {/* TAB: REGIONES */}
          {activeTab === 'regiones' && (
            <div className="tab-container" style={{ padding: '20px' }}>
              <RegionalMap />
            </div>
          )}

          {activeTab === 'reportes' && <ReportsSection />}
          {activeTab === 'perfil' && <ProfileSection />}
          {activeTab === 'usuarios_tab' && <SettingsSection onThemeChange={setTheme} initialSubTab="usuarios" />}
          {activeTab === 'configuracion' && <SettingsSection onThemeChange={setTheme} initialSubTab="configuracion" />}
        </div>
      </main>

      <ModalNuevoRegistro
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveSuccess={handleSaveSuccess}
        editData={editData as Registro | null}
      />

      <ModalNuevaCompeticion
        isOpen={isCompModalOpen}
        onClose={() => setIsCompModalOpen(false)}
        editData={editData as Competicion | null}
        onSave={(data, id) => {
          ServicesAdmin.saveCompeticion(data, id ?? null)
            .then(() => {
              ServicesAdmin.logActivity("Competición", `${id ? 'Edición' : 'Nueva'} competición: ${data.nombre}`, "fa-solid fa-trophy", "yellow");
              handleSaveSuccess();
            })
            .catch(err => alert("Error al guardar: " + (err as Error).message));
        }}
      />
    </div>
  );
}
