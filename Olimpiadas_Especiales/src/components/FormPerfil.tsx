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

/* Form Field Component */
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
                <select name={name} value={value || ''} onChange={onChange} className="form-select">
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            ) : type === 'date' ? (
                <DatePickerInput name={name} value={value || ''} onChange={onChange as any} />
            ) : (
                <input name={name} type={type} value={value || ''} onChange={onChange} className="form-input" />
            )
        ) : (
            <div className="form-control-static">{value || '—'}</div>
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
    const [activeTab, setActiveTab] = useState<string>('resumen');
    const [newPassword, setNewPassword] = useState<string>('');
    const [linkedUser, setLinkedUser] = useState<any>(null);
    const [loadingRoleData, setLoadingRoleData] = useState<boolean>(false);

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
            setLoadingRoleData(true);
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
                console.warn("No se encontró registro extendido para", user.rol);
            } finally {
                setLoadingRoleData(false);
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
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar.' });
        }
    };

    const handlePasswordChange = async () => {
        if (!newPassword || newPassword.length < 5) {
            Swal.fire({ icon: 'error', title: 'Contraseña muy corta', text: 'La nueva contraseña debe tener al menos 5 caracteres.', confirmButtonColor: '#ff1e38' });
            return;
        }

        const confirm = await Swal.fire({
            title: '⚠️ ¿Cambiar contraseña?',
            text: 'Tu contraseña cambiará de inmediato. ¿Estás seguro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff1e38',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirm.isConfirmed) return;

        try {
            Swal.fire({ title: 'Actualizando contraseña...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            const updated = { ...user, password: newPassword };
            await updateUsuario(user.id, updated);
            localStorage.setItem('usuarioSesion', JSON.stringify(updated));
            setNewPassword('');
            Swal.fire({ icon: 'success', title: '¡Contraseña actualizada!', timer: 2500, showConfirmButton: false });
        } catch (e) { 
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar la contraseña.', confirmButtonColor: '#ff1e38' }); 
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
                    Swal.fire({ icon: 'success', title: '¡Imagen seleccionada!', text: 'Se guardará al actualizar el perfil.', timer: 1500, showConfirmButton: false });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const iniciales = user?.nombre ? user.nombre.slice(0, 2).toUpperCase() : '?';
    const badge = rolLabel(user?.rol, user?.rolUsuario);

    const tabs = [
        { id: 'resumen', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: 'Vista General' },
        { id: 'personal', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, label: 'Datos Personales' },
        ...(user?.rol !== 'usuario' ? [
            { id: 'medico', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, label: 'Médico' },
            { id: 'deportivo', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>, label: 'Ficha' },
            { id: 'documentos', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>, label: 'Docs' }
        ] : []),
        { id: 'seguridad', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, label: 'Seguridad' }
    ];

    const documentosList = [
        { key: 'cedula_nombre', label: 'Cédula Identidad', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"/><path d="M7 12h.01"/><path d="M11 12h6"/><path d="M11 16h6"/></svg> },
    ];

    return (
        <div className="profile-layout-container">
            {/* ── ACTION BAR (ABOVE HERO) ── */}
            <div className="profile-top-bar">
                <button className="btn-profile-back" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12L12 19M5 12L12 5"/></svg>
                    Volver
                </button>

                <div className="profile-edit-actions">
                    {!isEditing ? (
                        <button className="btn-edit-mode" onClick={() => setIsEditing(true)}>✎ Editar Perfil</button>
                    ) : (
                        <>
                            <button className="btn-cancel-mode" onClick={() => { setIsEditing(false); setEditData({ ...user }); setAvatarPreview(user.avatarUrl); }}>Cancelar</button>
                            <button className="btn-save-mode" onClick={handleSave}>Guardar Cambios</button>
                        </>
                    )}
                </div>
            </div>

            {/* ── HERO BANNER & HEADER ── */}
            <div className="profile-hero-section">
                <div className="profile-banner"></div>
                
                <div className="profile-header-content">
                    <div className="profile-header-avatar" onClick={() => fileInputRef.current?.click()} title="Cambiar foto">
                        {avatarPreview ? <img src={avatarPreview} alt="avatar" /> : iniciales}
                        <div className="avatar-edit-overlay">Editar</div>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                    </div>
                    
                    <h1 className="profile-header-name">
                        {isEditing ? (
                            <input name="nombre" value={editData.nombre || ''} onChange={handleChange} className="form-input" style={{ width: '280px', textAlign: 'center', fontSize: '1.8rem', fontWeight: 900 }} />
                        ) : (
                            `${user?.nombre || ''} ${user?.apellido || ''}`
                        )}
                    </h1>
                    <span className="profile-header-role">{badge}</span>
                    <p className="profile-header-meta">ID: #{user?.id} &nbsp;|&nbsp; {user?.correoElectronico}</p>
                </div>

                {/* ── HORIZONTAL NAVIGATION TABS ── */}
                <div className="profile-horizontal-tabs">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            className={`profile-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── DYNAMIC CONTENT AREA ── */}
            <div className="profile-content-area">
                <div className="content-card">
                    
                    {/* TAB: VISTA GENERAL (RESUMEN) */}
                    {activeTab === 'resumen' && (
                        <div className="tab-pane-content">
                            <div className="content-section-header">
                                <h2 className="content-section-title">Vista General</h2>
                                <p className="content-section-desc">Un resumen rápido de tu cuenta en la plataforma.</p>
                            </div>
                            
                            <div className="profile-form-grid">
                                <div className="form-group">
                                    <label className="form-label">Estado de la cuenta</label>
                                    <div className="form-control-static" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
                                        Cuenta Activa
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Rol principal</label>
                                    <div className="form-control-static">{badge}</div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Miembro desde</label>
                                    <div className="form-control-static">{user?.fecha_registro ? new Date(user.fecha_registro).toLocaleDateString() : 'Desconocido'}</div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Última actualización</label>
                                    <div className="form-control-static">{user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Reciente'}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: DATOS PERSONALES */}
                    {activeTab === 'personal' && (
                        <div className="tab-pane-content">
                            <div className="content-section-header">
                                <h2 className="content-section-title">Datos Personales</h2>
                                <p className="content-section-desc">Información básica de identificación y contacto.</p>
                            </div>
                            
                            <div className="profile-form-grid">
                                <Field label="Nombre Completo" name="nombre" value={editData.nombre} editing={isEditing} onChange={handleChange} />
                                <Field label="Número de Cédula" name="cedula" value={editData.cedula} editing={isEditing} onChange={handleChange} />
                                <Field label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={editData.fechaNacimiento} editing={isEditing} onChange={handleChange} />
                                <Field label="Sexo" name="genero" value={editData.genero} editing={isEditing} onChange={handleChange}
                                    options={[{value:'',label:'— Seleccionar —'},{value:'Masculino',label:'Masculino'},{value:'Femenino',label:'Femenino'},{value:'Prefiero no indicar',label:'Prefiero no indicar'}]} />
                                <Field label="País de Residencia" name="pais" value={editData.pais} editing={isEditing} onChange={handleChange} />
                                <Field label="Teléfono" name="telefono" value={editData.telefono} editing={isEditing} onChange={handleChange} />
                            </div>
                            <div className="profile-form-grid single-col" style={{ marginTop: '24px' }}>
                                <Field label="Dirección Exacta" name="direccion" value={editData.direccion} editing={isEditing} onChange={handleChange} />
                                <Field label="Correo Electrónico" name="correoElectronico" value={editData.correoElectronico} editing={isEditing} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    {/* TAB: HISTORIAL MÉDICO */}
                    {activeTab === 'medico' && user?.rol !== 'usuario' && (
                        <div className="tab-pane-content">
                            <div className="content-section-header">
                                <h2 className="content-section-title">Historial Médico</h2>
                                <p className="content-section-desc">Información confidencial para emergencias y organización deportiva.</p>
                            </div>

                            <div className="medical-alert-box">
                                <strong style={{ display: 'block', marginBottom: '8px' }}>⚠️ Importante:</strong>
                                Por favor mantén actualizada tu información de medicamentos y alergias para garantizar tu seguridad.
                            </div>

                            <div className="profile-form-grid">
                                <Field label="Tipo de Discapacidad" name="tipoDiscapacidad" value={editData.tipoDiscapacidad} editing={isEditing} onChange={handleChange} />
                                <Field label="Alergias Conocidas" name="alergias" value={editData.alergias || (Array.isArray(editData.tiposAlergia) ? editData.tiposAlergia.join(', ') : '')} editing={isEditing} onChange={handleChange} />
                            </div>
                            <div className="profile-form-grid single-col" style={{ marginTop: '24px' }}>
                                <Field label="Condiciones Adicionales" name="condicionesMedicasText" value={editData.condicionesMedicasText || (Array.isArray(editData.condicionesMedicas) ? editData.condicionesMedicas.join(', ') : '')} editing={isEditing} onChange={handleChange} />
                                <Field label="Medicamentos Recetados" name="medicamentos" value={typeof editData.medicamentos === 'string' ? editData.medicamentos : (Array.isArray(editData.medicamentos) ? editData.medicamentos.join(', ') : '')} editing={isEditing} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    {/* TAB: FICHA DEPORTIVA */}
                    {activeTab === 'deportivo' && user?.rol !== 'usuario' && (
                        <div className="tab-pane-content">
                            <div className="content-section-header">
                                <h2 className="content-section-title">Ficha Deportiva</h2>
                                <p className="content-section-desc">Registro de actividades y disciplina.</p>
                            </div>

                            <div className="profile-form-grid">
                                <Field label="Disciplina Principal" name="equipo" value={editData.equipo || editData.disciplina} editing={isEditing} onChange={handleChange} />
                                <Field label="Años de Experiencia" name="experiencia" value={editData.experiencia || editData.aniosExperiencia || editData.disciplina} editing={isEditing} onChange={handleChange} />
                            </div>
                            <div className="profile-form-grid single-col" style={{ marginTop: '24px' }}>
                                <Field label="Próximos Retos Oficiales" name="proximosRetos" value={editData.proximosRetos} editing={isEditing} onChange={handleChange} />
                            </div>

                            {linkedUser && (
                                <div style={{ marginTop: '30px', padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ fontSize: '1rem', margin: '0 0 16px 0', color: '#0f172a' }}>Vinculación Oficial</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ff1e38', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 'bold' }}>
                                            {linkedUser.nombre?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>
                                                {user?.rol === 'atleta' ? 'Tutor asignado' : 'Atleta vinculado'}
                                            </p>
                                            <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                                                {linkedUser.nombre} {linkedUser.apellido || ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: DOCUMENTOS */}
                    {activeTab === 'documentos' && user?.rol !== 'usuario' && (
                        <div className="tab-pane-content">
                            <div className="content-section-header">
                                <h2 className="content-section-title">Documentos</h2>
                                <p className="content-section-desc">Gestiona tus documentos de identidad y certificaciones.</p>
                            </div>

                            <div className="docs-layout-grid">
                                {documentosList.map(doc => {
                                    const docValue = editData[doc.key];
                                    if (user?.rol === 'tutor' && (doc.key === 'exoneracion_nombre' || doc.key === 'titulo_nombre' || doc.key === 'delincuencia_nombre')) return null;
                                    if (!docValue && !isEditing) return null;

                                    return (
                                        <div key={doc.key} className="doc-upload-card" onClick={() => {
                                            const base64Key = doc.key.replace('_nombre', '_base64');
                                            const base64Data = editData[base64Key];
                                            
                                            if (base64Data) {
                                                if (base64Data.startsWith('data:image/')) {
                                                    Swal.fire({ title: doc.label, imageUrl: base64Data, imageAlt: doc.label, confirmButtonText: 'Cerrar', confirmButtonColor: '#ff1e38', width: '600px' });
                                                } else if (base64Data.startsWith('data:application/pdf')) {
                                                    Swal.fire({ title: doc.label, html: `<iframe src="${base64Data}" width="100%" height="500px" style="border:none; border-radius: 8px;"></iframe>`, confirmButtonText: 'Cerrar', confirmButtonColor: '#ff1e38', width: '80%' });
                                                } else {
                                                    Swal.fire({ icon: 'info', text: 'Documento adjuntado.', confirmButtonColor: '#ff1e38' });
                                                }
                                            } else if (docValue && docValue !== 'No adjuntado') {
                                                Swal.fire({ icon: 'info', title: doc.label, text: `Archivo: ${docValue}`, confirmButtonColor: '#ff1e38' });
                                            } else {
                                                if (!isEditing) Swal.fire({ icon: 'info', title: doc.label, text: 'No adjuntado todavía.', confirmButtonColor: '#ff1e38' });
                                            }
                                        }}>
                                            <div style={{ color: '#ff1e38', marginBottom: '16px' }}>{doc.icon}</div>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: '0 0 8px 0' }}>{doc.label}</p>
                                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, wordBreak: 'break-all' }}>{docValue || 'Pendiente'}</p>
                                        </div>
                                    );
                                })}
                                
                                {isEditing && (
                                    <div className="doc-upload-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <div style={{ color: '#ff1e38', marginBottom: '12px' }}>
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', margin: 0 }}>Cargar Nuevo</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB: SEGURIDAD */}
                    {activeTab === 'seguridad' && (
                        <div className="tab-pane-content" style={{ maxWidth: '500px' }}>
                            <div className="content-section-header">
                                <h2 className="content-section-title">Seguridad</h2>
                                <p className="content-section-desc">Administra tu contraseña de acceso.</p>
                            </div>

                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label className="form-label">Nueva Contraseña</label>
                                <input 
                                    type="password" 
                                    className="form-input" 
                                    placeholder="Escribe tu nueva contraseña..." 
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                            </div>
                            
                            <button className="btn-edit-mode" onClick={handlePasswordChange}>
                                Actualizar Contraseña
                            </button>
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    );
}

export default FormPerfil;
