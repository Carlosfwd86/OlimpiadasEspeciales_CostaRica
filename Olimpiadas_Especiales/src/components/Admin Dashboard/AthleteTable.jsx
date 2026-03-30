import React, { useState, useEffect } from 'react';
import '../../style/PendingTable.css'; // Reutilizamos estilos de tabla
import { ServicesAdmin } from '../../services/ServicesAdmin';
import Swal from 'sweetalert2';

export default function AthleteTable({ refreshTrigger = 0, searchQuery = '', onEdit, onActionSuccess }) {
  const [atletas, setAtletas] = useState([]);
  const [roleFilter, setRoleFilter] = useState('atletas'); // 'atletas', 'voluntarios', 'entrenadores'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let fetchMethod = ServicesAdmin.getAtletas;
    if (roleFilter === 'voluntarios') fetchMethod = ServicesAdmin.getVoluntarios;
    if (roleFilter === 'entrenadores') fetchMethod = ServicesAdmin.getEntrenadores;
    if (roleFilter === 'tutores') fetchMethod = ServicesAdmin.getTutores;

    fetchMethod()
      .then(data => {
        setAtletas(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(`Error al cargar ${roleFilter}:`, error);
        setLoading(false);
      });
  }, [refreshTrigger, roleFilter]);

  const filteredAtletas = atletas.filter(atleta => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const name = (atleta.nombre || atleta.name || '').toLowerCase();
    const email = (atleta.correoElectronico || atleta.email || '').toLowerCase();
    const region = (atleta.programa || atleta.region || '').toLowerCase();
    const sport = (atleta.disciplina || atleta.sport || atleta.disciplinaPrincipal || atleta.otraArea || atleta.relacionConAtleta || '').toLowerCase();
    
    return name.includes(searchLower) || 
           email.includes(searchLower) || 
           region.includes(searchLower) || 
           sport.includes(searchLower) || 
           (atleta.nombreAtleta && atleta.nombreAtleta.toLowerCase().includes(searchLower)) ||
           (atleta.id && atleta.id.toString().includes(searchLower));
  });

  const handleDelete = (atleta) => {
    const roleLabels = {
        'atletas': 'Atleta',
        'voluntarios': 'Voluntario',
        'entrenadores': 'Entrenador',
        'tutores': 'Tutor/Familiar'
    };
    const roleName = roleLabels[roleFilter] || 'Miembro';
    Swal.fire({
      title: `¿Eliminar ${roleName}?`,
      text: `Estás a punto de borrar del sistema a ${atleta.nombre || atleta.name}. Esta acción es definitiva.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e62334',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let deleteMethod = ServicesAdmin.deleteAthlete;
        if (roleFilter === 'voluntarios') deleteMethod = ServicesAdmin.deleteVoluntario;
        if (roleFilter === 'entrenadores') deleteMethod = ServicesAdmin.deleteEntrenador;
        if (roleFilter === 'tutores') deleteMethod = ServicesAdmin.deleteTutor;

        deleteMethod(atleta.id)
          .then(() => {
            if (onActionSuccess) onActionSuccess();
            setAtletas(prev => prev.filter(a => a.id !== atleta.id));
            Swal.fire('¡Eliminado!', `El ${roleName.toLowerCase()} ha sido removido con éxito.`, 'success');
          })
          .catch(err => Swal.fire('Error', 'No se pudo eliminar: ' + err.message, 'error'));
      }
    });
  };

  if (loading) return <div className="pending-table-container">Cargando lista oficial...</div>;

  return (
    <div className="pending-table-container" style={{ marginTop: '0' }}>
      
      {/* TABS DE ROLES */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', padding: '0 20px' }}>
        <button 
            onClick={() => setRoleFilter('atletas')}
            style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: roleFilter === 'atletas' ? '#e62334' : '#f1f5f9', color: roleFilter === 'atletas' ? 'white' : '#64748b', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
            Atletas
        </button>
        <button 
            onClick={() => setRoleFilter('voluntarios')}
            style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: roleFilter === 'voluntarios' ? '#e62334' : '#f1f5f9', color: roleFilter === 'voluntarios' ? 'white' : '#64748b', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
            Voluntarios
        </button>
        <button 
            onClick={() => setRoleFilter('entrenadores')}
            style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: roleFilter === 'entrenadores' ? '#e62334' : '#f1f5f9', color: roleFilter === 'entrenadores' ? 'white' : '#64748b', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
            Entrenadores
        </button>
        <button 
            onClick={() => setRoleFilter('tutores')}
            style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: roleFilter === 'tutores' ? '#e62334' : '#f1f5f9', color: roleFilter === 'tutores' ? 'white' : '#64748b', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
            Tutores / Familiares
        </button>
      </div>

      <div className="table-wrapper">
        <table className="pending-table">
          <thead>
            <tr>
              <th>Miembro</th>
              <th>Contacto</th>
              <th>Deporte / INFO</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAtletas.map(atleta => (
              <tr key={atleta.id}>
                <td>
                  <div className="atleta-info">
                    <div className="atleta-avatar bg-light-blue">
                      {atleta.nombre ? atleta.nombre.substring(0, 2).toUpperCase() : (atleta.name ? atleta.name.substring(0, 2).toUpperCase() : 'AT')}
                    </div>
                    <div>
                      <p className="atleta-name">
                        {atleta.nombre || atleta.name || 'Sin nombre'}
                      </p>
                      <p className="atleta-id">ID: {atleta.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p>{atleta.correoElectronico || atleta.email || 'N/A'}</p>
                  <p className="atleta-phone">{atleta.telefono || atleta.phone || 'N/A'}</p>
                </td>
                <td>
                  <p>{atleta.disciplina || atleta.sport || atleta.disciplinaPrincipal || atleta.otraArea || atleta.relacionConAtleta || 'General'}</p>
                  <p className="atleta-region">{atleta.programa || atleta.region || (atleta.nombreAtleta ? `Vinculado a: ${atleta.nombreAtleta}` : 'Sede Central')}</p>
                </td>
                <td>{atleta.fechaRegistro ? new Date(atleta.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button 
                    style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '15px', fontSize: '16px', transition: 'color 0.2s' }}
                    onClick={() => { if(onEdit) onEdit(atleta); }}
                    title="Editar Atleta"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button 
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px', transition: 'color 0.2s' }}
                    onClick={() => handleDelete(atleta)}
                    title="Eliminar Atleta"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {filteredAtletas.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ color: '#cbd5e1', fontSize: '40px', marginBottom: '10px' }}>
                        <i className="fa-solid fa-folder-open"></i>
                  </div>
                  <h4 style={{ color: '#64748b', margin: '0 0 5px 0' }}>No se encontraron {roleFilter}</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Intenta ajustar los criterios numéricos o palabras en el buscador universal.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
