import React, { useState, useEffect, useRef } from 'react';
import DatePickerInput from './DatePickerInput';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { updateAtleta, getAtletaById } from '../services/ServicesAtletas';
import { updateTutor, getTutorById } from '../services/ServicesTutores';
import { updateEntrenador, getEntrenadorById } from '../services/ServicesEntrenadores';
import { updateVoluntario, getVoluntarioById } from '../services/ServicesVoluntarios';
import { updateUsuario, getUsuarioById } from '../services/ServicesUsuarios';
import { ServicesAdmin } from '../services/ServicesAdmin';
import type { Atleta, Tutor, Entrenador, Voluntario, Usuario } from '../types';
import '../styles/Perfil.css';

/* ─────────── Helpers ─────────── */
const compressImage = (base64: string, maxWidth = 400, maxHeight = 400): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
            } else {
                if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; }
            }
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            } else {
                resolve(base64);
            }
        };
    });
};

const rolLabel = (rol?: string, rolUsuario?: string) => {
    if (rol === 'atleta') return 'Atleta Oficial';
    if (rol === 'entrenador') return 'Entrenador';
    if (rol === 'tutor') return 'Tutor / Familiar';
    if (rol === 'voluntario') return 'Voluntario';
    if (rol === 'admin') return 'Administrador';
    return rolUsuario || 'Usuario General';
};

interface FieldProps {
    label: string;
    name: string;
    value: any;
    editing: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    type?: string;
    options?: { value: string; label: string }[];
}

const Field = ({ label, name, value, editing, onChange, type = 'text', options }: FieldProps) => (
    <div className="form-group">
        <label className="form-label">{label}</label>
        {editing ? (
            options ? (
                <select name={name} value={value || ''} onChange={onChange} className="form-input">
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            ) : type === 'date' ? (
                <DatePickerInput name={name} value={value || ''} onChange={onChange as any} />
            ) : (
                <input name={name} type={type} value={value || ''} onChange={onChange} className="form-input" />
            )
        ) : (
            <div className="form-static">{value || '—'}</div>
        )}
    </div>
);

/* ─────────── Main Component ─────────── */
interface FormPerfilProps {
    user: any;
    setRefreshUser?: (user: any) => void;
}

