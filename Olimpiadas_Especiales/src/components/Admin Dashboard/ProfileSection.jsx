import React, { useState, useEffect } from 'react';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import '../../style/AdminDashboard.css';
import Swal from 'sweetalert2';

export default function ProfileSection() {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.nombre || !formData.nombre.trim()) {
            Swal.fire('Error', 'El Nombre Completo es obligatorio.', 'error');
            return;
        }
        const currentEmail = formData.email || '';
        if (!currentEmail.trim()) {
            Swal.fire('Error', 'El Correo Electrónico es obligatorio.', 'error');
            return;
        }
        if (!formData.telefono || !formData.telefono.trim()) {
            Swal.fire('Error', 'El Teléfono es obligatorio.', 'error');
            return;
        }

        Swal.fire({
            title: 'Actualizando...',
            didOpen: () => { Swal.showLoading(); },
            allowOutsideClick: false
        });

        ServicesAdmin.updateProfile(formData.id, formData)
            .then(updated => {
                setProfile(updated);
                setEditMode(false);
                setShowPassword(false);
                ServicesAdmin.logActivity("Perfil", "Se actualizó la información del perfil administrador", "fa-solid fa-user-pen", "blue");
                Swal.fire({
                    icon: 'success',
                    title: 'Perfil Actualizado',
                    text: 'Los cambios se han guardado correctamente.',
                    timer: 2000,
                    showConfirmButton: false
                });
            })
            .catch(err => Swal.fire('Error', 'No se pudo actualizar el perfil: ' + err.message, 'error'));
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando perfil...</div>;
    if (!profile) return <div style={{ padding: '40px', textAlign: 'center' }}>Error al cargar perfil</div>;

    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--admin-white)', borderRadius: '15px', padding: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid var(--admin-border)' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e62334', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                        <i className={profile.avatar}></i>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '24px', color: 'var(--admin-text-main)', marginBottom: '5px' }}>{profile.nombre}</h2>
                        <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>{profile.cargo}</p>
                    </div>
                    <button 
                        onClick={() => setEditMode(!editMode)}
                        style={{ marginLeft: 'auto', padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)', cursor: 'pointer', fontSize: '14px' }}
                    >
                        {editMode ? 'Cancelar' : 'Editar Perfil'}
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)' }}>NOMBRE COMPLETO</label>
                            <input 
                                type="text"
                                className="form-control"
                                value={formData.nombre}
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                disabled={!editMode}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)' }}
                                required
                                pattern=".*\S+.*"
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)' }}>CORREO ELECTRÓNICO</label>
                            <input 
                                type="email"
                                className="form-control"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                disabled={!editMode}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)' }}
                                required
                                pattern=".*\S+.*"
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)' }}>TELÉFONO</label>
                            <input 
                                type="text"
                                className="form-control"
                                value={formData.telefono}
                                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                                disabled={!editMode}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)' }}>CARGO / ROL</label>
                            <input 
                                type="text"
                                className="form-control"
                                value={formData.cargo}
                                onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                                disabled={!editMode}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)' }}>CONTRASEÑA</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    value={formData.password || ''}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    disabled={!editMode}
                                    style={{ width: '100%', padding: '12px', paddingRight: '45px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)' }}
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}
                                >
                                    <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)' }}>BIOGRAFÍA BREVE</label>
                        <textarea 
                            className="form-control"
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            disabled={!editMode}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-white)', color: 'var(--admin-text-main)', height: '100px', resize: 'none' }}
                        />
                    </div>

                    {editMode && (
                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                type="submit"
                                className="btn-new-entry"
                                style={{ backgroundColor: '#e62334', border: 'none', color: 'white', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
