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

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-main)' }}>Cargando configuración...</div>;
    if (!settings) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-main)' }}>Error al cargar configuración</div>;

    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                
                {subTab === 'usuarios' ? (
                    <div style={{ background: 'var(--admin-white)', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: 'var(--admin-text-main)' }}>Gestión de Usuarios</h3>
                            <button className="btn-new-entry" onClick={() => Swal.fire({ icon: 'info', title: 'Próximamente', text: 'La gestión avanzada de usuarios estará disponible en la siguiente actualización.', confirmButtonColor: '#3b82f6' })}>+ Nuevo Usuario</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ borderBottom: '1px solid var(--admin-border)' }}>
                                    <tr style={{ textAlign: 'left', color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                                        <th style={{ padding: '15px' }}>Nombre</th>
                                        <th style={{ padding: '15px' }}>Email</th>
                                        <th style={{ padding: '15px' }}>Rol</th>
                                        <th style={{ padding: '15px' }}>Estado</th>
                                        <th style={{ padding: '15px' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--admin-border)', fontSize: '14px', color: 'var(--admin-text-main)' }}>
                                            <td style={{ padding: '15px' }}>{u.nombre}</td>
                                            <td style={{ padding: '15px' }}>{u.email}</td>
                                            <td style={{ padding: '15px' }}>{u.rol}</td>
                                            <td style={{ padding: '15px' }}>
                                                <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#e6ffed', color: '#28a745', fontSize: '12px', fontWeight: '600' }}>{u.estado}</span>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '10px' }}><i className="fa-solid fa-pen"></i></button>
                                                <button 
                                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                                    onClick={() => {
                                                        Swal.fire({
                                                            title: '¿Eliminar Usuario?',
                                                            text: `¿Seguro que deseas eliminar a ${u.nombre}? Esta acción no se puede deshacer.`,
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
                                                                    Swal.fire('¡Eliminado!', 'El usuario ha sido borrado.', 'success');
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