function FormPerfil({ user, setRefreshUser }: FormPerfilProps): React.JSX.Element {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || localStorage.getItem(`avatar_${user?.id}`) || null);
    const [editData, setEditData] = useState<any>({ ...user });
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [linkedUser, setLinkedUser] = useState<any>(null);

    useEffect(() => { 
        const mappedUser = {
            ...user,
            correoElectronico: user?.correo_electronico || user?.correoElectronico,
            fechaNacimiento: user?.fecha_nacimiento || user?.fechaNacimiento,
            avatarUrl: user?.avatar_url || user?.avatarUrl,
            rol_id: user?.rol_id || user?.rolId,
            proximosRetos: user?.proximos_retos || user?.proximosRetos,
            equipo: user?.equipo || user?.equipo,
            experiencia: user?.experiencia || user?.experiencia
        };
        setEditData(mappedUser);
        const savedAvatar = localStorage.getItem(`avatar_${user?.id}`);
        setAvatarPreview(mappedUser.avatarUrl || savedAvatar || null);
    }, [user]);

    useEffect(() => {
        const fetchRoleData = async () => {
            if (!user?.id || user?.rol === 'usuario') return;
            try {
                const roleId = `${user.rol}_${user.id}`;
                let data: any = null;
                
                if (user.rol === 'atleta') data = await getAtletaById(roleId);
                else if (user.rol === 'entrenador') data = await getEntrenadorById(roleId);
                else if (user.rol === 'voluntario') data = await getVoluntarioById(roleId);
                else if (user.rol === 'tutor') data = await getTutorById(roleId);

                if (data) {
                    const mappedData = {
                        ...data,
                        correoElectronico: data.correo_electronico || data.correoElectronico,
                        fechaNacimiento: data.fecha_nacimiento || data.fechaNacimiento,
                        aniosExperiencia: data.anios_experiencia || data.aniosExperiencia,
                        experiencia: data.experiencia || data.experiencia_previa || data.experiencia,
                        emergenciaNombre: data.emergencia_nombre || data.emergenciaNombre,
                        emergenciaTelefono: data.emergencia_telefono || data.emergenciaTelefono,
                        proximosRetos: data.proximos_retos || data.proximosRetos,
                        equipo: data.equipo || data.disciplina || data.equipo
                    };
                    setEditData((prev: any) => ({ ...prev, ...mappedData }));
                    
                    if (user.rol === 'atleta' && data.tutorVinculado) {
                        setLinkedUser(await getTutorById(data.tutorVinculado));
                    } else if (user.rol === 'tutor' && data.atletaVinculado) {
                        setLinkedUser(await getAtletaById(data.atletaVinculado));
                    }
                }
            } catch (e) {
                console.warn("No se encontró registro extendido");
            }
        };
        fetchRoleData();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEditData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        try {
            Swal.fire({ title: 'Guardando...', didOpen: () => Swal.showLoading() });
            let updatedRecord;
            const roleId = `${user.rol}_${user.id}`;
            if (user.rol === 'atleta') updatedRecord = await updateAtleta(roleId, editData);
            else if (user.rol === 'tutor') updatedRecord = await updateTutor(roleId, editData);
            else if (user.rol === 'entrenador') updatedRecord = await updateEntrenador(roleId, editData);
            else if (user.rol === 'voluntario') updatedRecord = await updateVoluntario(roleId, editData);
            else if (user.rol === 'admin') updatedRecord = await ServicesAdmin.updateProfile(user.id, editData);
            
            await updateUsuario(user.id, editData);
            
            const finalData = { ...editData, ...(updatedRecord || {}) };
            localStorage.setItem('usuarioSesion', JSON.stringify(finalData));
            if (finalData.avatarUrl) {
                localStorage.setItem(`avatar_${user.id}`, finalData.avatarUrl);
            }
            if (setRefreshUser) setRefreshUser(finalData);
            setIsEditing(false);
            Swal.fire({ icon: 'success', title: '¡Guardado!', timer: 1800, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar.' });
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                if (typeof reader.result === 'string') {
                    const compressed = await compressImage(reader.result);
                    setAvatarPreview(compressed);
                    setEditData((prev: any) => ({ ...prev, avatarUrl: compressed }));
                    localStorage.setItem(`avatar_${user.id}`, compressed);
                    Swal.fire({ icon: 'success', title: 'Imagen lista', text: 'Se aplicará al guardar.', timer: 1500, showConfirmButton: false });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const iniciales = user?.nombre ? user.nombre.slice(0, 2).toUpperCase() : '?';
    const badge = rolLabel(user?.rol, user?.rolUsuario);

    const documentosList = [
        { key: 'cedula_nombre', label: 'Cédula Identidad', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"/><path d="M7 12h.01"/><path d="M11 12h6"/><path d="M11 16h6"/></svg> },
    ];

    return (
        <div className="profile-layout-container">
            
            {/* ── ACTION BAR ── */}
            <div className="bento-actions-bar">
                <button className="btn-bento-back" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12L12 19M5 12L12 5"/></svg>
                    Volver
                </button>

                <div className="bento-controls">
                    {!isEditing ? (
                        <button className="btn-bento-action btn-primary" onClick={() => setIsEditing(true)}>✎ Modo Edición</button>
                    ) : (
                        <>
                            <button className="btn-bento-action btn-light" onClick={() => { setIsEditing(false); setEditData({ ...user }); setAvatarPreview(user.avatarUrl); }}>Cancelar</button>
                            <button className="btn-bento-action btn-success" onClick={handleSave}>Guardar Cambios</button>
                        </>
                    )}
                </div>
            </div>

            {/* ── BENTO GRID ── */}
            <div className="bento-grid">
                
                {/* Identity Card */}
                <div className="bento-card card-identity">
                    <div className="bento-avatar-wrapper" onClick={() => fileInputRef.current?.click()}>
                        {avatarPreview ? <img src={avatarPreview} alt="avatar" /> : iniciales}
                        <div className="avatar-overlay">Editar</div>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                    </div>
                    <h1 className="identity-name">
                        {isEditing ? (
                            <input name="nombre" value={editData.nombre || ''} onChange={handleChange} className="form-input" style={{ textAlign: 'center', fontSize: '1.5rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }} />
                        ) : (
                            `${user?.nombre || ''} ${user?.apellido || ''}`
                        )}
                    </h1>
                    <span className="identity-role">{badge}</span>
                </div>

                {/* Quick Stats Mini Cards */}
                <div className="card-quick-stats">
                    <div className="stats-grid">
                        <div className="stat-box">
                            <span className="stat-label">ID Sistema</span>
                            <span className="stat-val">#{user?.id}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Estado</span>
                            <span className="stat-val" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span> Activo
                            </span>
                        </div>
                        <div className="stat-box" style={{ gridColumn: 'span 2' }}>
                            <span className="stat-label">Correo Principal</span>
                            <span className="stat-val" style={{ fontSize: '1rem' }}>{user?.correoElectronico}</span>
                        </div>
                    </div>
                </div>

                {/* Datos Personales */}
                <div className="bento-card card-personal">
                    <h2 className="card-title">
                        <div className="card-title-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                        Datos Personales
                    </h2>
                    <div className="bento-form-grid">
                        <Field label="Nombre Completo" name="nombre" value={editData.nombre} editing={isEditing} onChange={handleChange} />
                        <Field label="Cédula" name="cedula" value={editData.cedula} editing={isEditing} onChange={handleChange} />
                        <Field label="Nacimiento" name="fechaNacimiento" type="date" value={editData.fechaNacimiento} editing={isEditing} onChange={handleChange} />
                        <Field label="Teléfono" name="telefono" value={editData.telefono} editing={isEditing} onChange={handleChange} />
                        <div style={{ gridColumn: 'span 2' }}>
                            <Field label="Dirección Exacta" name="direccion" value={editData.direccion} editing={isEditing} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Info Médica */}
                {user?.rol !== 'usuario' && (
                    <div className="bento-card card-medical">
                        <h2 className="card-title" style={{ color: '#e11d48' }}>
                            <div className="card-title-icon" style={{ background: '#ffe4e6', color: '#e11d48' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                            </div>
                            Historial Médico
                        </h2>
                        <div className="bento-form-grid single">
                            <Field label="Discapacidad" name="tipoDiscapacidad" value={editData.tipoDiscapacidad} editing={isEditing} onChange={handleChange} />
                            <Field label="Alergias Conocidas" name="alergias" value={editData.alergias || (Array.isArray(editData.tiposAlergia) ? editData.tiposAlergia.join(', ') : '')} editing={isEditing} onChange={handleChange} />
                            <Field label="Medicamentos Recetados" name="medicamentos" value={typeof editData.medicamentos === 'string' ? editData.medicamentos : (Array.isArray(editData.medicamentos) ? editData.medicamentos.join(', ') : '')} editing={isEditing} onChange={handleChange} />
                        </div>
                    </div>
                )}

                {/* Ficha Deportiva */}
                {user?.rol !== 'usuario' && (
                    <div className="bento-card card-sport">
                        <h2 className="card-title">
                            <div className="card-title-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg></div>
                            Ficha Deportiva
                        </h2>
                        <div className="bento-form-grid">
                            <Field label="Disciplina / Equipo" name="equipo" value={editData.equipo || editData.disciplina} editing={isEditing} onChange={handleChange} />
                            <Field label="Experiencia" name="experiencia" value={editData.experiencia || editData.aniosExperiencia || editData.disciplina} editing={isEditing} onChange={handleChange} />
                            <div style={{ gridColumn: 'span 2' }}>
                                <Field label="Próximos Retos" name="proximosRetos" value={editData.proximosRetos} editing={isEditing} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Documentos */}
                {user?.rol !== 'usuario' && (
                    <div className="bento-card card-documents">
                        <h2 className="card-title">
                            <div className="card-title-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
                            Documentos Adjuntos
                        </h2>
                        <div className="bento-docs-grid">
                            {documentosList.map(doc => {
                                const docValue = editData[doc.key];
                                if (user?.rol === 'tutor' && (doc.key === 'exoneracion_nombre' || doc.key === 'titulo_nombre' || doc.key === 'delincuencia_nombre')) return null;
                                if (!docValue && !isEditing) return null;

                                return (
                                    <div key={doc.key} className="doc-card" onClick={() => {
                                        const base64Key = doc.key.replace('_nombre', '_base64');
                                        const base64Data = editData[base64Key];
                                        if (base64Data && base64Data.startsWith('data:image/')) {
                                            Swal.fire({ title: doc.label, imageUrl: base64Data, width: '600px' });
                                        } else if (docValue && docValue !== 'No adjuntado') {
                                            Swal.fire({ icon: 'info', title: doc.label, text: `Archivo: ${docValue}` });
                                        }
                                    }}>
                                        <div style={{ color: '#ff1e38' }}>{doc.icon}</div>
                                        <p style={{ fontWeight: 800, margin: '5px 0' }}>{doc.label}</p>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>{docValue || 'Pendiente'}</p>
                                    </div>
                                );
                            })}
                            
                            {isEditing && (
                                <div className="doc-card" style={{ justifyContent: 'center' }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff1e38" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    <p style={{ fontWeight: 700, margin: 0, color: '#64748b' }}>Cargar Nuevo</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FormPerfil;
