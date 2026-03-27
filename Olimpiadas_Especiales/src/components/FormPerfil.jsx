import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { updateAtleta, getAtletaById } from '../services/ServicesAtletas';
import { updateTutor, getTutorById } from '../services/ServicesTutores';
import { updateEntrenador } from '../services/ServicesEntrenadores';
import { updateVoluntario } from '../services/ServicesVoluntarios';
import { updateUsuario } from '../services/ServicesUsuarios';
import { ServicesAdmin } from '../services/ServicesAdmin';

/* ─────────── helpers ─────────── */
const rolLabel = (rol, rolUsuario) => {
    if (rol === 'atleta') return 'Atleta Oficial';
    if (rol === 'entrenador') return 'Entrenador';
    if (rol === 'tutor') return 'Tutor / Familiar';
    if (rol === 'voluntario') return 'Voluntario';
    if (rol === 'admin') return 'Administrador';
    return rolUsuario || 'Usuario General';
};
const rolColor = (rol) => {
    const map = { atleta:'#FF0000', entrenador:'#1e40af', tutor:'#059669', voluntario:'#7c3aed', admin:'#0f172a' };
    return map[rol] || '#64748b';
};
const rolBg = (rol) => {
    const map = { atleta:'#FFF5F5', entrenador:'#eff6ff', tutor:'#ecfdf5', voluntario:'#f5f3ff', admin:'#f8fafc' };
    return map[rol] || '#f1f5f9';
};

