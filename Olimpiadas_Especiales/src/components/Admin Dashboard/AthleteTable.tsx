import React, { useState, useEffect } from 'react';
import '../../style/PendingTable.css';
import { ServicesAtletas } from '../../services/ServicesAtletas';
import type { Atleta, PaginationMeta } from '../../types';

interface AthleteTableProps {
  refreshTrigger?: number;
  searchQuery?: string;
}

const avatarColors = ['athlete-avatar-blue', 'athlete-avatar-red', 'athlete-avatar-purple'];

export default function AthleteTable({ refreshTrigger = 0, searchQuery = '' }: AthleteTableProps): React.JSX.Element {
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [localSearch, setLocalSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const query = localSearch || searchQuery;
      ServicesAtletas.obtenerAtletas(page, limit, query)
        .then(response => {
          setAtletas(response.data);
          setMeta(response.meta);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error al cargar atletas desde el backend:", error);
          setLoading(false);
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [refreshTrigger, localSearch, searchQuery, page]);

  if (loading && atletas.length === 0) {
    return (
      <div className="pending-table-container">
        <div className="empty-table-msg">
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '24px', color: '#e60000' }} />
          <p style={{ marginTop: '12px', color: '#64748b' }}>Cargando lista oficial de atletas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pending-table-container">
      {/* Header with search */}
      <div className="athlete-table-header">
        <h3>Base de Datos Oficial</h3>
        <div className="athlete-table-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Buscar atletas..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
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
            {atletas.map((atleta, index) => (
              <tr key={atleta.id}>
                <td>
                  <div className="atleta-info">
                    <div className={`athlete-avatar ${avatarColors[index % 3]}`}>
                      {atleta.nombre.charAt(0) + (atleta.primer_apellido ? atleta.primer_apellido.charAt(0) : '')}
                    </div>
                    <div>
                      <p className="atleta-name">{`${atleta.nombre} ${atleta.primer_apellido} ${atleta.segundo_apellido || ''}`}</p>
                      <p className="atleta-id">ID: {atleta.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p style={{ margin: 0, fontWeight: 500 }}>{atleta.correo_electronico || 'N/A'}</p>
                  <p className="atleta-phone">{atleta.telefono || 'N/A'}</p>
                </td>
                <td>
                  <p style={{ margin: 0, fontWeight: 500 }}>{String(atleta.disciplina || atleta.sport || 'N/A')}</p>
                  <p className="atleta-region">{String(atleta.programa || atleta.region || 'N/A')}</p>
                </td>
                <td>{atleta.fecha_registro ? new Date(atleta.fecha_registro).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <span className={atleta.status === 'INACTIVO' ? 'status-badge-inactive' : 'status-badge-active'}>
                    {atleta.status || 'ACTIVO'}
                  </span>
                </td>
              </tr>
            ))}
            {atletas.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-table-msg">
                  {searchQuery ? `No se encontraron atletas para "${searchQuery}"` : 'No hay atletas registrados en el sistema.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="table-pagination">
          <span className="pagination-info">
            Página {meta.currentPage} de {meta.totalPages} ({meta.totalItems} resultados)
          </span>
          <div className="pagination-controls">
            <button
              className="btn-page"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Anterior
            </button>
            <button
              className="btn-page"
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
