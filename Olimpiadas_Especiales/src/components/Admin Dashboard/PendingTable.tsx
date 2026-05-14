import React, { useState, useEffect } from 'react';
import '../../style/PendingTable.css';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import ModalDetalleRegistro from './ModalDetalleRegistro';
import type { Registro } from '../../types';

interface PendingTableProps {
  refreshTrigger?: number;
  onEdit: (reg: Registro) => void;
  searchQuery?: string;
  onActionSuccess?: () => void;
}

export default function PendingTable({ refreshTrigger = 0, onEdit, searchQuery = '', onActionSuccess }: PendingTableProps): React.JSX.Element {
  const [registrations, setRegistrations] = useState<Registro[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filterSport, setFilterSport] = useState<string>('');
  const [filterRegion, setFilterRegion] = useState<string>('');
  const [selectedReg, setSelectedReg] = useState<Registro | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [localSearch, setLocalSearch] = useState<string>('');

  const fetchRegistrations = (): void => {
    ServicesAdmin.getRegistrations()
      .then(data => {
        setRegistrations(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar los registros:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRegistrations();
  }, [refreshTrigger]);

  const handleApprove = (reg: Registro): void => {
    // ... existing logic
    if (!window.confirm(`¿Seguro que deseas APROBAR a ${String(reg.name ?? '')}? Pasará a la base de datos oficial.`)) return;

    setProcessingId(reg.id);
    ServicesAdmin.aprobarRegistro(reg)
      .then(() => {
        alert("¡Registro aprobado y guardado en la base de datos oficial!");
        ServicesAdmin.logActivity("Aprobación", `Se aprobó a ${String(reg.name ?? '')}`, "fa-solid fa-check-circle", "green");
        if (onActionSuccess) onActionSuccess();
        fetchRegistrations();
      })
      .catch(err => {
        console.error("Error al aprobar:", err);
        alert("Error al procesar la aprobación.");
      })
      .finally(() => setProcessingId(null));
  };

  const handleReject = (reg: Registro): void => {
    if (!window.confirm(`¿Seguro que deseas marcar el registro de ${reg.name} como RECHAZADO?`)) return;

    setProcessingId(reg.id);
    ServicesAdmin.rechazarRegistro(reg.id, reg.rol)
      .then(() => {
        ServicesAdmin.logActivity("Rechazo", `Se rechazó a ${reg.name}`, "fa-solid fa-circle-xmark", "red");
        if (onActionSuccess) onActionSuccess();
        fetchRegistrations();
      })
      .catch(err => {
        console.error("Error al rechazar:", err);
        alert("Error al procesar el rechazo.");
      })
      .finally(() => setProcessingId(null));
  };

  const handleDelete = (id: string): void => {
    if (!window.confirm("¿Estás seguro de que deseas ELIMINAR permanentemente este registro?")) return;

    setProcessingId(id);
    ServicesAdmin.deleteRegistro(id)
      .then(() => {
        ServicesAdmin.logActivity("Eliminación", `Se eliminó un registro pendiente`, "fa-solid fa-trash", "red");
        if (onActionSuccess) onActionSuccess();
        fetchRegistrations();
      })
      .catch(err => console.error("Error al eliminar:", err))
      .finally(() => setProcessingId(null));
  };

  if (loading) {
    return (
      <div className="pending-table-container">
        <div className="table-header"><h3>Registros Pendientes</h3></div>
        <div className="loading-state" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '24px', marginBottom: '10px', display: 'block' }}></i>
          Cargando registros...
        </div>
      </div>
    );
  }

  const filteredRegs = registrations.filter(reg => {
    const q = (localSearch || searchQuery).toLowerCase();
    const name = String(reg.name ?? '').toLowerCase();
    const email = String(reg.email ?? '').toLowerCase();
    
    const matchesSearch = !q || name.includes(q) || email.includes(q);
    const matchesSport = !filterSport || reg.sport === filterSport;
    const matchesRegion = !filterRegion || reg.region === filterRegion;

    return matchesSearch && matchesSport && matchesRegion;
  });

  return (
    <div className="pending-table-container">
      <div className="table-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h3 style={{ margin: 0 }}>Registros Pendientes</h3>
          <div style={{ position: 'relative' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '13px' }}></i>
            <input 
              type="text" 
              placeholder="Buscar registros..." 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              style={{ padding: '8px 12px 8px 35px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', width: '220px', background: 'var(--admin-white)', color: 'var(--admin-text-main)' }}
            />
          </div>
        </div>
        <div className="table-filters" style={{ display: 'flex', gap: '10px' }}>
          <select
            className="filter-select"
            value={filterSport}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterSport(e.target.value)}
            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
          >
            <option value="">Todos los Deportes</option>
            <option value="Fútbol">Fútbol</option>
            <option value="Natación">Natación</option>
            <option value="Atletismo">Atletismo</option>
            <option value="Bochas">Bochas</option>
            <option value="Baloncesto">Baloncesto</option>
          </select>
          <select
            className="filter-select"
            value={filterRegion}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterRegion(e.target.value)}
            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
          >
            <option value="">Todas las Regiones</option>
            <option value="San José">San José</option>
            <option value="Alajuela">Alajuela</option>
            <option value="Cartago">Cartago</option>
            <option value="Heredia">Heredia</option>
            <option value="Guanacaste">Guanacaste</option>
            <option value="Puntarenas">Puntarenas</option>
            <option value="Limón">Limón</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="pending-table">
          <thead>
            <tr>
              <th>Atleta/Usuario</th>
              <th>Rol / Deporte</th>
              <th>Región</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegs.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-table-msg" style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ fontSize: '40px', marginBottom: '15px' }}>📋</div>
                  {searchQuery || filterSport || filterRegion ?
                    `No hay resultados para los filtros aplicados.` :
                    "¡Todo al día! No hay registros pendientes por revisar."}
                </td>
              </tr>
            ) : (
              filteredRegs.map((reg) => (
                <tr key={reg.id}>
                  <td>
                    <div className="athlete-info">
                      <div className={`athlete-avatar ${String(reg.bgColor ?? '')}`}>{String(reg.initials ?? '')}</div>
                      <div className="athlete-details">
                        <span className="athlete-name">{String(reg.name ?? '')}</span>
                        <span className="athlete-time">{String(reg.time ?? '')}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>{reg.rol}</span>
                    {reg.sport && <span style={{ fontSize: '13px' }}>{reg.sport}</span>}
                  </td>
                  <td>{String(reg.region ?? '')}</td>
                  <td>
                    <span className={`status-badge status-${String(reg.statusColor ?? '')}`}>
                      {String(reg.status ?? '')}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action edit" title="Ver Detalles"
                        disabled={processingId !== null}
                        onClick={() => { setSelectedReg(reg); setShowDetail(true); }}
                        style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button className="btn-action edit" title="Editar" 
                        disabled={processingId !== null}
                        onClick={() => onEdit(reg)}>
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className="btn-action approve" title="Aprobar" 
                        disabled={processingId !== null}
                        onClick={() => handleApprove(reg)}>
                        {processingId === reg.id ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check"></i>}
                      </button>
                      <button className="btn-action reject" title="Rechazar" 
                        disabled={processingId !== null}
                        onClick={() => handleReject(reg)}>
                        {processingId === reg.id ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-xmark"></i>}
                      </button>
                      <button className="btn-action delete" title="Eliminar" 
                        disabled={processingId !== null}
                        onClick={() => handleDelete(reg.id)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <a href="#" onClick={(e) => e.preventDefault()}>Ver todos</a>
      </div>

      <ModalDetalleRegistro
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        data={selectedReg}
      />
    </div>
  );
}
