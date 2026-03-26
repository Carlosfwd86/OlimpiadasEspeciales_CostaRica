import React, { useState, useEffect } from 'react';
import '../../style/PendingTable.css';
import { ServicesAdmin } from '../../services/ServicesAdmin';

export default function PendingTable({ refreshTrigger = 0, onEdit, searchQuery = '', onActionSuccess }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSport, setFilterSport] = useState('');
  const [filterRegion, setFilterRegion] = useState('');

  const fetchRegistrations = () => {
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

  const handleApprove = (reg) => {
    if(!window.confirm(`¿Seguro que deseas APROBAR a ${reg.name}? Pasará a la base de datos oficial.`)) return;
    
    ServicesAdmin.aprobarRegistro(reg)
      .then(() => {
        alert("¡Atleta aprobado y guardado en la base de datos oficial!");
        ServicesAdmin.logActivity("Aprobación", `Se aprobó a ${reg.name}`, "fa-solid fa-check-circle", "green");
        if (onActionSuccess) onActionSuccess();
        fetchRegistrations();
      })
      .catch(err => {
        console.error("Error al aprobar:", err);
        alert("Error al procesar la aprobación.");
      });
  };

  const handleReject = (id) => {
    if(!window.confirm("¿Seguro que deseas marcar este registro como RECHAZADO?")) return;
    
    ServicesAdmin.saveRegistro({
        status: 'RECHAZADO',
        statusColor: 'red',
        bgColor: 'bg-light-red'
      }, id)
    .then(() => {
        if (onActionSuccess) onActionSuccess();
        fetchRegistrations();
    })
    .catch(err => console.error("Error al rechazar:", err));
  };

  const handleDelete = (id) => {
    if(!window.confirm("¿Estás seguro de que deseas ELIMINAR permanentemente este registro?")) return;
    
    ServicesAdmin.deleteRegistro(id)
    .then(() => {
        ServicesAdmin.logActivity("Eliminación", `Se eliminó un registro pendiente`, "fa-solid fa-trash", "red");
        if (onActionSuccess) onActionSuccess();
        fetchRegistrations();
    })
    .catch(err => console.error("Error al eliminar:", err));
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
    const matchesSearch = !searchQuery || 
      reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.email && reg.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSport = !filterSport || reg.sport === filterSport;
    const matchesRegion = !filterRegion || reg.region === filterRegion;

    return matchesSearch && matchesSport && matchesRegion;
  });

  return (
    <div className="pending-table-container">
      <div className="table-header">
        <h3>Registros Pendientes</h3>
        <div className="table-filters" style={{ display: 'flex', gap: '10px' }}>
          <select 
            className="filter-select" 
            value={filterSport} 
            onChange={(e) => setFilterSport(e.target.value)}
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
            onChange={(e) => setFilterRegion(e.target.value)}
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
              <th>Atleta</th>
              <th>Deporte</th>
              <th>Región</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegs.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-table-msg" style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
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
                      <div className={`athlete-avatar ${reg.bgColor}`}>{reg.initials}</div>
                      <div className="athlete-details">
                        <span className="athlete-name">{reg.name}</span>
                        <span className="athlete-time">{reg.time}</span>
                      </div>
                    </div>
                  </td>
                  <td>{reg.sport}</td>
                  <td>{reg.region}</td>
                  <td>
                    <span className={`status-badge status-${reg.statusColor}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action edit" title="Editar" onClick={() => onEdit(reg)}>
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className="btn-action approve" title="Aprobar" onClick={() => handleApprove(reg)}>
                        <i className="fa-solid fa-check"></i>
                      </button>
                      <button className="btn-action reject" title="Rechazar" onClick={() => handleReject(reg.id)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                      <button className="btn-action delete" title="Eliminar" onClick={() => handleDelete(reg.id)}>
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
    </div>
  );
}
