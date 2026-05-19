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
    const [expandedSection, setExpandedSection] = useState<string>('personal');
    const [newPassword, setNewPassword] = useState<string>('');
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
                    const mappedData = { ...data, correoElectronico: data.correo_electronico || data.correoElectronico, fechaNacimiento: data.fecha_nacimiento || data.fechaNacimiento, aniosExperiencia: data.anios_experiencia || data.aniosExperiencia, experiencia: data.experiencia || data.experiencia_previa || data.experiencia, emergenciaNombre: data.emergencia_nombre || data.emergenciaNombre, emergenciaTelefono: data.emergencia_telefono || data.emergenciaTelefono, proximosRetos: data.proximos_retos || data.proximosRetos, equipo: data.equipo || data.disciplina || data.equipo };
                    setEditData((prev: any) => ({ ...prev, ...mappedData }));
                    
                    if (user.rol === 'atleta' && data.tutorVinculado) setLinkedUser(await getTutorById(data.tutorVinculado));
                    else if (user.rol === 'tutor' && data.atletaVinculado) setLinkedUser(await getAtletaById(data.atletaVinculado));
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
            if (finalData.avatarUrl) localStorage.setItem(`avatar_${user.id}`, finalData.avatarUrl);
            if (setRefreshUser) setRefreshUser(finalData);
            setIsEditing(false);
            Swal.fire({ icon: 'success', title: '¡Guardado!', timer: 1800, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar.' });
        }
    };

    const handlePasswordChange = async () => {
        if (!newPassword || newPassword.length < 5) {
            Swal.fire({ icon: 'error', title: 'Contraseña muy corta', text: 'Mínimo 5 caracteres.' }); return;
        }
        const confirm = await Swal.fire({ title: '⚠️ ¿Cambiar contraseña?', text: '¿Estás seguro?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, cambiar', cancelButtonText: 'Cancelar' });
        if (!confirm.isConfirmed) return;

        try {
            Swal.fire({ title: 'Actualizando...', didOpen: () => Swal.showLoading() });
            const updated = { ...user, password: newPassword };
            await updateUsuario(user.id, updated);
            localStorage.setItem('usuarioSesion', JSON.stringify(updated));
            setNewPassword('');
            Swal.fire({ icon: 'success', title: '¡Actualizada!', timer: 2500, showConfirmButton: false });
        } catch (e) { Swal.fire({ icon: 'error', title: 'Error', text: 'Fallo al actualizar.' }); }
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

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? '' : section);
    };

    const iniciales = user?.nombre ? user.nombre.slice(0, 2).toUpperCase() : '?';
    const badge = rolLabel(user?.rol, user?.rolUsuario);

    const documentosList = [
        { key: 'cedula_nombre', label: 'Cédula Identidad', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"/><path d="M7 12h.01"/><path d="M11 12h6"/><path d="M11 16h6"/></svg> },
    ];

    const chevronIcon = <svg className="accordion-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>;

    return (
        <div className="profile-layout-container">
            
            {/* ── ACTION BAR ── */}
            <div className="id-actions-bar">
                <button className="btn-id-action btn-id-back" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M5 12L12 19M5 12L12 5"/></svg>
                    Volver
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {!isEditing ? (
                        <button className="btn-id-action btn-id-edit" onClick={() => setIsEditing(true)}>✎ Modo Edición</button>
                    ) : (
                        <>
                            <button className="btn-id-action btn-id-cancel" onClick={() => { setIsEditing(false); setEditData({ ...user }); setAvatarPreview(user.avatarUrl); }}>Cancelar</button>
                            <button className="btn-id-action btn-id-save" onClick={handleSave}>Guardar Cambios</button>
                        </>
                    )}
                </div>
            </div>

            {/* ── DIGITAL ID CARD (CREDENTIAL) ── */}
            <div className="digital-id-wrapper">
                <div className="digital-id-card">
                    <div className="id-lanyard-hole"></div>
                    
                    <div className="id-card-header">
                        <h2 className="id-org-title">Olimpiadas Especiales Costa Rica</h2>
                        
                        <div className="id-avatar-container" onClick={() => fileInputRef.current?.click()}>
                            <div className="id-avatar-inner">
                                {avatarPreview ? <img src={avatarPreview} alt="avatar" /> : iniciales}
                            </div>
                            <div className="avatar-overlay">Cambiar</div>
                            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>

                    <div className="id-card-body">
                        {isEditing ? (
                            <input name="nombre" value={editData.nombre || ''} onChange={handleChange} className="form-input" style={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 900, marginBottom: '10px' }} />
                        ) : (
                            <h1 className="id-name">{user?.nombre || ''} {user?.apellido || ''}</h1>
                        )}
                        <div className="id-role">{badge}</div>

                        <div className="id-details-grid">
                            <div className="id-detail-item">
                                <span className="id-detail-label">Cédula</span>
                                <span className="id-detail-val">{user?.cedula || 'N/A'}</span>
                            </div>
                            <div className="id-detail-item">
                                <span className="id-detail-label">Nacimiento</span>
                                <span className="id-detail-val">{user?.fechaNacimiento || 'N/A'}</span>
                            </div>
                            <div className="id-detail-item">
                                <span className="id-detail-label">País</span>
                                <span className="id-detail-val">{user?.pais || 'N/A'}</span>
                            </div>
                            <div className="id-detail-item">
                                <span className="id-detail-label">Afiliación</span>
                                <span className="id-detail-val" style={{ color: '#10b981' }}>Activo</span>
                            </div>
                        </div>

                        <div className="id-barcode">*{user?.id}*</div>
                        <div className="id-system-number">ID: OECR-{user?.id}</div>
                    </div>
                </div>
            </div>

            {/* ── ACCORDION DETAILS ── */}
            <div className="accordion-wrapper">
                
                {/* Datos Personales */}
                <div className={`accordion-item ${expandedSection === 'personal' ? 'expanded' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('personal')}>
                        <h3 className="accordion-title">
                            <div className="accordion-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
                            Datos Personales & Contacto
                        </h3>
                        {chevronIcon}
                    </div>
                    <div className="accordion-content">
                        <div className="acc-form-grid">
                            <Field label="Nombre Completo" name="nombre" value={editData.nombre} editing={isEditing} onChange={handleChange} />
                            <Field label="Cédula" name="cedula" value={editData.cedula} editing={isEditing} onChange={handleChange} />
                            <Field label="Nacimiento" name="fechaNacimiento" type="date" value={editData.fechaNacimiento} editing={isEditing} onChange={handleChange} />
                            <Field label="Teléfono" name="telefono" value={editData.telefono} editing={isEditing} onChange={handleChange} />
                            <div style={{ gridColumn: '1 / -1' }}>
                                <Field label="Correo Electrónico" name="correoElectronico" value={editData.correoElectronico} editing={isEditing} onChange={handleChange} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <Field label="Dirección Exacta" name="direccion" value={editData.direccion} editing={isEditing} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Historial Médico */}
                {user?.rol !== 'usuario' && (
                    <div className={`accordion-item ${expandedSection === 'medico' ? 'expanded' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSection('medico')}>
                            <h3 className="accordion-title">
                                <div className="accordion-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                                Historial Médico de Emergencia
                            </h3>
                            {chevronIcon}
                        </div>
                        <div className="accordion-content">
                            <div className="acc-form-grid">
                                <Field label="Tipo de Discapacidad" name="tipoDiscapacidad" value={editData.tipoDiscapacidad} editing={isEditing} onChange={handleChange} />
                                <Field label="Alergias Conocidas" name="alergias" value={editData.alergias || (Array.isArray(editData.tiposAlergia) ? editData.tiposAlergia.join(', ') : '')} editing={isEditing} onChange={handleChange} />
                            </div>
                            <div className="acc-form-grid single" style={{ marginTop: '20px' }}>
                                <Field label="Condiciones Adicionales" name="condicionesMedicasText" value={editData.condicionesMedicasText || (Array.isArray(editData.condicionesMedicas) ? editData.condicionesMedicas.join(', ') : '')} editing={isEditing} onChange={handleChange} />
                                <Field label="Medicamentos Recetados" name="medicamentos" value={typeof editData.medicamentos === 'string' ? editData.medicamentos : (Array.isArray(editData.medicamentos) ? editData.medicamentos.join(', ') : '')} editing={isEditing} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Ficha Deportiva */}
                {user?.rol !== 'usuario' && (
                    <div className={`accordion-item ${expandedSection === 'deporte' ? 'expanded' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSection('deporte')}>
                            <h3 className="accordion-title">
                                <div className="accordion-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg></div>
                                Ficha Deportiva & Oficial
                            </h3>
                            {chevronIcon}
                        </div>
                        <div className="accordion-content">
                            <div className="acc-form-grid">
                                <Field label="Disciplina / Equipo" name="equipo" value={editData.equipo || editData.disciplina} editing={isEditing} onChange={handleChange} />
                                <Field label="Años de Experiencia" name="experiencia" value={editData.experiencia || editData.aniosExperiencia || editData.disciplina} editing={isEditing} onChange={handleChange} />
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Field label="Próximos Retos" name="proximosRetos" value={editData.proximosRetos} editing={isEditing} onChange={handleChange} />
                                </div>
                            </div>
                            {linkedUser && (
                                <div style={{ marginTop: '20px', padding: '15px', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>
                                        {user?.rol === 'atleta' ? 'Tutor asignado' : 'Atleta vinculado'}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                                        {linkedUser.nombre} {linkedUser.apellido || ''}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Documentos */}
                {user?.rol !== 'usuario' && (
                    <div className={`accordion-item ${expandedSection === 'docs' ? 'expanded' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSection('docs')}>
                            <h3 className="accordion-title">
                                <div className="accordion-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
                                Documentos Adjuntos
                            </h3>
                            {chevronIcon}
                        </div>
                        <div className="accordion-content">
                            <div className="doc-grid">
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
                                            <div style={{ color: '#e60000' }}>{doc.icon}</div>
                                            <p style={{ fontWeight: 800, margin: '5px 0' }}>{doc.label}</p>
                                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>{docValue || 'Pendiente'}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Seguridad */}
                <div className={`accordion-item ${expandedSection === 'seguridad' ? 'expanded' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('seguridad')}>
                        <h3 className="accordion-title">
                            <div className="accordion-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                            Seguridad
                        </h3>
                        {chevronIcon}
                    </div>
                    <div className="accordion-content">
                        <div className="form-group" style={{ marginBottom: '20px', maxWidth: '400px' }}>
                            <label className="form-label">Nueva Contraseña</label>
                            <input type="password" className="form-input" placeholder="Escribe tu nueva contraseña..." value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        </div>
                        <button className="btn-id-action btn-id-edit" onClick={handlePasswordChange}>Actualizar Contraseña</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default FormPerfil;
