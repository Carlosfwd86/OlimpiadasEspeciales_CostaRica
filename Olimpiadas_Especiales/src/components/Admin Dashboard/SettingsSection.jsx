import React, { useState, useEffect } from 'react';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import '../../style/AdminDashboard.css';
import Swal from 'sweetalert2';

export default function SettingsSection({ onThemeChange, initialSubTab = 'usuarios' }) {
    const [settings, setSettings] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [subTab, setSubTab] = useState(initialSubTab);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Sincronizar subTab si cambia el prop desde el exterior (Topbar)
    useEffect(() => {
        setSubTab(initialSubTab);
    }, [initialSubTab]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const s = await ServicesAdmin.getSettings();
                const u = await ServicesAdmin.getUsers();
                setSettings(s);
                setUsuarios(u);
            } catch (err) {
                console.error("Error al cargar datos en Configuración:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleToggle = (key) => {
        setSettings({ ...settings, [key]: !settings[key] });
    };

    const handleSave = () => {
        setSaving(true);
        ServicesAdmin.updateSettings(settings)
            .then(() => {
                setSaving(false);
                ServicesAdmin.logActivity("Configuración", "Se actualizaron las preferencias del sistema", "fa-solid fa-gears", "purple");
                Swal.fire({
                    icon: 'success',
                    title: '¡Guardado!',
                    text: 'Configuración guardada correctamente.',
                    timer: 2000,
                    showConfirmButton: false
                });
            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Guardado',
                    text: err.message,
                    confirmButtonColor: '#e62334'
                });
                setSaving(false);
            });
    };

    const getRolBadge = (rol) => {
        const styles = {
            admin: { bg: '#fee2e2', color: '#dc2626' },
            atleta: { bg: '#dbeafe', color: '#2563eb' },
            entrenador: { bg: '#dcfce7', color: '#16a34a' },
            voluntario: { bg: '#f3e8ff', color: '#9333ea' },
            tutor: { bg: '#fef3c7', color: '#d97706' },
            usuario: { bg: '#f1f5f9', color: '#64748b' },
        };
        const s = styles[rol] || styles.usuario;
        return { padding: '4px 10px', borderRadius: '6px', background: s.bg, color: s.color, fontSize: '12px', fontWeight: '700', textTransform: 'capitalize' };
    };

    const handleUserForm = (user = null) => {
        const isEdit = !!user;
        Swal.fire({
            title: isEdit ? `Editar: ${user.nombre}` : 'Crear Nuevo Usuario',
            html: `
                <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                    <label style="display:block; margin-bottom: 4px; font-weight: 600; font-size: 13px; color: #334155;">Nombre completo *</label>
                    <input id="swal-nombre" class="swal2-input" value="${user?.nombre || ''}" placeholder="Ej. María López" style="margin-top: 0; width: 100%; box-sizing: border-box;">
                    
                    <label style="display:block; margin-top: 14px; margin-bottom: 4px; font-weight: 600; font-size: 13px; color: #334155;">Correo Electrónico *</label>
                    <input id="swal-email" type="email" class="swal2-input" value="${user?.correoElectronico || ''}" placeholder="correo@ejemplo.com" style="margin-top: 0; width: 100%; box-sizing: border-box;">
                    
                    <label style="display:block; margin-top: 14px; margin-bottom: 4px; font-weight: 600; font-size: 13px; color: #334155;">Contraseña ${isEdit ? '(dejar vacío para no cambiar)' : '*'}</label>
                    <input id="swal-password" type="password" class="swal2-input" placeholder="${isEdit ? '••••••••' : 'Mínimo 5 caracteres'}" style="margin-top: 0; width: 100%; box-sizing: border-box;">
                    
                    <label style="display:block; margin-top: 14px; margin-bottom: 4px; font-weight: 600; font-size: 13px; color: #334155;">Rol *</label>
                    <select id="swal-rol" class="swal2-input" style="margin-top: 0; width: 100%; box-sizing: border-box; padding: 10px;">
                        <option value="usuario" ${user?.rol === 'usuario' ? 'selected' : ''}>Usuario (sin permisos especiales)</option>
                        <option value="atleta" ${user?.rol === 'atleta' ? 'selected' : ''}>Atleta</option>
                        <option value="entrenador" ${user?.rol === 'entrenador' ? 'selected' : ''}>Entrenador</option>
                        <option value="voluntario" ${user?.rol === 'voluntario' ? 'selected' : ''}>Voluntario</option>
                        <option value="tutor" ${user?.rol === 'tutor' ? 'selected' : ''}>Tutor / Padre</option>
                        <option value="admin" ${user?.rol === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                </div>
            `,
            width: 500,
            showCancelButton: true,
            confirmButtonText: isEdit ? 'Guardar Cambios' : 'Crear Usuario',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#e62334',
            preConfirm: () => {
                const nombre = document.getElementById('swal-nombre').value.trim();
                const correoElectronico = document.getElementById('swal-email').value.trim();
                const password = document.getElementById('swal-password').value;
                const rol = document.getElementById('swal-rol').value;
                
                if (!nombre || !correoElectronico) {
                    Swal.showValidationMessage('Nombre y Correo son obligatorios');
                    return false;
                }
                if (!isEdit && (!password || password.length < 5)) {
                    Swal.showValidationMessage('La contraseña es obligatoria y debe tener al menos 5 caracteres');
                    return false;
                }
                
                const data = { nombre, correoElectronico, rol };
                if (password) data.password = password;
                if (!isEdit) data.fechaRegistro = new Date().toISOString();
                return data;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                ServicesAdmin.saveUser(result.value, user?.id)
                    .then(() => {
                        ServicesAdmin.getUsers().then(u => setUsuarios(u));
                        ServicesAdmin.logActivity("Usuarios", `${isEdit ? 'Editado' : 'Creado'}: ${result.value.nombre} (${result.value.rol})`, "fa-solid fa-user-gear", "blue");
                        Swal.fire({ icon: 'success', title: '¡Listo!', text: `Usuario ${isEdit ? 'actualizado' : 'creado'} correctamente.`, timer: 2000, showConfirmButton: false });
                    })
                    .catch(err => Swal.fire('Error', err.message, 'error'));
            }
        });
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-main)' }}>Cargando configuración...</div>;
    if (!settings) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-main)' }}>Error al cargar configuración</div>;

    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                
                {subTab === 'usuarios' ? (
                    <div style={{ background: 'var(--admin-white)', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--admin-text-main)' }}>Gestión de Usuarios Registrados</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-text-muted)' }}>{usuarios.length} usuarios en el sistema</p>
                            </div>
                            <button className="btn-new-entry" onClick={() => handleUserForm()}>+ Nuevo Usuario</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ borderBottom: '2px solid var(--admin-border)' }}>
                                    <tr style={{ textAlign: 'left', color: 'var(--admin-text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        <th style={{ padding: '12px 15px' }}>Nombre</th>
                                        <th style={{ padding: '12px 15px' }}>Email</th>
                                        <th style={{ padding: '12px 15px' }}>Rol</th>
                                        <th style={{ padding: '12px 15px' }}>Registro</th>
                                        <th style={{ padding: '12px 15px' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--admin-border)', fontSize: '14px', color: 'var(--admin-text-main)', transition: 'background 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--admin-hover, #f8fafc)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '14px 15px', fontWeight: '500' }}>{u.nombre}</td>
                                            <td style={{ padding: '14px 15px', color: 'var(--admin-text-muted)', fontSize: '13px' }}>{u.correoElectronico}</td>
                                            <td style={{ padding: '14px 15px' }}>
                                                <span style={getRolBadge(u.rol)}>{u.rol}</span>
                                            </td>
                                            <td style={{ padding: '14px 15px', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                                                {u.fechaRegistro ? new Date(u.fechaRegistro).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                            </td>
                                            <td style={{ padding: '14px 15px' }}>
                                                <button 
                                                    title="Editar usuario"
                                                    style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '8px', fontSize: '14px' }}
                                                    onClick={() => handleUserForm(u)}
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button 
                                                    title="Eliminar usuario"
                                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}
                                                    onClick={() => {
                                                        Swal.fire({
                                                            title: '¿Eliminar Usuario?',
                                                            html: `<p>¿Seguro que deseas eliminar a <strong>${u.nombre}</strong>?</p><p style="color:#ef4444; font-size:13px;">Esta acción eliminará su cuenta y no podrá iniciar sesión.</p>`,
                                                            icon: 'warning',
                                                            showCancelButton: true,
                                                            confirmButtonColor: '#e62334',
                                                            cancelButtonColor: '#94a3b8',
                                                            confirmButtonText: 'Sí, eliminar',
                                                            cancelButtonText: 'Cancelar'
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                ServicesAdmin.deleteUser(u.id).then(() => {
                                                                    setUsuarios(usuarios.filter(us => us.id !== u.id));
                                                                    ServicesAdmin.logActivity("Usuarios", `Eliminado: ${u.nombre}`, "fa-solid fa-user-minus", "red");
                                                                    Swal.fire('¡Eliminado!', 'El usuario ha sido borrado del sistema.', 'success');
                                                                });
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div style={{ background: 'var(--admin-white)', borderRadius: '15px', padding: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '24px', color: 'var(--admin-text-main)', marginBottom: '10px' }}>Configuración del Sistema</h2>
                        <p style={{ color: 'var(--admin-text-muted)', marginBottom: '30px', fontSize: '14px' }}>Personaliza el comportamiento y la apariencia del panel administrativo.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            
                            {/* Sección Apariencia */}
                            <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--admin-border)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--admin-text-main)' }}>Apariencia</h3>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontWeight: '500', fontSize: '14px', margin: 0, color: 'var(--admin-text-main)' }}>Tema del Panel</p>
                                        <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: 0 }}>Elige entre modo claro u oscuro para la interfaz.</p>
                                    </div>
                                    <select 
                                        value={settings.tema} 
                                        onChange={(e) => {
                                            const newTheme = e.target.value;
                                            setSettings({...settings, tema: newTheme});
                                            if (onThemeChange) onThemeChange(newTheme);
                                        }}
                                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)' }}
                                    >
                                        <option value="light">Modo Claro</option>
                                        <option value="dark">Modo Oscuro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Sección Notificaciones */}
                            <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--admin-border)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--admin-text-main)' }}>Notificaciones</h3>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontWeight: '500', fontSize: '14px', margin: 0, color: 'var(--admin-text-main)' }}>Notificaciones de Sistema</p>
                                        <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: 0 }}>Recibir alertas visuales sobre nuevas solicitudes de registro.</p>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle('notificaciones')}
                                        style={{ 
                                            width: '50px', 
                                            height: '26px', 
                                            borderRadius: '13px', 
                                            backgroundColor: settings.notificaciones ? '#22c55e' : '#cbd5e1',
                                            border: 'none',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s'
                                        }}
                                    >
                                        <div style={{ 
                                            width: '20px', 
                                            height: '20px', 
                                            borderRadius: '50%', 
                                            backgroundColor: 'white', 
                                            position: 'absolute', 
                                            top: '3px', 
                                            left: settings.notificaciones ? '27px' : '3px',
                                            transition: 'left 0.3s'
                                        }}></div>
                                    </button>
                                </div>
                            </div>

                            {/* Sección Automatización */}
                            <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--admin-border)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--admin-text-main)' }}>Automatización</h3>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontWeight: '500', fontSize: '14px', margin: 0, color: 'var(--admin-text-main)' }}>Auto-aprobación de Registros</p>
                                        <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: 0 }}>Aprobar automáticamente registros de sedes oficiales conocidas.</p>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle('registro_automatico')}
                                        style={{ 
                                            width: '50px', 
                                            height: '26px', 
                                            borderRadius: '13px', 
                                            backgroundColor: settings.registro_automatico ? '#22c55e' : '#cbd5e1',
                                            border: 'none',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s'
                                        }}
                                    >
                                        <div style={{ 
                                            width: '20px', 
                                            height: '20px', 
                                            borderRadius: '50%', 
                                            backgroundColor: 'white', 
                                            position: 'absolute', 
                                            top: '3px', 
                                            left: settings.registro_automatico ? '27px' : '3px',
                                            transition: 'left 0.3s'
                                        }}></div>
                                    </button>
                                </div>
                            </div>

                            {/* Sección Eliminada (Idioma: Solo Español CR por defecto) */}

                        </div>

                        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="btn-new-entry"
                                style={{ backgroundColor: '#e62334', border: 'none', color: 'white', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                            >
                                {saving ? 'Guardando...' : 'Guardar Preferencias'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
