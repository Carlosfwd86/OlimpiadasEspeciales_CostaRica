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
                  <div className="atleta-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="athlete-avatar bg-light-blue" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#2563eb', backgroundColor: '#eff6ff' }}>
                      {atleta.nombre.charAt(0) + atleta.primer_apellido.charAt(0)}
                    </div>
                    <div>
                      <p className="atleta-name" style={{ margin: 0, fontWeight: '600' }}>{`${atleta.nombre} ${atleta.primer_apellido} ${atleta.segundo_apellido || ''}`}</p>
                      <p className="atleta-id" style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>ID: {atleta.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p style={{ margin: 0 }}>{atleta.correo_electronico || 'N/A'}</p>
                  <p className="atleta-phone" style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{atleta.telefono || 'N/A'}</p>
                </td>
                <td>
                  <p style={{ margin: 0 }}>{String(atleta.disciplina || atleta.sport || 'N/A')}</p>
                  <p className="atleta-region" style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{String(atleta.programa || atleta.region || 'N/A')}</p>
                </td>
                <td>{atleta.fecha_registro ? new Date(atleta.fecha_registro).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <span className={`status-badge ${atleta.status === 'INACTIVO' ? 'red' : 'green'}`} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: atleta.status === 'INACTIVO' ? '#fef2f2' : '#f0fdf4', color: atleta.status === 'INACTIVO' ? '#ef4444' : '#22c55e' }}>
                    {atleta.status || 'ACTIVO'}
                  </span>
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
