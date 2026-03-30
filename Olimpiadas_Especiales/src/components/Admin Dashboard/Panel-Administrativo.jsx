import React, { useState, useEffect } from 'react';
import '../../style/AdminDashboard.css';

// Importaremos los subcomponentes conforme los vayamos creando
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
import ConsultasSection from './ConsultasSection';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import Swal from 'sweetalert2';

export default function PanelAdministrativo() {
  const [stats, setStats] = useState(null);
  const [competiciones, setCompeticiones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editData, setEditData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('resumen');
  const [settingsSubTab, setSettingsSubTab] = useState('usuarios');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Cargar estadísticas
    ServicesAdmin.getStats()
      .then(data => setStats(data))
      .catch(error => console.error("Error al cargar estadísticas:", error));

    // Cargar competiciones
    ServicesAdmin.getCompeticiones()
      .then(data => setCompeticiones(data))
      .catch(err => console.error("Error al cargar competiciones:", err));

    // Cargar configuración de tema
    ServicesAdmin.getSettings()
      .then(data => setTheme(data.tema))
      .catch(err => console.error("Error al cargar tema:", err));
  }, [refreshTrigger]);

  const handleExport = () => {
    // Obtener los datos actuales de la tabla (usando los registros que ya tenemos)
    // En una app real, traeríamos todos los registros del backend
    fetch('http://localhost:3001/registros_pendientes')
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin datos',
            text: 'No hay registros pendientes para exportar en este momento.',
            confirmButtonColor: '#3b82f6'
          });
          return;
        }
        Swal.fire({
            title: 'Generando Reporte...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        const headers = "ID,Nombre,Email,Telefono,Deporte/Rol,Region,Estado\n";
        const csvContent = data.map(r => 
          `${r.id},"${r.name}","${r.email || ''}","${r.phone || ''}","${r.sport || r.rol}","${r.region}","${r.status}"`
        ).join("\n");
        
        const blob = new Blob(["\ufeff" + headers + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `reporte_pendientes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        Swal.close();
        Swal.fire({
            icon: 'success',
            title: '¡Exportado!',
            text: 'El reporte CSV se ha descargado correctamente.',
            timer: 2000,
            showConfirmButton: false
        });
      })
      .catch(err => console.error("Error al exportar:", err));
  };
  
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
              {activeTab === 'registros' && (
                  <button className="btn-new-entry" onClick={handleNewEntry}>+ Nuevo Registro</button>
              )}
            </div>
          </div>

          {activeTab === 'resumen' && (
            <>
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

              <ChartSection onTabChange={setActiveTab} />
              <PendingTable 
                refreshTrigger={refreshTrigger} 
                onEdit={handleEditEntry} 
                searchQuery={searchQuery} 
                onActionSuccess={handleSaveSuccess}
              />
            </>
          )}

          {activeTab === 'registros' && (
            <div className="tab-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
                <PendingTable 
                    refreshTrigger={refreshTrigger} 
                    onEdit={handleEditEntry} 
                    searchQuery={searchQuery} 
                    onActionSuccess={handleSaveSuccess}
                />
            </div>
          )}

          {activeTab === 'atletas' && (
            <div className="tab-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
                <div style={{ padding: '20px', background: 'var(--admin-white)', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: 'var(--admin-text-main)' }}><i className="fa-solid fa-users" style={{ color: '#3b82f6', marginRight: '10px' }}></i> Directorio Oficial de Miembros</h3>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>Listado completo de atletas, voluntarios y entrenadores verificados en el sistema.</p>
                </div>
                <AthleteTable 
                  refreshTrigger={refreshTrigger} 
                  searchQuery={searchQuery}
                  onEdit={handleEditEntry}
                  onActionSuccess={handleSaveSuccess}
                />
            </div>
          )}

          {activeTab === 'competiciones' && (
            <div className="tab-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h3 style={{ color: 'var(--admin-text-main)', margin: '0' }}>Gestión de Competiciones y Eventos</h3>
                        <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', margin: '5px 0 0' }}>Organiza y supervisa los próximos eventos deportivos.</p>
                    </div>
                    <button 
                        className="btn-new-entry" 
                        onClick={() => { setEditData(null); setIsCompModalOpen(true); }}
                    >
                        + Nuevo Evento / Competición
                    </button>
                </div>

                {competiciones.length > 0 ? (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '20px' 
                    }}>
                        {competiciones.map(comp => (
                            <CompetitionCard 
                                key={comp.id} 
                                competition={comp} 
                                onEdit={(c) => { setEditData(c); setIsCompModalOpen(true); }}
                                onDelete={(id) => {
                                    Swal.fire({
                                        title: '¿Eliminar Evento?',
                                        text: "Esta acción no se puede deshacer.",
                                        icon: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#e62334',
                                        cancelButtonColor: '#94a3b8',
                                        confirmButtonText: 'Sí, eliminar',
                                        cancelButtonText: 'Cancelar'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            ServicesAdmin.deleteCompeticion(id)
                                                .then(() => {
                                                    Swal.fire('¡Eliminado!', 'El evento ha sido borrado.', 'success');
                                                    handleSaveSuccess();
                                                })
                                                .catch(err => Swal.fire('Error', err.message, 'error'));
                                        }
                                    });
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
                        <button 
                            className="btn-new-entry" 
                            style={{ marginTop: '20px' }}
                            onClick={() => setIsCompModalOpen(true)}
                        >
                            + Crear Evento
                        </button>
                    </div>
                )}
            </div>
          )}

          {activeTab === 'rendimiento' && (
            <div className="tab-container">
                <ChartSection onTabChange={setActiveTab} />
            </div>
          )}

          {activeTab === 'regiones' && (
            <div className="tab-container" style={{ padding: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ color: 'var(--admin-text-main)' }}><i className="fa-solid fa-map-location-dot" style={{ color: '#ef4444', marginRight: '10px' }}></i> Distribución Geográfica Nacional</h3>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>Visualización interactiva de la presencia de Olimpiadas Especiales en las 7 provincias.</p>
                </div>
                <RegionalMap />
            </div>
          )}
          
          {activeTab === 'bitacora' && (
            <div className="tab-container" style={{ padding: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ color: 'var(--admin-text-main)' }}><i className="fa-solid fa-clock-rotate-left" style={{ color: '#f59e0b', marginRight: '10px' }}></i> Bitácora de Auditoría del Sistema</h3>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>Registro histórico de todas las acciones, cambios y eventos realizados por los administradores.</p>
                </div>
                <ActivityFeed fullWidth={true} />
            </div>
          )}

          {activeTab === 'reportes' && (
            <ReportsSection 
              onEdit={handleEditEntry}
              onActionSuccess={handleSaveSuccess}
              refreshTrigger={refreshTrigger}
            />
          )}

          {activeTab === 'consultas' && (
            <ConsultasSection />
          )}

          {activeTab === 'perfil' && (
            <ProfileSection />
          )}

          {activeTab === 'usuarios_tab' && (
            <SettingsSection onThemeChange={setTheme} initialSubTab="usuarios" />
          )}

          {activeTab === 'configuracion' && (
            <SettingsSection onThemeChange={setTheme} initialSubTab="configuracion" />
          )}
        </div>
      </main>

      <ModalNuevoRegistro 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaveSuccess={handleSaveSuccess}
        editData={editData}
      />

      <ModalNuevaCompeticion 
        isOpen={isCompModalOpen} 
        onClose={() => setIsCompModalOpen(false)} 
        editData={editData}
        onSave={(data, id) => {
            ServicesAdmin.saveCompeticion(data, id)
                .then(() => {
                    ServicesAdmin.logActivity("Competición", `${id ? 'Edición' : 'Nueva'} competición: ${data.nombre}`, "fa-solid fa-trophy", "yellow");
                    handleSaveSuccess();
                })
                .catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Guardado',
                        text: err.message,
                        confirmButtonColor: '#e62334'
                    });
                });
        }}
      />
    </div>
  );
}
