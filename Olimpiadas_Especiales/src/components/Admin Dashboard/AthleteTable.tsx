import React, { useState, useEffect } from 'react';
import '../../style/PendingTable.css';
import { ServicesAtletas } from '../../services/ServicesAtletas';
import type { Atleta } from '../../types';

/* [verde] Interfaz para las propiedades del componente */
interface AthleteTableProps {
  refreshTrigger?: number;
}

/* [verde] Componente que visualiza la lista oficial de atletas sincronizada con el backend */
export default function AthleteTable({ refreshTrigger = 0 }: AthleteTableProps): React.JSX.Element {
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /* [verde] Efecto para cargar los datos reales al montar el componente o refrescar */
  useEffect(() => {
    ServicesAtletas.obtenerAtletas()
      .then(data => {
        setAtletas(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar atletas desde el backend:", error);
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
              <th>Información Médica</th>
              <th>Fecha Registro</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {atletas.map(atleta => (
              <tr key={atleta.id}>
                <td>
                  <div className="atleta-info">
                    {/* [verde] Generamos iniciales basadas en el nombre real */}
                    <div className="atleta-avatar bg-light-blue">
                      {atleta.nombre ? atleta.nombre.substring(0, 2).toUpperCase() : 'AT'}
                    </div>
                    <div>
                      <p className="atleta-name">{atleta.nombre} {atleta.primer_apellido}</p>
                      <p className="atleta-id">ID: #{atleta.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p>{atleta.correo_electronico || 'Sin correo'}</p>
                  <p className="atleta-phone">{atleta.telefono || 'Sin teléfono'}</p>
                </td>
                <td>
                  {/* [verde] Mostramos cantidad de condiciones o medicamentos si existen */}
                  <p>{atleta.condiciones?.length || 0} Condiciones</p>
                  <p className="atleta-region">{atleta.medicamentos?.length || 0} Medicamentos</p>
                </td>
                <td>{atleta.fecha_registro ? new Date(atleta.fecha_registro).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <span className="status-badge green">ACTIVO</span>
                </td>
              </tr>
            ))}
            {atletas.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '30px' }}>No hay atletas registrados en el sistema.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