const Field = ({ label, name, value, editing, onChange, type = 'text', options }) => (
    <div style={{ marginBottom: '18px' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: '700', color: rolColor('atleta'), textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{label}</p>
        {editing ? (
            options ? (
                <select name={name} value={value || ''} onChange={onChange}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', background: '#fff' }}>
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            ) : (
                <input name={name} type={type} value={value || ''} onChange={onChange}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #FF000055', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box' }} />
            )
        ) : (
            <p style={{ fontSize: '0.97rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>{value || '—'}</p>
        )}
    </div>
);

/* ─────────── Main Component ─────────── */
function FormPerfil({ user, setRefreshUser }) {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
    const [editData, setEditData] = useState({ ...user });
    const [isEditing, setIsEditing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [linkedUser, setLinkedUser] = useState(null);

    useEffect(() => { setEditData({ ...user }); }, [user]);

    useEffect(() => {
        const fetchLinked = async () => {
            try {
                if (user?.rol === 'atleta' && user.tutorVinculado) setLinkedUser(await getTutorById(user.tutorVinculado));
                else if (user?.rol === 'tutor' && user.atletaVinculado) setLinkedUser(await getAtletaById(user.atletaVinculado));
            } catch (e) { console.error(e); }
        };
        fetchLinked();
    }, [user]);

    const handleChange = (e) => setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        try {
            Swal.fire({ title: 'Guardando...', didOpen: () => Swal.showLoading() });
            if (user.rol === 'atleta') await updateAtleta(user.id, editData);
            else if (user.rol === 'tutor') await updateTutor(user.id, editData);
            else if (user.rol === 'entrenador') await updateEntrenador(user.id, editData);
            else if (user.rol === 'voluntario') await updateVoluntario(user.id, editData);
            else if (user.rol === 'admin') await ServicesAdmin.updateProfile(user.id, editData);
            else await updateUsuario(user.id, editData);
            localStorage.setItem('usuarioSesion', JSON.stringify(editData));
            if (setRefreshUser) setRefreshUser(editData);
            setIsEditing(false);
            Swal.fire({ icon: 'success', title: '¡Guardado!', timer: 1800, showConfirmButton: false });
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar.' });
        }
    };

    const handlePasswordChange = async () => {
        if (!newPassword || newPassword.length < 5) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Mínimo 5 caracteres.' }); return;
        }
        try {
            Swal.fire({ title: 'Actualizando...', didOpen: () => Swal.showLoading() });
            const updated = { ...user, password: newPassword };
            if (user.rol === 'atleta') await updateAtleta(user.id, updated);
            else if (user.rol === 'tutor') await updateTutor(user.id, updated);
            else if (user.rol === 'entrenador') await updateEntrenador(user.id, updated);
            else if (user.rol === 'voluntario') await updateVoluntario(user.id, updated);
            else await updateUsuario(user.id, updated);
            localStorage.setItem('usuarioSesion', JSON.stringify(updated));
            setModalOpen(false); setNewPassword('');
            Swal.fire({ icon: 'success', title: '¡Contraseña actualizada!', timer: 1800, showConfirmButton: false });
        } catch (e) { Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar.' }); }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                Swal.fire({ icon: 'success', title: '¡Imagen lista!', timer: 1500, showConfirmButton: false });
            };
            reader.readAsDataURL(file);
        }
    };

    const iniciales = user?.nombre ? user.nombre.slice(0, 2).toUpperCase() : '?';
    const badge = rolLabel(user?.rol, user?.rolUsuario);
    const color = rolColor(user?.rol);
    const bg = rolBg(user?.rol);

    const s = {
        page: { minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Inter','Segoe UI',Roboto,sans-serif", paddingBottom: '60px' },
        wrap: { maxWidth: '1050px', margin: '0 auto', padding: '24px 16px' },
        // Header card
        headerCard: { background: '#fff', borderRadius: '20px', padding: '28px 32px', display: 'flex', alignItems: 'center', gap: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '20px', flexWrap: 'wrap', position: 'relative' },
        avatar: { width: '88px', height: '88px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: '900', flexShrink: 0, cursor: 'pointer', position: 'relative', overflow: 'hidden' },
        // Cols
        cols: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' },
        card: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' },
        cardDark: { background: '#1e293b', borderRadius: '16px', padding: '24px', marginBottom: '20px' },
        sectionTitle: { fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' },
        stat: { display: 'flex', alignItems: 'center', gap: '6px', marginRight: '24px' },
        statLabel: { fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' },
        statVal: { fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' },
        // Table
        th: { fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 0', borderBottom: '1px solid #f1f5f9' },
        td: { padding: '10px 0', fontSize: '0.88rem', color: '#334155', borderBottom: '1px solid #f8fafc', verticalAlign: 'middle' },
        // Doc box
        docBox: { background: '#f8fafc', border: '1px dashed #e2e8f0', borderRadius: '12px', padding: '18px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' },
        // Buttons
        btnRed: { background: '#FF0000', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' },
        btnGhost: { background: 'transparent', color: '#FF0000', border: '1.5px solid #FF0000', padding: '10px 22px', borderRadius: '10px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' },
        btnBack: { display:'flex', alignItems:'center', gap:'8px', padding:'9px 18px', background:'#fff', border:'1px solid #FF0000', borderRadius:'10px', color:'#FF0000', fontWeight:'700', fontSize:'0.88rem', cursor:'pointer', marginBottom:'20px', transition:'all 0.2s ease' },
    };

    const participaciones = user?.participaciones || [];
    const documentos = [
        { key: 'cedula_nombre', label: 'Cédula Identidad', icon: '🪪' },
        { key: 'dictamen_nombre', label: 'Dictamen Médico', icon: '📋' },
        { key: 'autorizacion_nombre', label: 'Autorización', icon: '✅' },
    ];

    return (
        <div style={s.page}>
            {/* Back */}
            <div style={s.wrap}>
                <button style={s.btnBack}
                    onClick={() => navigate(-1)}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#1e293b'; e.currentTarget.style.borderColor = '#1e293b'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#FF0000'; e.currentTarget.style.borderColor = '#FF0000'; }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5"/>
                    </svg>
                    Regresar
                </button>

                {/* ── HEADER CARD ── */}
                <div style={s.headerCard}>
                    {/* Avatar */}
                    <div style={s.avatar} onClick={() => fileInputRef.current.click()} title="Cambiar foto">
                        {avatarPreview
                            ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : iniciales}
                        <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,0.4)', padding:'3px', textAlign:'center', fontSize:'0.6rem', color:'#fff' }}>Editar</div>
                        <input type="file" ref={fileInputRef} style={{ display:'none' }} accept="image/*" onChange={handleFileChange} />
                    </div>

                    {/* Name + badge + stats */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                                {isEditing ? (
                                    <input name="nombre" value={editData.nombre || ''} onChange={handleChange}
                                        style={{ fontSize: '1.4rem', fontWeight: '900', border: 'none', borderBottom: '2px solid #FF0000', outline: 'none', width: '220px' }} />
                                ) : (
                                    `${user?.nombre || ''} ${user?.apellido || ''}`
                                )}
                            </h1>
                            <span style={{ background: bg, color: color, padding: '4px 14px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: '800' }}>
                                {isEditing ? (
                                    <select name="rol" value={editData.rol} onChange={handleChange}
                                        style={{ border: 'none', background: 'transparent', color: color, fontWeight: '800', cursor: 'pointer' }}>
                                        {[['atleta','Atleta Oficial'],['entrenador','Entrenador'],['tutor','Tutor / Familiar'],['voluntario','Voluntario'],['usuario','Usuario General']].map(([v,l]) => (
                                            <option key={v} value={v}>{l}</option>
                                        ))}
                                    </select>
                                ) : badge}
                            </span>
                            <span style={{ background: '#dcfce7', color: '#16a34a', padding: '3px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: '700' }}>● Activo</span>
                        </div>

                        {/* Quick Stats */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={s.stat}>
                                <span>📅</span>
                                <div>
                                    <span style={s.statLabel}>Edad</span>
                                    <span style={s.statVal}>{user?.edad ? `${user.edad} años` : '—'}</span>
                                </div>
                            </div>
                            <div style={s.stat}>
                                <span>📍</span>
                                <div>
                                    <span style={s.statLabel}>País / Región</span>
                                    <span style={s.statVal}>{user?.pais || user?.provincia || '—'}</span>
                                </div>
                            </div>
                            <div style={s.stat}>
                                <span>🏅</span>
                                <div>
                                    <span style={s.statLabel}>ID</span>
                                    <span style={s.statVal}>#{user?.id}</span>
                                </div>
                            </div>
                        </div>
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

                {/* ── TWO-COLUMN LAYOUT ── */}
                <div style={s.cols}>
                    {/* ── LEFT ── */}
                    <div>
                        {/* Datos Personales */}
                        <div style={s.card}>
                            <h2 style={s.sectionTitle}>
                                <span style={{ background: '#FFF5F5', color: '#FF0000', width: '28px', height: '28px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>👤</span>
                                Datos Personales
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                                <Field label="Nombre Completo" name="nombre" value={editData.nombre} editing={isEditing} onChange={handleChange} />
                                <Field label="Número de Cédula" name="cedula" value={editData.cedula} editing={isEditing} onChange={handleChange} />
                                <Field label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={editData.fechaNacimiento} editing={isEditing} onChange={handleChange} />
                                <Field label="Sexo" name="genero" value={editData.genero} editing={isEditing} onChange={handleChange}
                                    options={[{value:'',label:'— Seleccionar —'},{value:'Masculino',label:'Masculino'},{value:'Femenino',label:'Femenino'},{value:'Prefiero no indicar',label:'Prefiero no indicar'}]} />
                            </div>
                            <Field label="Dirección Exacta" name="direccion" value={editData.direccion} editing={isEditing} onChange={handleChange} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                                <Field label="Teléfono de Contacto" name="telefono" value={editData.telefono} editing={isEditing} onChange={handleChange} />
                                <Field label="Correo Electrónico" name="correoElectronico" value={editData.correoElectronico} editing={isEditing} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Información Médica */}
                        <div style={s.cardDark}>
                            <h2 style={{ ...s.sectionTitle, color: '#fff' }}>
                                <span style={{ background: '#FF000033', color: '#FF6666', width: '28px', height: '28px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>🏥</span>
                                Información Médica
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ background: '#0f172a', borderRadius: '12px', padding: '16px' }}>
                                    <p style={{ fontSize: '0.7rem', color: '#FF6666', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Discapacidad y Condición</p>
                                    {isEditing ? (
                                        <>
                                            <input name="tipoDiscapacidad" value={editData.tipoDiscapacidad || ''} onChange={handleChange} placeholder="Tipo de discapacidad"
                                                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff', marginBottom: '6px', boxSizing: 'border-box' }} />
                                            <input name="condicionesMedicasText" value={editData.condicionesMedicasText || (Array.isArray(editData.condicionesMedicas) ? editData.condicionesMedicas.join(', ') : '')} onChange={handleChange} placeholder="Condiciones adicionales"
                                                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff', boxSizing: 'border-box' }} />
                                        </>
                                    ) : (
                                        <>
                                            <p style={{ color: '#e2e8f0', fontSize: '0.88rem', fontWeight: '600', margin: '0 0 4px' }}>{user?.tipoDiscapacidad || '—'}</p>
                                            <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>
                                                {Array.isArray(user?.condicionesMedicas) ? user.condicionesMedicas.join(', ') : (user?.condicionesMedicas || '—')}
                                            </p>
                                        </>
                                    )}
                                </div>
                                <div style={{ background: '#0f172a', borderRadius: '12px', padding: '16px' }}>
                                    <p style={{ fontSize: '0.7rem', color: '#FF6666', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Medicamentos y Alergias</p>
                                    {isEditing ? (
                                        <>
                                            <input name="alergias" value={editData.alergias || ''} onChange={handleChange} placeholder="Alergias conocidas"
                                                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff', marginBottom: '6px', boxSizing: 'border-box' }} />
                                            <input name="medicamentos" value={typeof editData.medicamentos === 'string' ? editData.medicamentos : (Array.isArray(editData.medicamentos) ? editData.medicamentos.join(', ') : '')} onChange={handleChange} placeholder="Medicamentos"
                                                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff', boxSizing: 'border-box' }} />
                                        </>
                                    ) : (
                                        <>
                                            <p style={{ color: '#fbbf24', fontSize: '0.82rem', margin: '0 0 4px' }}>⚠ Alergias Conocidas</p>
                                            <p style={{ color: '#e2e8f0', fontSize: '0.88rem', fontWeight: '600', margin: '0 0 8px' }}>{user?.alergias || (Array.isArray(user?.tiposAlergia) ? user.tiposAlergia.join(', ') : '—')}</p>
                                            <p style={{ color: '#86efac', fontSize: '0.82rem', margin: '0 0 2px' }}>✚ Medicamentos</p>
                                            <p style={{ color: '#e2e8f0', fontSize: '0.88rem', fontWeight: '600', margin: 0 }}>
                                                {typeof user?.medicamentos === 'string' ? user.medicamentos : (Array.isArray(user?.medicamentos) ? user.medicamentos.join(', ') : '—')}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Historial de Participaciones */}
                        <div style={s.card}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h2 style={{ ...s.sectionTitle, margin: 0 }}>
                                    <span style={{ background: '#FFF5F5', color: '#FF0000', width: '28px', height: '28px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>🏆</span>
                                    Historial de Participaciones
                                </h2>
                                <span style={{ color: '#FF0000', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}>Ver todo</span>
                            </div>
                            {participaciones.length > 0 ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            {['Evento / Competencia','Fecha','Disciplina','Resultado / Medalla'].map(h => (
                                                <th key={h} style={s.th}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {participaciones.slice(0, 5).map((p, i) => (
                                            <tr key={i}>
                                                <td style={s.td}><strong>{p.evento}</strong></td>
                                                <td style={s.td}>{p.fecha}</td>
                                                <td style={s.td}>{p.disciplina}</td>
                                                <td style={s.td}>
                                                    <span style={{
                                                        background: p.resultado === 'Oro' ? '#fef9c3' : p.resultado === 'Plata' ? '#f1f5f9' : '#f0fdf4',
                                                        color: p.resultado === 'Oro' ? '#854d0e' : p.resultado === 'Plata' ? '#475569' : '#166534',
                                                        padding: '2px 10px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700'
                                                    }}>
                                                        {p.resultado === 'Oro' ? '🥇' : p.resultado === 'Plata' ? '🥈' : '🏅'} {p.resultado}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                    <p style={{ fontSize: '2rem', margin: '0 0 8px' }}>🏁</p>
                                    <p style={{ margin: 0 }}>Sin participaciones registradas aún.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT ── */}
                    <div>
                        {/* Ficha Deportiva / Rol */}
                        <div style={s.card}>
                            <h2 style={s.sectionTitle}>
                                <span style={{ background: '#FFF5F5', color: '#FF0000', width: '28px', height: '28px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>🎽</span>
                                Ficha {badge}
                            </h2>
                            <div style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Equipo / Programa</p>
                                {isEditing
                                    ? <input name="equipo" value={editData.equipo || editData.disciplina || ''} onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', border: '1px solid #FF000055', borderRadius: '8px', boxSizing: 'border-box' }} />
                                    : <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{user?.equipo || user?.disciplina || '—'}</p>}
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Años de Experiencia</p>
                                {isEditing
                                    ? <input name="experiencia" value={editData.experiencia || editData.aniosExperiencia || ''} onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', border: '1px solid #FF000055', borderRadius: '8px', boxSizing: 'border-box' }} />
                                    : <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{user?.experiencia || user?.aniosExperiencia || '—'}</p>}
                            </div>
                            {linkedUser && (
                                <div style={{ background: color, borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                                        {linkedUser.nombre?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                            {user?.rol === 'atleta' ? 'Tutor a cargo' : 'Atleta vinculado'}
                                        </p>
                                        <p style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff', margin: 0 }}>{linkedUser.nombre} {linkedUser.apellido || ''}</p>
                                    </div>
                                </div>
                            )}
                            <div style={{ marginBottom: '0' }}>
                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Próximos Retos</p>
                                {isEditing
                                    ? <input name="proximosRetos" value={editData.proximosRetos || ''} onChange={handleChange} placeholder="Ej: Mundial de Verano Berlín"
                                        style={{ width: '100%', padding: '8px', border: '1px solid #FF000055', borderRadius: '8px', boxSizing: 'border-box' }} />
                                    : user?.proximosRetos
                                        ? <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px 14px', borderLeft: '3px solid #FF0000' }}>
                                            <p style={{ margin: 0, fontWeight: '600', color: '#0f172a', fontSize: '0.9rem' }}>{user.proximosRetos}</p>
                                          </div>
                                        : <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>Sin eventos próximos registrados.</p>}
                            </div>
                        </div>

                        {/* Documentos */}
                        <div style={s.card}>
                            <h2 style={s.sectionTitle}>
                                <span style={{ background: '#FFF5F5', color: '#FF0000', width: '28px', height: '28px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>📁</span>
                                Documentos
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {documentos.map(doc => (
                                    <div key={doc.key} style={s.docBox}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF0000'; e.currentTarget.style.background = '#fff5f5'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}>
                                        <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{doc.icon}</div>
                                        <p style={{ fontSize: '0.72rem', fontWeight: '700', color: '#FF0000', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>{doc.label}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{user?.[doc.key] || 'No adjuntado'}</p>
                                    </div>
                                ))}
                                <div style={{ ...s.docBox, borderStyle: 'dashed' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF0000'; e.currentTarget.style.background = '#fff5f5'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}>
                                    <div style={{ fontSize: '1.8rem', marginBottom: '6px', color: '#FF0000' }}>➕</div>
                                    <p style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Añadir Nuevo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── PASSWORD MODAL ── */}
                {modalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', width: '400px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
                            <h3 style={{ margin: '0 0 8px', fontWeight: '900', fontSize: '1.3rem', color: '#0f172a' }}>Cambiar Contraseña</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Ingresa tu nueva contraseña a continuación.</p>
                            <input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '1rem', marginBottom: '18px', boxSizing: 'border-box' }} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={{ ...s.btnGhost, flex: 1 }} onClick={() => { setModalOpen(false); setNewPassword(''); }}>Cancelar</button>
                                <button style={{ ...s.btnRed, flex: 1 }} onClick={handlePasswordChange}>Guardar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Responsive fix */}
            <style>{`
                @media (max-width: 768px) {
                    .perfil-cols { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}

export default FormPerfil;