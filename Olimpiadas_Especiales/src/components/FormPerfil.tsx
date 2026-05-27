import React, { useState, useEffect, useRef } from 'react';
import DatePickerInput from './DatePickerInput';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { updateAtleta, getAtletaById } from '../services/ServicesAtletas';
import { updateTutor, getTutorById } from '../services/ServicesTutores';
import { updateEntrenador, getEntrenadorById } from '../services/ServicesEntrenadores';
import { updateVoluntario, getVoluntarioById } from '../services/ServicesVoluntarios';
import { updateUsuario } from '../services/ServicesUsuarios';
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

const getRolName = (user: any) => {
    if (user?.rol_id === 1) return 'admin';
    if (user?.rol_id === 2 || user?.rol === 'atleta') return 'atleta';
    if (user?.rol_id === 3 || user?.rol === 'entrenador') return 'entrenador';
    if (user?.rol_id === 4 || user?.rol === 'voluntario') return 'voluntario';
    if (user?.rol_id === 5 || user?.rol === 'tutor') return 'tutor';
    return 'usuario';
};

const rolLabel = (user: any) => {
    const rol = getRolName(user);
    if (rol === 'atleta') return 'Atleta Oficial';
    if (rol === 'entrenador') return 'Entrenador';
    if (rol === 'tutor') return 'Tutor / Familiar';
    if (rol === 'voluntario') return 'Voluntario';
    if (rol === 'admin') return 'Administrador';
    return 'Usuario General';
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
    const [newPassword, setNewPassword] = useState<string>('');
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
            const actualRol = getRolName(user);
            if (!user?.id || actualRol === 'usuario' || actualRol === 'admin') return;
            try {
                const roleId = `${actualRol}_${user.id}`;
                let data: any = null;
                if (actualRol === 'atleta') data = await getAtletaById(roleId);
                else if (actualRol === 'entrenador') data = await getEntrenadorById(roleId);
                else if (actualRol === 'voluntario') data = await getVoluntarioById(roleId);
                else if (actualRol === 'tutor') data = await getTutorById(roleId);

                if (data) {
                    // Format nested arrays into readable text
                    const alergiasArr = Array.isArray(data.alergias) ? data.alergias : [];
                    const condicionesArr = Array.isArray(data.condiciones) ? data.condiciones : [];
                    const medicamentosArr = Array.isArray(data.medicamentos) ? data.medicamentos : [];
                    const dispositivosArr = Array.isArray(data.dispositivos) ? data.dispositivos : [];

                    // Boolean afecciones to text list (atleta)
                    const afeccionesMap: Record<string, string> = {
                        afeccion_cardiaca: 'Afección Cardíaca',
                        asma: 'Asma',
                        diabetes: 'Diabetes',
                        disc_visual: 'Discapacidad Visual',
                        disc_auditiva: 'Discapacidad Auditiva',
                        trastorno_hemorragico: 'Trastorno Hemorrágico',
                        medico_limito_deportes: 'Médico limitó deportes',
                        epilepsia_convulsivo: 'Epilepsia/Convulsiones',
                        anemia_depranocitica: 'Anemia Depranocitica',
                        conmocion_cerebral: 'Conmoción Cerebral',
                        afecciones_mentales: 'Afecciones Mentales',
                    };
                    const afeccionesActivas = Object.entries(afeccionesMap)
                        .filter(([key]) => data[key] === true || data[key] === 1)
                        .map(([, label]) => label);

                    const mappedData = { 
                        ...data, 
                        correoElectronico: data.correo_electronico || data.correoElectronico, 
                        fechaNacimiento: data.fecha_nacimiento || data.fechaNacimiento, 
                        aniosExperiencia: data.anios_experiencia || data.aniosExperiencia, 
                        experiencia: data.experiencia || data.anios_experiencia || data.experiencia, 
                        emergenciaNombre: data.emergencia_nombre || data.emergenciaNombre, 
                        emergenciaTelefono: data.emergencia_telefono || data.emergenciaTelefono, 
                        proximosRetos: data.proximos_retos || data.proximosRetos, 
                        equipo: data.equipo || data.disciplina,
                        // Formatted text fields
                        alergiasText: alergiasArr.length > 0
                            ? alergiasArr.map((a: any) => a.tipo_alergia || a.alergia || a.nombre || String(a)).join(', ')
                            : (data.alergias_graves ? 'Alergias graves reportadas' : 'Sin alergias registradas'),
                        condicionesText: condicionesArr.length > 0
                            ? condicionesArr.map((c: any) => c.condicion || c.nombre || String(c)).join(', ')
                            : (afeccionesActivas.length > 0 ? afeccionesActivas.join(', ') : 'Sin condiciones registradas'),
                        medicamentosText: medicamentosArr.length > 0
                            ? medicamentosArr.map((m: any) => {
                                const nombre = m.nombre || m.medicamento || String(m);
                                const dosis = m.dosis ? ` (${m.dosis}${m.frecuencia ? ' - ' + m.frecuencia : ''})` : '';
                                return nombre + dosis;
                              }).join(', ')
                            : (data.toma_medicamentos || 'Sin medicamentos registrados'),
                        dispositivosText: dispositivosArr.length > 0
                            ? dispositivosArr.map((d: any) => `${d.nombre} (${d.tipo})`).join(', ')
                            : 'Sin dispositivos registrados',
                        // Health details for entrenador
                        afeccionSaludText: data.afeccion_salud ? (data.detalle_salud || 'Sí') : 'No',
                        // Voluntario specific
                        otra_area: data.otra_area || null,
                        disponibilidad: data.disponibilidad || null,
                        experiencia_previa: data.experiencia_previa || null,
                        // Tutor specific
                        relacion_con_atleta: data.relacion_con_atleta || null,
                        nombre_atleta: data.nombre_atleta || null,
                        ocupacion: data.ocupacion || null,
                        motivacion: data.motivacion || null,
                        documentosOficiales: Array.isArray(data.documentos) ? data.documentos : []
                    };
                    setEditData((prev: any) => ({ ...prev, ...mappedData }));
                    
                }
            } catch { console.warn("No se encontró registro extendido"); }
        };
        fetchRoleData();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEditData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        try {
            Swal.fire({ title: 'Guardando...', didOpen: () => Swal.showLoading() });
            const actualRol = getRolName(user);
            let updatedRecord;
            const roleId = `${actualRol}_${user.id}`;
            if (actualRol === 'atleta') updatedRecord = await updateAtleta(roleId, editData);
            else if (actualRol === 'tutor') updatedRecord = await updateTutor(roleId, editData);
            else if (actualRol === 'entrenador') updatedRecord = await updateEntrenador(roleId, editData);
            else if (actualRol === 'voluntario') updatedRecord = await updateVoluntario(roleId, editData);
            else if (actualRol === 'admin') {
                updatedRecord = await ServicesAdmin.updateProfile({
                    nombre: editData.nombre,
                    correoElectronico: editData.correoElectronico ?? editData.email,
                    passwordActual: editData.passwordActual,
                    passwordNuevo: editData.passwordNuevo
                });
            }
            
            await updateUsuario(user.id, editData);
            
            const finalData = { ...editData, ...(updatedRecord || {}) };
            localStorage.setItem('usuarioSesion', JSON.stringify(finalData));
            if (finalData.avatarUrl) localStorage.setItem(`avatar_${user.id}`, finalData.avatarUrl);
            if (setRefreshUser) setRefreshUser(finalData);
            setIsEditing(false);
            Swal.fire({ icon: 'success', title: '¡Guardado!', timer: 1800, showConfirmButton: false });
        } catch { Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar.' }); }
    };

    const handlePasswordChange = async () => {
        if (!newPassword || newPassword.length < 5) {
            Swal.fire({ icon: 'error', title: 'Contraseña muy corta', text: 'Mínimo 5 caracteres.' }); return;
        }
        const confirm = await Swal.fire({ title: '¿Cambiar contraseña?', text: '¿Estás seguro?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, cambiar', cancelButtonText: 'Cancelar' });
        if (!confirm.isConfirmed) return;

        try {
            Swal.fire({ title: 'Actualizando...', didOpen: () => Swal.showLoading() });
            const updated = { ...user, password: newPassword };
            await updateUsuario(user.id, updated);
            localStorage.setItem('usuarioSesion', JSON.stringify(updated));
            setNewPassword('');
            Swal.fire({ icon: 'success', title: '¡Actualizada!', timer: 2500, showConfirmButton: false });
        } catch { Swal.fire({ icon: 'error', title: 'Error', text: 'Fallo al actualizar.' }); }
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
    const badge = rolLabel(user);
    const actualRol = getRolName(user);

    const documentosList = [
        { key: 'cedula_nombre', label: 'Cédula Identidad', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"/><path d="M7 12h.01"/><path d="M11 12h6"/><path d="M11 16h6"/></svg> },
    ];

    return (
        <div className="profile-layout-container">
            
            {/* ── LEFT FIXED PANEL ── */}
            <div className="split-left-panel">
                <button className="btn-split-back" onClick={() => navigate(-1)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M5 12L12 19M5 12L12 5"/></svg>
                    Volver
                </button>

                <div className="split-avatar-container" onClick={() => fileInputRef.current?.click()}>
                    {avatarPreview ? <img src={avatarPreview} alt="avatar" /> : iniciales}
                    <div className="split-avatar-overlay">Cambiar Foto</div>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                </div>

                {isEditing ? (
                    <input name="nombre" value={editData.nombre || ''} onChange={handleChange} className="form-input" style={{ textAlign: 'center', marginBottom: '10px' }} />
                ) : (
                    <h1 className="split-name">{user?.nombre || ''} {user?.apellido || ''}</h1>
                )}
                
                <span className="split-role">{badge}</span>
                {editData.equipo && !isEditing && (
                    <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginTop: '5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {editData.equipo}
                    </span>
                )}
                {isEditing && (actualRol === 'atleta' || actualRol === 'entrenador' || actualRol === 'voluntario') && (
                    <div style={{ marginTop: '10px', padding: '0 20px' }}>
                        <input name="equipo" value={editData.equipo || ''} onChange={handleChange} className="form-input" placeholder="Disciplina / Equipo" style={{ textAlign: 'center', fontSize: '0.9rem' }} />
                    </div>
                )}

                <div className="split-quick-stats">
                    <div className="split-stat-row">
                        <span className="split-stat-label">ID Sistema</span>
                        <span className="split-stat-val">#{user?.id}</span>
                    </div>
                    <div className="split-stat-row">
                        <span className="split-stat-label">Estado</span>
                        <span className="split-stat-val" style={{ color: '#10b981' }}>Activo</span>
                    </div>
                    <div className="split-stat-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
                        <span className="split-stat-label">Correo Electrónico</span>
                        <span className="split-stat-val" style={{ fontSize: '0.85rem' }}>{user?.correoElectronico}</span>
                    </div>
                </div>

                <div className="split-actions">
                    {!isEditing ? (
                        <button className="btn-split btn-split-edit" onClick={() => setIsEditing(true)}>Editar Perfil</button>
                    ) : (
                        <>
                            <button className="btn-split btn-split-save" onClick={handleSave}>Guardar Cambios</button>
                            <button className="btn-split btn-split-cancel" onClick={() => { setIsEditing(false); setEditData({ ...user }); setAvatarPreview(user.avatarUrl); }}>Cancelar Edición</button>
                        </>
                    )}
                </div>
            </div>

            {/* ── RIGHT SCROLLABLE PANEL ── */}
            <div className="split-right-panel">
                
                {/* Datos Personales */}
                <div className="split-section">
                    <div className="split-section-header">
                        <div className="split-section-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                        <h2 className="split-section-title">Datos Personales</h2>
                    </div>
                    <div className="split-form-grid">
                        <Field label="Nombre Completo" name="nombre" value={editData.nombre} editing={isEditing} onChange={handleChange} />
                        <Field label="Número de Cédula" name="cedula" value={editData.cedula} editing={isEditing} onChange={handleChange} />
                        <Field label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={editData.fechaNacimiento} editing={isEditing} onChange={handleChange} />
                        <Field label="Teléfono de Contacto" name="telefono" value={editData.telefono} editing={isEditing} onChange={handleChange} />
                        <div style={{ gridColumn: '1 / -1' }}>
                            <Field label="Dirección Exacta" name="direccion" value={editData.direccion} editing={isEditing} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Historial Médico - Atleta y Voluntario */}
                {(actualRol === 'atleta') && (
                    <div className="split-section">
                        <div className="split-section-header">
                            <div className="split-section-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                            <h2 className="split-section-title">Historial Médico</h2>
                        </div>
                        <div className="split-form-grid">
                            <Field label="Alergias Conocidas" name="alergiasText" value={editData.alergiasText} editing={isEditing} onChange={handleChange} />
                            <Field label="Dispositivos de Apoyo" name="dispositivosText" value={editData.dispositivosText} editing={isEditing} onChange={handleChange} />
                            <div style={{ gridColumn: '1 / -1' }}>
                                <Field label="Condiciones Médicas" name="condicionesText" value={editData.condicionesText} editing={isEditing} onChange={handleChange} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <Field label="Medicamentos Recetados" name="medicamentosText" value={editData.medicamentosText} editing={isEditing} onChange={handleChange} />
                            </div>
                            {editData.especificacion_dietetico && (
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Field label="Requerimiento Dietético" name="especificacion_dietetico" value={editData.especificacion_dietetico} editing={isEditing} onChange={handleChange} />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Salud Entrenador */}
                {actualRol === 'entrenador' && (
                    <div className="split-section">
                        <div className="split-section-header">
                            <div className="split-section-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                            <h2 className="split-section-title">Historial de Salud</h2>
                        </div>
                        <div className="split-form-grid">
                            <Field label="Afección de Salud" name="afeccionSaludText" value={editData.afeccionSaludText} editing={isEditing} onChange={handleChange} />
                            <Field label="Certificaciones" name="certificaciones" value={editData.certificaciones} editing={isEditing} onChange={handleChange} />
                        </div>
                    </div>
                )}

                {/* Ficha Deportiva - Solo Atleta y Entrenador */}
                {(actualRol === 'atleta' || actualRol === 'entrenador') && (
                    <div className="split-section">
                        <div className="split-section-header">
                            <div className="split-section-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg></div>
                            <h2 className="split-section-title">Ficha Deportiva</h2>
                        </div>
                        <div className="split-form-grid">
                            <Field label="Años de Experiencia" name="aniosExperiencia" value={editData.aniosExperiencia || editData.experiencia} editing={isEditing} onChange={handleChange} />
                            {editData.certificaciones && actualRol !== 'entrenador' && (
                                <Field label="Certificaciones" name="certificaciones" value={editData.certificaciones} editing={isEditing} onChange={handleChange} />
                            )}
                            {editData.horario_disponible && (
                                <Field label="Horario Disponible" name="horario_disponible" value={editData.horario_disponible} editing={isEditing} onChange={handleChange} />
                            )}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <Field label="Próximos Retos" name="proximosRetos" value={editData.proximosRetos || editData.proximos_retos} editing={isEditing} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Voluntario - Área y Disponibilidad */}
                {actualRol === 'voluntario' && (
                    <div className="split-section">
                        <div className="split-section-header">
                            <div className="split-section-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                            <h2 className="split-section-title">Perfil de Voluntario</h2>
                        </div>
                        <div className="split-form-grid">
                            <Field label="Área de Voluntariado" name="otra_area" value={editData.otra_area} editing={isEditing} onChange={handleChange} />
                            <Field label="Disponibilidad" name="disponibilidad" value={editData.disponibilidad} editing={isEditing} onChange={handleChange} />
                            <div style={{ gridColumn: '1 / -1' }}>
                                <Field label="Experiencia Previa" name="experiencia_previa" value={editData.experiencia_previa} editing={isEditing} onChange={handleChange} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <Field label="Próximos Retos" name="proximosRetos" value={editData.proximosRetos || editData.proximos_retos} editing={isEditing} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tutor - Información de Tutela */}
                {actualRol === 'tutor' && (
                    <div className="split-section">
                        <div className="split-section-header">
                            <div className="split-section-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                            <h2 className="split-section-title">Información de Tutela</h2>
                        </div>
                        <div className="split-form-grid">
                            <Field label="Relación con el Atleta" name="relacion_con_atleta" value={editData.relacion_con_atleta} editing={isEditing} onChange={handleChange} />
                            <Field label="Nombre del Atleta" name="nombre_atleta" value={editData.nombre_atleta} editing={isEditing} onChange={handleChange} />
                            <Field label="Ocupación" name="ocupacion" value={editData.ocupacion} editing={isEditing} onChange={handleChange} />
                            <div style={{ gridColumn: '1 / -1' }}>
                                <Field label="Motivación" name="motivacion" value={editData.motivacion} editing={isEditing} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Documentos */}
                {(actualRol === 'atleta' || actualRol === 'entrenador' || actualRol === 'voluntario' || actualRol === 'tutor') && (
                    <div className="split-section">
                        <div className="split-section-header">
                            <div className="split-section-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
                            <h2 className="split-section-title">Documentos</h2>
                        </div>
                        <div className="split-docs-grid">
                            {(editData.documentosOficiales && editData.documentosOficiales.length > 0) ? (
                                editData.documentosOficiales.map((doc: any, i: number) => (
                                    <div key={i} className="split-doc-card" onClick={() => {
                                        Swal.fire({ icon: 'info', title: doc.tipo_documento || 'Documento', text: `Archivo guardado exitosamente: ${doc.nombre_documento || 'Descargable disponible pronto'}` });
                                    }}>
                                        <div className="split-doc-icon">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                        </div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 5px 0' }}>{doc.tipo_documento || 'Documento'}</h3>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, wordBreak: 'break-all' }}>{doc.nombre_documento || 'Archivo adjunto'}</p>
                                    </div>
                                ))
                            ) : (
                                documentosList.map(doc => {
                                    const docValue = editData[doc.key];
                                    if (actualRol === 'tutor' && (doc.key === 'exoneracion_nombre' || doc.key === 'titulo_nombre' || doc.key === 'delincuencia_nombre')) return null;
                                    if (!docValue && !isEditing) return null;

                                    return (
                                        <div key={doc.key} className="split-doc-card" onClick={() => {
                                            const base64Key = doc.key.replace('_nombre', '_base64');
                                            const base64Data = editData[base64Key];
                                            if (base64Data && base64Data.startsWith('data:image/')) {
                                                Swal.fire({ title: doc.label, imageUrl: base64Data, width: '600px' });
                                            } else if (docValue && docValue !== 'No adjuntado') {
                                                Swal.fire({ icon: 'info', title: doc.label, text: `Archivo: ${docValue}` });
                                            }
                                        }}>
                                            <div className="split-doc-icon">{doc.icon}</div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 5px 0' }}>{doc.label}</h3>
                                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, wordBreak: 'break-all' }}>{docValue || 'Pendiente'}</p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* Seguridad */}
                <div className="split-section">
                    <div className="split-section-header">
                        <div className="split-section-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                        <h2 className="split-section-title">Seguridad</h2>
                    </div>
                    <div className="form-group" style={{ maxWidth: '400px', marginBottom: '20px' }}>
                        <label className="form-label">Nueva Contraseña</label>
                        <input type="password" className="form-input" placeholder="Ingresa tu nueva contraseña..." value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>
                    <button className="btn-split btn-split-edit" style={{ width: 'auto', padding: '10px 24px' }} onClick={handlePasswordChange}>
                        Actualizar Contraseña
                    </button>
                </div>

            </div>
        </div>
    );
}

export default FormPerfil;
