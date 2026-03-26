import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { updateAtleta, getAtletaById } from '../services/ServicesAtletas';
import { updateTutor, getTutorById } from '../services/ServicesTutores';
import '../styles/Perfil.css';

function FormPerfil({ user, setRefreshUser }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [linkedUser, setLinkedUser] = useState(null);

    // Fetch linked user info
    useEffect(() => {
        const fetchLinked = async () => {
            try {
                if (user?.rol === 'atleta' && user.tutorVinculado) {
                    const tutor = await getTutorById(user.tutorVinculado);
                    setLinkedUser(tutor);
                } else if (user?.rol === 'tutor' && user.atletaVinculado) {
                    const atleta = await getAtletaById(user.atletaVinculado);
                    setLinkedUser(atleta);
                }
            } catch (error) {
                console.error("Error fetching linked user", error);
            }
        };
        fetchLinked();
    }, [user]);

    const handlePasswordChange = async () => {
        if (!newPassword || newPassword.length < 5) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'La contraseña debe tener al menos 5 caracteres' });
            return;
        }

        try {
            Swal.fire({ title: 'Actualizando...', didOpen: () => Swal.showLoading() });
            
            const updatedUser = { ...user, password: newPassword };
            
            if (user.rol === 'atleta') {
                await updateAtleta(user.id, updatedUser);
            } else if (user.rol === 'tutor') {
                await updateTutor(user.id, updatedUser);
            } else {
                // For admin or others
                Swal.fire({ icon: 'info', title: 'Aviso', text: 'Cambio de contraseña no implementado para este rol en JSON.' });
            }

            // Actualizar localstorage si es el mismo
            localStorage.setItem('usuarioSesion', JSON.stringify(updatedUser));
            
            Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Contraseña actualizada correctamente', confirmButtonColor: '#E00000' });
            setModalOpen(false);
            setNewPassword('');
            
            if(setRefreshUser) setRefreshUser(updatedUser);

        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Hubo un problema actualizando la contraseña.' });
        }
    };

    if (!user) return <div style={{padding: '50px', textAlign: 'center', fontFamily: 'Outfit'}}>Cargando Perfil...</div>;

    const badgeLabel = user.rol === 'atleta' ? 'Atleta Oficial' : user.rol === 'tutor' ? 'Tutor/Encargado' : 'Administrador';
    
    // Generar avatar a partir de iniciales
    const iniciales = (user.nombre?.charAt(0) || '') + (user.apellido?.charAt(0) || user.tutorApellido?.charAt(0) || '');

    return (
        <div className="perfil-container">
            {/* Header / Cover */}
            <div className="perfil-header">
                <div className="perfil-title">
                    <h1>Mí Perfil</h1>
                    <p>Gestiona tu información y configuración</p>
                </div>
                <div className="perfil-logo-container">
                    <div className="perfil-logo">🏆</div>
                    <span className="perfil-badge">{badgeLabel}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="perfil-content">
                
                {/* ID / Sidebar */}
                <div className="perfil-sidebar">
                    <div className="id-card">
                        <div className="id-card-avatar">
                            {iniciales || '👤'}
                        </div>
                        <h2>{user.nombre} {user.apellido || user.tutorApellido || ''}</h2>
                        <p>{user.correoElectronico || user.tutorCorreo}</p>
                        
                        <div className="id-card-detail">
                            <span>Rol en el Sistema</span>
                            <span style={{color: '#E00000', textTransform: 'capitalize'}}>{user.rol}</span>
                        </div>
                        <div className="id-card-detail">
                            <span>ID de Registro</span>
                            <span>#{user.id}</span>
                        </div>
                        {user.rol === 'atleta' && user.disciplina && (
                            <div className="id-card-detail">
                                <span>Disciplina</span>
                                <span>{user.disciplina}</span>
                            </div>
                        )}
                        {user.rol === 'tutor' && user.relacionConAtleta && (
                            <div className="id-card-detail">
                                <span>Relación Familiar</span>
                                <span>{user.relacionConAtleta}</span>
                            </div>
                        )}
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <button className="btn-primary" onClick={() => setModalOpen(true)}>
                            Cambiar Contraseña
                        </button>
                        <button className="btn-secondary" onClick={() => {
                            localStorage.removeItem('usuarioSesion'); // Changed from 'user' to 'usuarioSesion'
                            window.location.href = '/login'; // O a donde redirija tu auth
                        }}>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Info Sections */}
                <div className="perfil-main">
                    
                    {/* Sección General */}
                    <div className="perfil-section">
                        <h3>Información Personal</h3>
                        {user.rol === 'atleta' ? (
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Fecha de Nacimiento</span>
                                    <span className="detail-value">{user.fechaNacimiento || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Cédula / ID</span>
                                    <span className="detail-value">{user.cedula || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Teléfono</span>
                                    <span className="detail-value">{user.telefono || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">País / Región</span>
                                    <span className="detail-value">{user.pais || 'N/A'}</span>
                                </div>
                            </div>
                        ) : user.rol === 'tutor' ? (
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Cédula / ID</span>
                                    <span className="detail-value">{user.cedula || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Teléfono Primario</span>
                                    <span className="detail-value">{user.telefono || user.tutorTelefono || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">País / Región</span>
                                    <span className="detail-value">{user.pais || user.tutorPais || 'N/A'}</span>
                                </div>
                            </div>
                        ) : (
                            <p style={{color: '#64748b'}}>Datos administrativos.</p>
                        )}
                    </div>

                    {/* Sección Médica (Solo Atleta) */}
                    {user.rol === 'atleta' && (
                        <div className="perfil-section">
                            <h3>Resumen de Salud</h3>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Contacto de Emergencia</span>
                                    <span className="detail-value">{user.emergenciaNombre || 'No definido'} ({user.emergenciaTelefono})</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Condiciones Registradas</span>
                                    <span className="detail-value">{user.condicionesMedicas?.length > 0 ? user.condicionesMedicas.join(', ') : 'Ninguna'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Alergias Graves</span>
                                    <span className="detail-value">{user.alergiasGraves === 'Si' ? (user.tiposAlergia?.join(', ') || 'Sí') : 'Ninguna'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Medicamentos Frecuentes</span>
                                    <span className="detail-value">{user.tomaMedicamentos === 'Si' && user.medicamentos ? user.medicamentos.length + ' prescripciones' : 'Ninguno'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Vínculo Familiar */}
                    {linkedUser && (
                        <div className="perfil-section">
                            <h3>{user.rol === 'atleta' ? 'Tutor/Encargado Vinculado' : 'Atleta a Cargo'}</h3>
                            <div className="linked-user-banner">
                                <div className="linked-user-avatar">
                                    {(linkedUser.nombre?.charAt(0) || '')}
                                </div>
                                <div className="linked-user-info">
                                    <h4>{linkedUser.nombre} {linkedUser.apellido || linkedUser.tutorApellido || ''}</h4>
                                    <p>{linkedUser.correoElectronico || linkedUser.tutorCorreo} • {linkedUser.telefono || linkedUser.tutorTelefono}</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Modal Cambio de Contraseña */}
            {modalOpen && (
                <div className="password-modal-overlay">
                    <div className="password-modal">
                        <h3>Cambiar Contraseña</h3>
                        <p style={{color: '#64748b', marginBottom: '20px', fontSize: '14px'}}>Ingresa tu nueva contraseña a continuación. Te recomendamos usar algo seguro y fácil de recordar.</p>
                        
                        <input 
                            type="password" 
                            className="modal-input" 
                            placeholder="Nueva contraseña" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => {setModalOpen(false); setNewPassword('');}}>Cancelar</button>
                            <button className="btn-primary" onClick={handlePasswordChange}>Guardar Cambio</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FormPerfil;