import React, { useState, useEffect } from 'react';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import '../../style/AdminDashboard.css';
import type { SystemSettings } from '../../types';
import ModalNuevoUsuario from './ModalNuevoUsuario';

interface SettingsSectionProps {
  onThemeChange?: (theme: string) => void;
  initialSubTab?: string;
  searchQuery?: string;
}

export default function SettingsSection({ onThemeChange, initialSubTab = 'usuarios', searchQuery = '' }: SettingsSectionProps): React.JSX.Element {
    const [settings, setSettings] = useState<SystemSettings | null>(null);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [subTab, setSubTab] = useState<string>(initialSubTab);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
    const [localSearch, setLocalSearch] = useState<string>('');

    const loadUsers = async () => {
        try {
            const u = await ServicesAdmin.getUsers();
            setUsuarios(u);
        } catch (err) {
            console.error("Error al cargar usuarios:", err);
        }
    };

    const [perfil, setPerfil] = useState<{ nombre: string; correoElectronico: string; passwordActual: string; passwordNuevo: string }>({
        nombre: '', correoElectronico: '', passwordActual: '', passwordNuevo: ''
    });
    const [savingPerfil, setSavingPerfil] = useState<boolean>(false);
    const [adminId, setAdminId] = useState<string | number | null>(null);

    useEffect(() => { setSubTab(initialSubTab); }, [initialSubTab]);

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
                alert("Configuración guardada correctamente");
            })
            .catch(err => {
                alert("Error al guardar: " + (err as Error).message);
                setSaving(false);
            });
    };

    const handleSavePerfil = (): void => {
        if (!adminId) return;
        setSavingPerfil(true);
        const payload: any = {
            nombre: perfil.nombre,
            email: perfil.correoElectronico
        };
        if (perfil.passwordActual) payload.passwordActual = perfil.passwordActual;
        if (perfil.passwordNuevo) payload.passwordNuevo = perfil.passwordNuevo;

        ServicesAdmin.updateProfile(adminId, payload)
            .then(() => {
                setSavingPerfil(false);
                ServicesAdmin.logActivity("Perfil", "Se actualizaron los datos del perfil administrador", "fa-solid fa-user-pen", "blue");
                alert("Perfil actualizado correctamente");
                setPerfil(prev => ({ ...prev, passwordActual: '', passwordNuevo: '' }));
            })
            .catch(err => {
                setSavingPerfil(false);
                alert("Error al actualizar perfil: " + (err as Error).message);
            });
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-main)' }}>Cargando configuración...</div>;
    if (!settings) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-main)' }}>Error al cargar configuración</div>;

    const tabBtnStyle = (tab: string): React.CSSProperties => ({
        background: 'none', border: 'none', padding: '10px 20px', fontSize: '18px',
        fontWeight: '700', color: subTab === tab ? '#e62334' : 'var(--admin-text-muted)',
        borderBottom: subTab === tab ? '3px solid #e62334' : '3px solid transparent',
        cursor: 'pointer', transition: 'all 0.3s'
    });

    const getRoleName = (rolId: number): string => {
        const roles: Record<number, string> = {
            1: 'Administrador',
            2: 'Atleta',
            3: 'Entrenador',
            4: 'Voluntario',
            5: 'Tutor',
            6: 'Usuario General'
        };
        return roles[rolId] || 'Usuario';
    };

    const filteredUsers = usuarios.filter(u => {
        const q = (localSearch || searchQuery).toLowerCase();
        const name = `${u.nombre ?? ''} ${u.apellido ?? ''}`.toLowerCase();
        const email = (u.correo_electronico || u.email || '').toLowerCase();
        return name.includes(q) || email.includes(q);
    });

    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: '30px', marginBottom: '25px', paddingLeft: '10px' }}>
                    <button onClick={() => setSubTab('usuarios')} style={tabBtnStyle('usuarios')}>Usuarios</button>
                    <button onClick={() => setSubTab('configuracion')} style={tabBtnStyle('configuracion')}>Configuración</button>
                    <button onClick={() => setSubTab('perfil')} style={tabBtnStyle('perfil')}>Mi Perfil</button>
                </div>

                {subTab === 'usuarios' ? (
                    <div style={{ background: 'var(--admin-white)', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: 'var(--admin-text-main)' }}>Gestión de Usuarios</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ position: 'relative' }}>
                                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '14px' }}></i>
                                    <input 
                                        type="text" 
                                        placeholder="Buscar usuarios..." 
                                        value={localSearch}
                                        onChange={(e) => setLocalSearch(e.target.value)}
                                        style={{ padding: '10px 15px 10px 35px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '14px', width: '250px', background: 'var(--admin-white)', color: 'var(--admin-text-main)' }}
                                    />
                                </div>
                                <button className="btn-new-entry" onClick={() => setIsUserModalOpen(true)}>+ Nuevo Usuario</button>
                            </div>
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
                                    {filteredUsers.length > 0 ? filteredUsers.map(u => (
                                        <tr key={String(u.id)} style={{ borderBottom: '1px solid var(--admin-border)', fontSize: '14px', color: 'var(--admin-text-main)' }}>
                                            <td style={{ padding: '15px' }}>{String(u.nombre ?? '')} {String(u.apellido ?? '')}</td>
                                            <td style={{ padding: '15px' }}>{String(u.correo_electronico || u.email || '')}</td>
                                            <td style={{ padding: '15px' }}>{u.rol?.nombre || getRoleName(u.rol_id)}</td>
                                            <td style={{ padding: '15px' }}>
                                                <span style={{ 
                                                    padding: '4px 8px', 
                                                    borderRadius: '4px', 
                                                    background: u.status === 'ACTIVO' ? '#e6ffed' : '#fff5f5', 
                                                    color: u.status === 'ACTIVO' ? '#28a745' : '#e62334', 
                                                    fontSize: '12px', 
                                                    fontWeight: '600' 
                                                }}>
                                                    {String(u.status || 'ACTIVO')}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '10px' }}><i className="fa-solid fa-pen"></i></button>
                                                <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                                    onClick={() => {
                                                        if (window.confirm(`¿Seguro que deseas eliminar a ${String(u.nombre ?? '')}?`)) {
                                                            ServicesAdmin.deleteUser(String(u.id)).then(() => loadUsers());
                                                        }
                                                    }}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
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
                ) : subTab === 'perfil' ? (
                    <div style={{ background: 'var(--admin-white)', borderRadius: '15px', padding: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '24px', color: 'var(--admin-text-main)', marginBottom: '10px' }}>Mi Perfil</h2>
                        <p style={{ color: 'var(--admin-text-muted)', marginBottom: '30px', fontSize: '14px' }}>Actualiza tus datos de acceso al panel administrativo.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: 'var(--admin-text-main)', fontSize: '14px' }}>Nombre completo</label>
                                <input
                                    type="text"
                                    value={perfil.nombre}
                                    onChange={e => setPerfil(prev => ({ ...prev, nombre: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)', fontSize: '14px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: 'var(--admin-text-main)', fontSize: '14px' }}>Correo electrónico</label>
                                <input
                                    type="email"
                                    value={perfil.correoElectronico}
                                    onChange={e => setPerfil(prev => ({ ...prev, correoElectronico: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)', fontSize: '14px' }}
                                />
                            </div>
                            <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '20px', marginTop: '5px' }}>
                                <p style={{ color: 'var(--admin-text-muted)', fontSize: '13px', marginBottom: '15px' }}>Dejar en blanco si no deseas cambiar la contraseña.</p>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: 'var(--admin-text-main)', fontSize: '14px' }}>Contraseña actual</label>
                                <input
                                    type="password"
                                    value={perfil.passwordActual}
                                    onChange={e => setPerfil(prev => ({ ...prev, passwordActual: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)', fontSize: '14px', marginBottom: '15px' }}
                                />
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: 'var(--admin-text-main)', fontSize: '14px' }}>Nueva contraseña</label>
                                <input
                                    type="password"
                                    value={perfil.passwordNuevo}
                                    onChange={e => setPerfil(prev => ({ ...prev, passwordNuevo: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)', fontSize: '14px' }}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={handleSavePerfil} disabled={savingPerfil} className="btn-new-entry"
                                style={{ backgroundColor: '#e62334', border: 'none', color: 'white', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                                {savingPerfil ? 'Guardando...' : 'Guardar Perfil'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ background: 'var(--admin-white)', borderRadius: '15px', padding: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '24px', color: 'var(--admin-text-main)', marginBottom: '10px' }}>Configuración del Sistema</h2>
                        <p style={{ color: 'var(--admin-text-muted)', marginBottom: '30px', fontSize: '14px' }}>Personaliza el comportamiento y la apariencia del panel administrativo.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--admin-border)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--admin-text-main)' }}>Apariencia</h3>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontWeight: '500', fontSize: '14px', margin: 0, color: 'var(--admin-text-main)' }}>Tema del Panel</p>
                                        <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: 0 }}>Elige entre modo claro u oscuro para la interfaz.</p>
                                    </div>
                                    <select value={String(settings.tema ?? 'light')}
                                        onChange={(e) => {
                                            const newTheme = e.target.value;
                                            setSettings({ ...settings, tema: newTheme as 'light' | 'dark' });
                                            if (onThemeChange) onThemeChange(newTheme);
                                        }}
                                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)' }}>
                                        <option value="light">Modo Claro</option>
                                        <option value="dark">Modo Oscuro</option>
                                    </select>
                                </div>
                            </div>
                            {['notificaciones', 'registro_automatico'].map(key => {
                                const k = key as keyof SystemSettings;
                                return (
                                    <div key={key} style={{ paddingBottom: '20px', borderBottom: '1px solid var(--admin-border)' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--admin-text-main)' }}>
                                            {key === 'notificaciones' ? 'Notificaciones' : 'Automatización'}
                                        </h3>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{ fontWeight: '500', fontSize: '14px', margin: 0, color: 'var(--admin-text-main)' }}>
                                                    {key === 'notificaciones' ? 'Notificaciones de Sistema' : 'Auto-aprobación de Registros'}
                                                </p>
                                            </div>
                                            <button onClick={() => handleToggle(key)}
                                                style={{ width: '50px', height: '26px', borderRadius: '13px', backgroundColor: settings[k] ? '#22c55e' : '#cbd5e1', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: settings[k] ? '27px' : '3px', transition: 'left 0.3s' }}></div>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--admin-text-main)' }}>Regional</h3>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontWeight: '500', fontSize: '14px', margin: 0, color: 'var(--admin-text-main)' }}>Idioma Predeterminado</p>
                                    </div>
                                    <select value={String(settings.idioma ?? 'es')}
                                        onChange={(e) => setSettings({ ...settings, idioma: e.target.value as 'es' | 'en' })}
                                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)' }}>
                                        <option value="es">Español (CR)</option>
                                        <option value="en">Inglés (US)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={handleSave} disabled={saving} className="btn-new-entry"
                                style={{ backgroundColor: '#e62334', border: 'none', color: 'white', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                                {saving ? 'Guardando...' : 'Guardar Preferencias'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
