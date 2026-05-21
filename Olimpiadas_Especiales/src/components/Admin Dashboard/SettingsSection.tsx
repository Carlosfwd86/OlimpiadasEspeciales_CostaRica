import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import '../../style/AdminDashboard.css';
import type { SystemSettings } from '../../types';
import ModalNuevoUsuario from './ModalNuevoUsuario';

interface SettingsSectionProps {
  onThemeChange?: (theme: string) => void;
  /** 'usuarios' | 'configuracion' | 'perfil' — determina qué contenido mostrar directamente */
  view: 'usuarios' | 'configuracion' | 'perfil';
  searchQuery?: string;
}

export default function SettingsSection({ onThemeChange, view, searchQuery = '' }: SettingsSectionProps): React.JSX.Element {
    const [settings, setSettings] = useState<SystemSettings | null>(null);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
    const [localSearch, setLocalSearch] = useState<string>('');

    const [perfil, setPerfil] = useState<{ nombre: string; correoElectronico: string; passwordActual: string; passwordNuevo: string }>({
        nombre: '', correoElectronico: '', passwordActual: '', passwordNuevo: ''
    });
    const [savingPerfil, setSavingPerfil] = useState<boolean>(false);
    const [adminId, setAdminId] = useState<string | number | null>(null);

    const loadUsers = async () => {
        try {
            const u = await ServicesAdmin.getUsers();
            setUsuarios(u);
        } catch (err) {
            console.error("Error al cargar usuarios:", err);
        }
    };

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            try {
                const s = await ServicesAdmin.getSettings();
                await loadUsers();
                const p = await ServicesAdmin.getProfile();
                setSettings(s);
                setAdminId(p.id);
                setPerfil(prev => ({
                    ...prev,
                    nombre: p.nombre ?? '',
                    correoElectronico: p.email ?? (p as any).correoElectronico ?? ''
                }));
            } catch (err) {
                console.error("Error al cargar datos en Configuración:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleToggle = (key: string): void => {
        if (!settings) return;
        const k = key as keyof SystemSettings;
        setSettings({ ...settings, [k]: !settings[k] });
    };

    const handleSave = (): void => {
        if (!settings) return;
        setSaving(true);
        ServicesAdmin.updateSettings(settings)
            .then(() => {
                setSaving(false);
                ServicesAdmin.logActivity("Configuración", "Se actualizaron las preferencias del sistema", "fa-solid fa-gears", "purple");
                Swal.fire({ title: '¡Guardado!', text: 'Configuración guardada correctamente.', icon: 'success', confirmButtonColor: '#e60000' });
            })
            .catch(err => {
                Swal.fire({ title: 'Error', text: 'Error al guardar: ' + (err as Error).message, icon: 'error', confirmButtonColor: '#e60000' });
                setSaving(false);
            });
    };

    const handleSavePerfil = (): void => {
        if (!adminId) return;
        setSavingPerfil(true);
        const payload: any = { nombre: perfil.nombre, email: perfil.correoElectronico };
        if (perfil.passwordActual) payload.passwordActual = perfil.passwordActual;
        if (perfil.passwordNuevo)  payload.passwordNuevo  = perfil.passwordNuevo;

        ServicesAdmin.updateProfile(adminId, payload)
            .then(() => {
                setSavingPerfil(false);
                ServicesAdmin.logActivity("Perfil", "Se actualizaron los datos del perfil administrador", "fa-solid fa-user-pen", "blue");
                Swal.fire({ title: '¡Actualizado!', text: 'Perfil actualizado correctamente.', icon: 'success', confirmButtonColor: '#e60000' });
                setPerfil(prev => ({ ...prev, passwordActual: '', passwordNuevo: '' }));
            })
            .catch(err => {
                setSavingPerfil(false);
                Swal.fire({ title: 'Error', text: 'Error al actualizar perfil: ' + (err as Error).message, icon: 'error', confirmButtonColor: '#e60000' });
            });
    };

    const getRoleName = (rolId: number): string => {
        const roles: Record<number, string> = { 1: 'Administrador', 2: 'Atleta', 3: 'Entrenador', 4: 'Voluntario', 5: 'Tutor', 6: 'Usuario General' };
        return roles[rolId] || 'Usuario';
    };

    const filteredUsers = usuarios.filter(u => {
        const q = (localSearch || searchQuery).toLowerCase();
        const name  = `${u.nombre ?? ''} ${u.apellido ?? ''}`.toLowerCase();
        const email = (u.correo_electronico || u.email || '').toLowerCase();
        return name.includes(q) || email.includes(q);
    });

    if (loading) return (
        <div className="admin-empty-state">
            <div className="admin-empty-state-icon"><i className="fa-solid fa-circle-notch fa-spin" /></div>
            <h3>Cargando...</h3>
            <p>Obteniendo los datos del sistema.</p>
        </div>
    );

    if (!settings && view === 'configuracion') return (
        <div className="admin-empty-state">
            <div className="admin-empty-state-icon"><i className="fa-solid fa-circle-exclamation" /></div>
            <h3>Error al cargar configuración</h3>
            <p>No se pudo conectar con el servidor. Intenta recargar la página.</p>
        </div>
    );

    /* ────────────────────────────────────────────────────────── */
    /*  VIEW: USUARIOS                                            */
    /* ────────────────────────────────────────────────────────── */
    if (view === 'usuarios') return (
        <div className="tab-container">
            <div className="pending-table-container">
                <div className="athlete-table-header">
                    <h3>Gestión de Usuarios</h3>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div className="athlete-table-search">
                            <i className="fa-solid fa-magnifying-glass" />
                            <input
                                type="text"
                                placeholder="Buscar usuarios..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                            />
                        </div>
                        <button className="btn-new-entry" onClick={() => setIsUserModalOpen(true)}>
                            <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />
                            Nuevo Usuario
                        </button>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="pending-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th style={{ textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? filteredUsers.map(u => (
                                <tr key={String(u.id)}>
                                    <td style={{ fontWeight: 600 }}>{String(u.nombre ?? '')} {String(u.apellido ?? '')}</td>
                                    <td style={{ color: 'var(--admin-text-muted)' }}>{String(u.correo_electronico || u.email || '')}</td>
                                    <td>{u.rol?.nombre || getRoleName(u.rol_id)}</td>
                                    <td>
                                        <span className={u.status === 'ACTIVO' ? 'status-badge-active' : 'status-badge-inactive'}>
                                            {String(u.status || 'ACTIVO')}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                            <button className="btn-action edit" title="Editar"><i className="fa-solid fa-pen" /></button>
                                            <button className="btn-action" title="Eliminar"
                                                style={{ color: '#ef4444' }}
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: `¿Eliminar a ${String(u.nombre ?? '')}?`,
                                                        text: "Esta acción no se puede deshacer.",
                                                        icon: 'warning',
                                                        showCancelButton: true,
                                                        confirmButtonColor: '#e60000',
                                                        cancelButtonColor: '#64748b',
                                                        confirmButtonText: 'Sí, eliminar',
                                                        cancelButtonText: 'Cancelar'
                                                    }).then(result => {
                                                        if (result.isConfirmed) {
                                                            ServicesAdmin.deleteUser(String(u.id))
                                                                .then(() => { loadUsers(); Swal.fire({ title: '¡Eliminado!', icon: 'success', confirmButtonColor: '#e60000' }); })
                                                                .catch(err => Swal.fire({ title: 'Error', text: (err as Error).message, icon: 'error', confirmButtonColor: '#e60000' }));
                                                        }
                                                    });
                                                }}>
                                                <i className="fa-solid fa-trash" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="empty-table-msg">
                                        No se encontraron usuarios que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <ModalNuevoUsuario
                    isOpen={isUserModalOpen}
                    onClose={() => setIsUserModalOpen(false)}
                    onSaveSuccess={loadUsers}
                />
            </div>
        </div>
    );

    /* ────────────────────────────────────────────────────────── */
    /*  VIEW: MI PERFIL                                           */
    /* ────────────────────────────────────────────────────────── */
    if (view === 'perfil') return (
        <div className="tab-container">
            <div style={{ background: 'var(--admin-white)', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)', maxWidth: '560px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--admin-text-main)', marginBottom: '6px', letterSpacing: '-0.02em' }}>Mi Perfil</h2>
                <p style={{ color: 'var(--admin-text-muted)', marginBottom: '32px', fontSize: '14px', fontWeight: 500 }}>Actualiza tus datos de acceso al panel administrativo.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {[
                        { label: 'Nombre completo', key: 'nombre', type: 'text' },
                        { label: 'Correo electrónico', key: 'correoElectronico', type: 'email' },
                    ].map(({ label, key, type }) => (
                        <div key={key}>
                            <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--admin-text-main)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                            <input
                                type={type}
                                value={(perfil as any)[key]}
                                onChange={e => setPerfil(prev => ({ ...prev, [key]: e.target.value }))}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#f8fafc', color: 'var(--admin-text-main)', fontSize: '14px', fontFamily: 'inherit', outline: 'none', fontWeight: 500 }}
                                onFocus={e => { e.target.style.borderColor = '#e60000'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(230,0,0,0.08)'; }}
                                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                    ))}

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px', marginTop: '4px' }}>
                        <p style={{ color: 'var(--admin-text-muted)', fontSize: '13px', marginBottom: '20px', fontWeight: 500 }}>Dejar en blanco si no deseas cambiar la contraseña.</p>
                        {[
                            { label: 'Contraseña actual', key: 'passwordActual' },
                            { label: 'Nueva contraseña', key: 'passwordNuevo' },
                        ].map(({ label, key }) => (
                            <div key={key} style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--admin-text-main)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                                <input
                                    type="password"
                                    value={(perfil as any)[key]}
                                    onChange={e => setPerfil(prev => ({ ...prev, [key]: e.target.value }))}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#f8fafc', color: 'var(--admin-text-main)', fontSize: '14px', fontFamily: 'inherit', outline: 'none', fontWeight: 500 }}
                                    onFocus={e => { e.target.style.borderColor = '#e60000'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(230,0,0,0.08)'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleSavePerfil} disabled={savingPerfil} className="btn-new-entry">
                        {savingPerfil ? <><i className="fa-solid fa-circle-notch fa-spin" /> Guardando...</> : <><i className="fa-solid fa-floppy-disk" style={{ marginRight: 8 }} />Guardar Perfil</>}
                    </button>
                </div>
            </div>
        </div>
    );

    /* ────────────────────────────────────────────────────────── */
    /*  VIEW: CONFIGURACIÓN DEL SISTEMA                           */
    /* ────────────────────────────────────────────────────────── */
    return (
        <div className="tab-container">
            <div style={{ background: 'var(--admin-white)', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)', maxWidth: '680px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--admin-text-main)', marginBottom: '6px', letterSpacing: '-0.02em' }}>Configuración del Sistema</h2>
                <p style={{ color: 'var(--admin-text-muted)', marginBottom: '32px', fontSize: '14px', fontWeight: 500 }}>Personaliza el comportamiento y la apariencia del panel administrativo.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {/* Apariencia */}
                    <div style={{ padding: '20px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 4px', color: 'var(--admin-text-main)' }}>Tema del Panel</p>
                            <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', margin: 0, fontWeight: 500 }}>Elige entre modo claro u oscuro para la interfaz.</p>
                        </div>
                        <select
                            value={String(settings!.tema ?? 'light')}
                            onChange={(e) => {
                                const newTheme = e.target.value;
                                setSettings({ ...settings!, tema: newTheme as 'light' | 'dark' });
                                if (onThemeChange) onThemeChange(newTheme);
                            }}
                            style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#f8fafc', color: 'var(--admin-text-main)', fontSize: '14px', fontFamily: 'inherit', fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
                            <option value="light">Modo Claro</option>
                            <option value="dark">Modo Oscuro</option>
                        </select>
                    </div>

                    {/* Toggles */}
                    {(['notificaciones', 'registro_automatico'] as const).map(key => {
                        const k = key as keyof SystemSettings;
                        return (
                            <div key={key} style={{ padding: '20px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 4px', color: 'var(--admin-text-main)' }}>
                                        {key === 'notificaciones' ? 'Notificaciones del Sistema' : 'Auto-aprobación de Registros'}
                                    </p>
                                    <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', margin: 0, fontWeight: 500 }}>
                                        {key === 'notificaciones' ? 'Recibe alertas en tiempo real de nuevos registros.' : 'Aprobar automáticamente solicitudes entrantes.'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleToggle(key)}
                                    style={{ width: '52px', height: '28px', borderRadius: '14px', backgroundColor: settings![k] ? '#16a34a' : '#cbd5e1', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0 }}>
                                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: settings![k] ? '27px' : '3px', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                </button>
                            </div>
                        );
                    })}

                    {/* Idioma */}
                    <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 4px', color: 'var(--admin-text-main)' }}>Idioma Predeterminado</p>
                            <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', margin: 0, fontWeight: 500 }}>Idioma de la interfaz del panel.</p>
                        </div>
                        <select
                            value={String(settings!.idioma ?? 'es')}
                            onChange={(e) => setSettings({ ...settings!, idioma: e.target.value as 'es' | 'en' })}
                            style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#f8fafc', color: 'var(--admin-text-main)', fontSize: '14px', fontFamily: 'inherit', fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
                            <option value="es">Español (CR)</option>
                            <option value="en">Inglés (US)</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleSave} disabled={saving} className="btn-new-entry">
                        {saving ? <><i className="fa-solid fa-circle-notch fa-spin" /> Guardando...</> : <><i className="fa-solid fa-floppy-disk" style={{ marginRight: 8 }} />Guardar Preferencias</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
