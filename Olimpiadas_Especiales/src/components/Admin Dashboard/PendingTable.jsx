import React, { useState, useEffect } from 'react';
import '../../style/PendingTable.css';

export default function PendingTable({ refreshTrigger = 0, onEdit, searchQuery = '' }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = () => {
    fetch('http://localhost:3001/registros_pendientes')
      .then(response => response.json())
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

  const handleApprove = (id) => {
    if(!window.confirm("¿Seguro que deseas marcar este registro como APROBADO?")) return;
    
    fetch(`http://localhost:3001/registros_pendientes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'APROBADO',
        statusColor: 'green',
        bgColor: 'bg-light-green'
      })
    })
    .then(() => fetchRegistrations())
    .catch(err => console.error("Error al aprobar:", err));
  };

  if (loading) {
    return (
      <div className="pending-table-container">
        <div className="table-header">
          <h3>Registros Pendientes</h3>
        </div>
        <div className="loading-state">Cargando registros...</div>
      </div>
    );
  }

  const filteredRegs = registrations.filter(reg => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    return (
      reg.name.toLowerCase().includes(term) ||
      reg.sport.toLowerCase().includes(term) ||
      reg.region.toLowerCase().includes(term) ||
      reg.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="pending-table-container">
      <div className="table-header">
        <h3>Registros Pendientes</h3>
        <button className="btn-filter"><i className="fa-solid fa-filter"></i> Filtrar</button>
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
                <td colSpan="5" className="empty-table-msg">
                  {searchQuery ? `No hay resultados para "${searchQuery}"` : "No hay registros pendientes."}
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
                      <button className="btn-action approve" title="Aprobar" onClick={() => handleApprove(reg.id)}>
                        <i className="fa-solid fa-check"></i>
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
