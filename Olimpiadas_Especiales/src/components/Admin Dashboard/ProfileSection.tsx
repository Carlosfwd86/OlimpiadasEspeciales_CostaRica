import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import '../../style/AdminDashboard.css';
import type { AdminProfile } from '../../types';

export default function ProfileSection(): React.JSX.Element {
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<AdminProfile>({ id: '', nombre: '', email: '', rol: '' });
    const [loading, setLoading] = useState<boolean>(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        ServicesAdmin.getProfile()
            .then(data => {
                setProfile(data);
                setFormData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        ServicesAdmin.updateProfile({
            nombre: formData.nombre,
            correoElectronico: formData.email,
            avatar: formData.avatar
        })
            .then(updated => {
                setProfile(updated);
                setEditMode(false);
                ServicesAdmin.logActivity("Perfil", "Se actualizó la información del perfil administrador", "fa-solid fa-user-pen", "blue");
                Swal.fire({ title: '¡Actualizado!', text: 'Perfil actualizado correctamente.', icon: 'success', confirmButtonColor: '#e62334' });
            })
            .catch(err => Swal.fire({ title: 'Error', text: 'Error al actualizar: ' + (err as Error).message, icon: 'error', confirmButtonColor: '#e62334' }));
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando perfil...</div>;
    if (!profile) return <div style={{ padding: '40px', textAlign: 'center' }}>Error al cargar perfil</div>;

    const currentAvatar = editMode ? formData.avatar : profile.avatar;
    const isUrl = currentAvatar && (currentAvatar.startsWith('http') || currentAvatar.startsWith('data:image'));

    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--admin-white)', borderRadius: '15px', padding: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid var(--admin-border)' }}>
                    <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e62334', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', overflow: 'hidden' }}>
                        {isUrl ? (
                            <img src={currentAvatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <i className={String(currentAvatar ?? 'fa-solid fa-user')}></i>
                        )}
                        {editMode && (
                            <>
                                <div 
                                    style={{ position: 'absolute', bottom: 0, width: '100%', height: '30%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px' }}
                                    onClick={() => fileInputRef.current?.click()}
                                    title="Cambiar foto"
                                >
                                    <i className="fa-solid fa-camera"></i>
                                </div>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    ref={fileInputRef} 
                                    style={{ display: 'none' }} 
                                    onChange={handleImageUpload} 
                                />
                            </>
                        )}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '24px', color: 'var(--admin-text-main)', marginBottom: '5px' }}>{String(profile.nombre ?? '')}</h2>
                        <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>{String(profile.cargo ?? '')}</p>
                    </div>
                    <button onClick={() => {
                        if (editMode) setFormData(profile);
                        setEditMode(!editMode);
                    }}
                        style={{ marginLeft: 'auto', padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)', cursor: 'pointer', fontSize: '14px' }}>
                        {editMode ? 'Cancelar' : 'Editar Perfil'}
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {(['nombre', 'email', 'telefono', 'cargo'] as const).map((key) => (
                            <div key={key} className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)' }}>
                                    {key === 'nombre' ? 'NOMBRE COMPLETO' : key === 'email' ? 'CORREO ELECTRÓNICO' : key === 'telefono' ? 'TELÉFONO' : 'CARGO / ROL'}
                                </label>
                                <input type={key === 'email' ? 'email' : 'text'} className="form-control"
                                    value={String(formData[key] ?? '')}
                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                    disabled={!editMode}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)' }} />
                            </div>
                        ))}
                    </div>

                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)' }}>BIOGRAFÍA BREVE</label>
                        <textarea className="form-control"
                            value={String(formData.bio ?? '')}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            disabled={!editMode}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)', height: '100px', resize: 'none' }} />
                    </div>

                    {editMode && (
                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn-new-entry"
                                style={{ backgroundColor: '#e62334', border: 'none', color: 'white', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                                Guardar Cambios
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
