import React, { useState, useEffect } from 'react';
import '../../style/PendingTable.css';
import { ServicesAtletas } from '../../services/ServicesAtletas';
import type { Atleta, PaginationMeta } from '../../types';


/* [verde] Interfaz para las propiedades del componente */
interface AthleteTableProps {
  refreshTrigger?: number;
  searchQuery?: string;
}

/* [verde] Componente que visualiza la lista oficial de atletas sincronizada con el backend */
export default function AthleteTable({ refreshTrigger = 0, searchQuery = '' }: AthleteTableProps): React.JSX.Element {
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [localSearch, setLocalSearch] = useState<string>('');
  
  // Paginación
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const limit = 10;

  /* [verde] Efecto para cargar los datos reales al montar el componente o refrescar, con soporte para búsqueda y paginación */
  useEffect(() => {
    // Implementación simple de debounce para la búsqueda
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

  if (loading && atletas.length === 0) return <div className="pending-table-container">Cargando lista oficial...</div>;

  // Ya no filtramos localmente, el backend nos da los resultados precisos
  const filteredAtletas = atletas;

  return (
    <div className="pending-table-container" style={{ marginTop: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 5px' }}>
        <h3 style={{ margin: 0, color: 'var(--admin-text-main)', fontSize: '16px' }}>Base de Datos Oficial</h3>
        <div style={{ position: 'relative' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '13px' }}></i>
          <input 
            type="text" 
            placeholder="Buscar atletas..." 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{ padding: '8px 12px 8px 35px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', width: '250px', background: 'var(--admin-white)', color: 'var(--admin-text-main)' }}
          />
        </div>
      </div>
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
            {filteredAtletas.map(atleta => (
              <tr key={atleta.id}>
                <td>
                  <div className="atleta-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="athlete-avatar bg-light-blue" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#2563eb', backgroundColor: '#eff6ff' }}>
                      {atleta.nombre.charAt(0) + (atleta.primer_apellido ? atleta.primer_apellido.charAt(0) : '')}
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
            {filteredAtletas.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '30px' }}>
                  {searchQuery ? `No se encontraron atletas para "${searchQuery}"` : "No hay atletas registrados en el sistema."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {meta && meta.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Mostrando página {meta.currentPage} de {meta.totalPages} ({meta.totalItems} resultados)
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: page === 1 ? '#f1f5f9' : 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', color: '#475569', fontSize: '13px', fontWeight: '500' }}
            >
              Anterior
            </button>
            <button 
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} 
              disabled={page === meta.totalPages}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: page === meta.totalPages ? '#f1f5f9' : 'white', cursor: page === meta.totalPages ? 'not-allowed' : 'pointer', color: '#475569', fontSize: '13px', fontWeight: '500' }}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
