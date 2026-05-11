import React, { useState, useEffect } from 'react';
import '../../style/PendingTable.css';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import type { Atleta } from '../../types';

interface AthleteTableProps {
  refreshTrigger?: number;
}

export default function AthleteTable({ refreshTrigger = 0 }: AthleteTableProps): React.JSX.Element {
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    ServicesAdmin.getAtletas()
      .then(data => {
        setAtletas(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar atletas:", error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  if (loading) return <div className="pending-table-container">Cargando lista oficial...</div>;

  return (
    <div className="pending-table-container" style={{ marginTop: '0' }}>
      <div className="table-wrapper">
        <table className="pending-table">
          <thead>
            <tr>
              <th>Atleta</th>
              <th>Contacto</th>
              <th>Deporte / Programa</th>
              <th>Fecha Registro</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {atletas.map(atleta => (
              <tr key={atleta.id}>
                <td>
                  <div className="atleta-info">
                    <div className="atleta-avatar bg-light-blue">
                      {atleta.nombre ? atleta.nombre.substring(0, 2).toUpperCase() : (atleta.name ? atleta.name.substring(0, 2).toUpperCase() : 'AT')}
                    </div>
                    <div>
                      <p className="atleta-name">{atleta.nombre || atleta.name || 'Sin nombre'}</p>
                      <p className="atleta-id">ID: {atleta.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p>{atleta.correoElectronico || atleta.email || 'N/A'}</p>
                  <p className="atleta-phone">{atleta.telefono || atleta.phone || 'N/A'}</p>
                </td>
                <td>
                  <p>{atleta.disciplina || atleta.sport || 'N/A'}</p>
                  <p className="atleta-region">{atleta.programa || atleta.region || 'N/A'}</p>
                </td>
                <td>{atleta.fechaRegistro ? new Date(atleta.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <span className="status-badge green">ACTIVO</span>
                </td>
              </tr>
            ))}
            {atletas.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '30px' }}>No hay atletas oficiales registrados aún.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
