import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { updateAtleta, getAtletaById } from '../services/ServicesAtletas';
import { updateTutor, getTutorById } from '../services/ServicesTutores';
import { updateEntrenador, getEntrenadorById } from '../services/ServicesEntrenadores';
import { updateVoluntario, getVoluntarioById } from '../services/ServicesVoluntarios';
import { updateUsuario } from '../services/ServicesUsuarios';
import { ServicesAdmin } from '../services/ServicesAdmin';
import '../styles/Perfil.css';

function FormPerfil({ user, setRefreshUser }) {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [linkedUser, setLinkedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...user });

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) setEditData({ ...user });
    };

    const handleInputChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveProfile = async () => {
        try {
            Swal.fire({ title: 'Guardando...', didOpen: () => Swal.showLoading() });
            
            let updated;
            if (user.rol === 'atleta') {
                updated = await updateAtleta(user.id, editData);
            } else if (user.rol === 'tutor') {
                updated = await updateTutor(user.id, editData);
            } else if (user.rol === 'entrenador') {
                updated = await updateEntrenador(user.id, editData);
            } else if (user.rol === 'voluntario') {
                updated = await updateVoluntario(user.id, editData);
            } else if (user.rol === 'admin') {
                updated = await ServicesAdmin.updateProfile(user.id, editData);
            } else {
                updated = await updateUsuario(user.id, editData);
            }

            localStorage.setItem('usuarioSesion', JSON.stringify(editData));
            
            Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Perfil actualizado correctamente', timer: 2000, showConfirmButton: false });
            setIsEditing(false);
            if(setRefreshUser) setRefreshUser(editData);

        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron guardar los cambios.' });
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                Swal.fire({
                    icon: 'success',
                    title: '¡Imagen adjuntada!',
                    text: 'Has seleccionado una nueva imagen para tu perfil.',
                    timer: 2000,
                    showConfirmButton: false
                });
            };
            reader.readAsDataURL(file);
        }
    };

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
                } else if (user?.rol === 'entrenador' || user?.rol === 'voluntario') {
                    // Possible future linking for these roles
                    setLinkedUser(null);
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
            } else if (user.rol === 'entrenador') {
                await updateEntrenador(user.id, updatedUser);
            } else if (user.rol === 'voluntario') {
                await updateVoluntario(user.id, updatedUser);
            } else if (user.rol === 'admin') {
                await ServicesAdmin.updateProfile(user.id, updatedUser);
            } else if (user.rol === 'usuario') {
                await updateUsuario(user.id, updatedUser);
            } else {
                Swal.fire({ icon: 'info', title: 'Aviso', text: 'Cambio de contraseña no implementado para este rol.' });
                return;
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

    const badgeLabel = {
        'atleta': 'Atleta Oficial',
        'tutor': 'Tutor / Familiar',
        'admin': 'Administrador',
        'entrenador': 'Entrenador',
        'voluntario': 'Voluntario',
        'usuario': 'Usuario General'
    }[user.rol] || (user.rol ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1) : 'Usuario');
    
    // Generar avatar a partir de iniciales
    const iniciales = (user.nombre?.charAt(0) || '') + (user.apellido?.charAt(0) || user.tutorApellido?.charAt(0) || '');

    return (
        <div className="perfil-container" style={{ position: 'relative' }}>
            <style>{`
                .boton_regresar {
                    position: absolute;
                    top: 25px;
                    left: 30px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 20px;
                    background: #ffffff;
                    border: 1px solid #ff0000;
                    border-radius: 12px;
                    color: #ff0000;
                    font-weight: 700;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 10;
                }

                .boton_regresar:hover {
                    background: #f8fafc;
                    color: #1e293b;
                    border-color: #1e293b;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                    transform: translateX(-5px);
                }

                .boton_regresar svg {
                    transition: transform 0.3s ease;
                    stroke: #ff0000;
                }

                .boton_regresar:hover svg {
                    transform: translateX(-3px);
                    stroke: #1e293b;
                }
                
                @media (max-width: 768px) {
                    .boton_regresar {
                        top: 15px;
                        left: 15px;
                        padding: 8px 15px;
                        font-size: 0.8rem;
                    }
                }

                .avatar-edit-icon {
                    position: absolute;
                    bottom: 0px;
                    right: 4px;
                    width: 28px;
                    height: 28px;
                    background: #ff0000;
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                    transition: all 0.3s ease;
                }

                .avatar-edit-icon:hover {
                    transform: scale(1.15);
                    background: #1e293b;
                }

                .edit-profile-action {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: #fff;
                    border: 1.5px solid #ff0000;
                    border-radius: 10px;
                    color: #ff0000;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .edit-profile-action:hover {
                    background: #ff0000;
                    color: #fff;
                    box-shadow: 0 4px 12px rgba(255, 0, 0, 0.15);
                }

                .edit-input-field {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 14px;
                    font-family: 'Outfit', sans-serif;
                    color: #1e293b;
                    background: #f8fafc;
                    transition: all 0.2s ease;
                }

                .edit-input-field:focus {
                    outline: none;
                    border-color: #ff0000;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.05);
                }

                .edit-actions-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 1px solid #f1f5f9;
                }

                .btn-save {
                    background: #ff0000;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-save:hover {
                    background: #cc0000;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 0, 0, 0.2);
                }

                .btn-cancel {
                    background: #f1f5f9;
                    color: #64748b;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-cancel:hover {
                    background: #e2e8f0;
                    color: #1e293b;
                }
            `}</style>

            <button className="boton_regresar" onClick={() => navigate(-1)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Regresar
            </button>
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
                        <div className="id-card-avatar" style={{ position: 'relative' }}>
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                iniciales || '👤'
                            )}
                            <div className="avatar-edit-icon" onClick={handleAvatarClick}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/jpg"
                            />
                        </div>
                        {isEditing ? (
                            <div style={{ marginBottom: '15px' }}>
                                <input 
                                    name="nombre" 
                                    className="edit-input-field" 
                                    value={editData.nombre} 
                                    onChange={handleInputChange} 
                                    style={{ fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}
                                />
                            </div>
                        ) : (
                            <h2>{user.nombre} {user.apellido || user.tutorApellido || ''}</h2>
                        )}
                        
                        <p>{user.correoElectronico || user.tutorCorreo}</p>
                        
                        <div className="id-card-detail">
                            <span>Rol en el Sistema</span>
                            {isEditing ? (
                                <select 
                                    name="rol" 
                                    className="edit-input-field" 
                                    value={editData.rol} 
                                    onChange={handleInputChange}
                                    style={{ fontSize: '12px', padding: '5px' }}
                                >
                                    <option value="atleta">Atleta Oficial</option>
                                    <option value="entrenador">Entrenador</option>
                                    <option value="tutor">Tutor / Familiar</option>
                                    <option value="voluntario">Voluntario</option>
                                    <option value="usuario">Usuario General</option>
                                    {!['atleta','entrenador','tutor','voluntario','usuario'].includes(user.rol) && (
                                        <option value={user.rol}>{user.rol}</option>
                                    )}
                                </select>
                            ) : (
                                <span style={{color: '#E00000', textTransform: 'capitalize'}}>{badgeLabel}</span>
                            )}
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
                        <button className="btn-success" onClick={() => navigate('/formulario')} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Postularme
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>Información de {badgeLabel}</h3>
                            {!isEditing && (
                                <button className="edit-profile-action" onClick={handleEditToggle}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    Editar Información
                                </button>
                            )}
                        </div>
                        
                        {user.rol === 'atleta' ? (
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Nombre Completo</span>
                                    {isEditing ? (
                                        <input name="nombre" className="edit-input-field" value={editData.nombre} onChange={handleInputChange} />
                                    ) : (
                                        <span className="detail-value">{user.nombre} {user.apellido}</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Edad</span>
                                    {isEditing ? (
                                        <input name="edad" type="number" className="edit-input-field" value={editData.edad} onChange={handleInputChange} />
                                    ) : (
                                        <span className="detail-value">{user.edad || 'N/A'}</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Fecha de Nacimiento</span>
                                    {isEditing ? (
                                        <input name="fechaNacimiento" type="date" className="edit-input-field" value={editData.fechaNacimiento} onChange={handleInputChange} />
                                    ) : (
                                        <span className="detail-value">{user.fechaNacimiento || 'N/A'}</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Cédula / ID</span>
                                    {isEditing ? (
                                        <input name="cedula" className="edit-input-field" value={editData.cedula} onChange={handleInputChange} />
                                    ) : (
                                        <span className="detail-value">{user.cedula || 'N/A'}</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Teléfono</span>
                                    {isEditing ? (
                                        <input name="telefono" className="edit-input-field" value={editData.telefono} onChange={handleInputChange} />
                                    ) : (
                                        <span className="detail-value">{user.telefono || 'N/A'}</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">País / Región</span>
                                    {isEditing ? (
                                        <input name="pais" className="edit-input-field" value={editData.pais} onChange={handleInputChange} />
                                    ) : (
                                        <span className="detail-value">{user.pais || 'N/A'}</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Rol en el programa</span>
                                    {isEditing ? (
                                        <select name="rol" className="edit-input-field" value={editData.rol} onChange={handleInputChange}>
                                            <option value="atleta">Atleta Oficial</option>
                                            <option value="entrenador">Entrenador</option>
                                            <option value="tutor">Tutor / Familiar</option>
                                            <option value="voluntario">Voluntario</option>
                                            <option value="usuario">Usuario General</option>
                                            {!['atleta','entrenador','tutor','voluntario','usuario'].includes(user.rol) && (
                                                <option value={user.rol}>{user.rol}</option>
                                            )}
                                        </select>
                                    ) : (
                                        <span className="detail-value">{badgeLabel}</span>
                                    )}
                                </div>
                            </div>
                        ) : user.rol === 'tutor' ? (
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Nombre Completo</span>
                                    {isEditing ? (
                                        <input name="nombre" className="edit-input-field" value={editData.nombre} onChange={handleInputChange} />
                                    ) : (
                                        <span className="detail-value">{user.nombre} {user.tutorApellido || user.apellido || ''}</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Edad</span>
                                    {isEditing ? (
                                        <input name="edad" type="number" className="edit-input-field" value={editData.edad} onChange={handleInputChange} />
                                    ) : (
                                        <span className="detail-value">{user.edad || 'N/A'}</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Cédula / ID</span>
                                    {isEditing ? (
                                        <input name="cedula" className="edit-input-field" value={editData.cedula} onChange={handleInputChange} />
                                    ) : (
                                        <span className="detail-value">{user.cedula || 'N/A'}</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Teléfono Primario</span>
                                    {isEditing ? (
                                        <input name="telefono" className="edit-input-field" value={editData.telefono || editData.tutorTelefono} onChange={handleInputChange} />
                                    ) : (
                                        <span className="detail-value">{user.telefono || user.tutorTelefono || 'N/A'}</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Rol en el programa</span>
                                    {isEditing ? (
                                        <select name="rol" className="edit-input-field" value={editData.rol} onChange={handleInputChange}>
                                            <option value="atleta">Atleta Oficial</option>
                                            <option value="entrenador">Entrenador</option>
                                            <option value="tutor">Tutor / Familiar</option>
                                            <option value="voluntario">Voluntario</option>
                                            <option value="usuario">Usuario General</option>
                                            {!['atleta','entrenador','tutor','voluntario','usuario'].includes(user.rol) && (
                                                <option value={user.rol}>{user.rol}</option>
                                            )}
                                        </select>
                                    ) : (
                                        <span className="detail-value">{badgeLabel}</span>
                                    )}
                                </div>
                            </div>
                        ) : (user.rol === 'entrenador' || user.rol === 'voluntario' || user.rol === 'usuario' || true) ? (
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Nombre Completo</span>
                                    {isEditing ? (
                                        <input name="nombre" className="edit-input-field" value={editData.nombre} onChange={handleInputChange} />
                                    ) : (
                                        <span className="detail-value">{user.nombre} {user.apellido || ''}</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Edad</span>
                                    {isEditing ? (
                                        <input name="edad" type="number" className="edit-input-field" value={editData.edad} onChange={handleInputChange} />
                                    ) : (
                                        <span className="detail-value">{user.edad || 'N/A'}</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Cédula / ID</span>
                                    {isEditing ? (
                                        <input name="cedula" className="edit-input-field" value={editData.cedula} onChange={handleInputChange} />
                                    ) : (
                                        <span className="detail-value">{user.cedula || 'N/A'}</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">País / Región</span>
                                    {isEditing ? (
                                        <input name="pais" className="edit-input-field" value={editData.pais} onChange={handleInputChange} />
                                    ) : (
                                        <span className="detail-value">{user.pais || 'Costa Rica'}</span>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Correo Registrado</span>
                                    <span className="detail-value">{user.correoElectronico}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Rol en el programa</span>
                                    {isEditing ? (
                                        <select name="rol" className="edit-input-field" value={editData.rol} onChange={handleInputChange}>
                                            <option value="atleta">Atleta Oficial</option>
                                            <option value="entrenador">Entrenador</option>
                                            <option value="tutor">Tutor / Familiar</option>
                                            <option value="voluntario">Voluntario</option>
                                            <option value="usuario">Usuario General</option>
                                            {!['atleta','entrenador','tutor','voluntario','usuario'].includes(user.rol) && (
                                                <option value={user.rol}>{user.rol}</option>
                                            )}
                                        </select>
                                    ) : (
                                        <span className="detail-value">{badgeLabel}</span>
                                    )}
                                </div>
                            </div>
                        ) : null}

                        {isEditing && (
                            <div className="edit-actions-footer">
                                <button className="btn-cancel" onClick={handleEditToggle}>Cancelar</button>
                                <button className="btn-save" onClick={handleSaveProfile}>Guardar Cambios</button>
                            </div>
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