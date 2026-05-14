import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../../style/ModalNuevoRegistro.css';
import type { Competicion } from '../../types';
import { ServicesAdmin } from '../../services/ServicesAdmin';

interface CompeticionFormData {
    nombre: string;
    deporte: string;
    fecha: string;
    fechaFin: string;
    ubicacion: string;
    descripcion: string;
    imagen: string;
    enlace: string;
    [key: string]: unknown;
}

interface ModalNuevaCompeticionProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
    editData?: Competicion | null;
}

export default function ModalNuevaCompeticion({ isOpen, onClose, onSaveSuccess, editData = null }: ModalNuevaCompeticionProps): React.JSX.Element | null {
    const [formData, setFormData] = useState<CompeticionFormData>({
        nombre: '', deporte: 'Fútbol', fecha: '', fechaFin: '',
        ubicacion: '', descripcion: '', imagen: '', enlace: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        if (editData) {
            setFormData({
                nombre: editData.nombre || '',
                deporte: editData.deporte || 'Fútbol',
                fecha: String(editData.fecha ?? ''),
                fechaFin: String(editData.fechaFin ?? ''),
                ubicacion: String(editData.ubicacion ?? ''),
                descripcion: String(editData.descripcion ?? ''),
                imagen: String(editData.imagen ?? ''),
                enlace: String(editData.enlace ?? '')
            });
        } else {
            setFormData({ nombre: '', deporte: 'Fútbol', fecha: '', fechaFin: '', ubicacion: '', descripcion: '', imagen: '', enlace: '' });
        }
        setApiError(null);
    }, [editData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setApiError(null);

        // Validación simple de campos obligatorios
        if (!formData.nombre || formData.nombre.trim() === '') {
            setApiError('El nombre del evento es obligatorio.');
            return;
        }
        if (!formData.fecha) {
            setApiError('La fecha de inicio es obligatoria.');
            return;
        }
        if (formData.fechaFin && formData.fechaFin < formData.fecha) {
            setApiError('La fecha de fin debe ser posterior o igual a la fecha de inicio.');
            return;
        }

        setIsSubmitting(true);
        try {
            await ServicesAdmin.saveCompeticion(formData, editData?.id ?? null);
            await ServicesAdmin.logActivity("Competición", `${editData?.id ? 'Edición' : 'Nueva'} competición: ${formData.nombre}`, "fa-solid fa-trophy", "yellow");

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Competición guardada con éxito',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });

            onSaveSuccess();
            onClose();
        } catch (error: unknown) {
            console.error("Error al guardar:", error);
            let errorMessage = 'Error desconocido al guardar la competición.';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            // Check for axios-like response errors safely
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const responseObj = (error as Record<string, any>).response;
                if (responseObj && responseObj.data && typeof responseObj.data.message === 'string') {
                    errorMessage = responseObj.data.message;
                }
            }

            setApiError(`Error del servidor: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldStyle: React.CSSProperties = {
        width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0',
        borderRadius: '8px', fontSize: '14px', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit'
    };

    const labelStyle: React.CSSProperties = {
        display: 'block', marginBottom: '6px', fontWeight: '600',
        fontSize: '13px', color: '#374151'
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '560px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h2 style={{ fontSize: '20px', color: '#1e293b' }}>
                        {editData ? '✏️ Editar Evento / Competición' : '🏆 Nuevo Evento o Competición'}
                    </h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {apiError && (
                        <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '8px', fontSize: '13px' }}>
                            <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>
                            {apiError}
                        </div>
                    )}

                    <div>
                        <label style={labelStyle}>Nombre del Evento *</label>
                        <input type="text" style={fieldStyle} value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            placeholder="Ej. Torneo Nacional de Verano 2026" />
                    </div>

                    <div>
                        <label style={labelStyle}>Deporte</label>
                        <select style={fieldStyle} value={formData.deporte}
                            onChange={(e) => setFormData({ ...formData, deporte: e.target.value })}>
                            <option>Fútbol</option><option>Baloncesto</option><option>Atletismo</option>
                            <option>Natación</option><option>Tenis</option><option>Ciclismo</option>
                            <option>Bolos</option><option>Gimnasia</option><option>Otro</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={labelStyle}>Fecha inicio *</label>
                            <input type="date" style={fieldStyle} value={formData.fecha}
                                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} />
                        </div>
                        <div>
                            <label style={labelStyle}>Fecha fin</label>
                            <input type="date" style={fieldStyle} value={formData.fechaFin}
                                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Ubicación</label>
                        <input type="text" style={fieldStyle} value={formData.ubicacion}
                            onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                            placeholder="Ej. Estadio Nacional, San José" />
                    </div>

                    <div>
                        <label style={labelStyle}>Descripción</label>
                        <textarea style={{ ...fieldStyle, minHeight: '90px', resize: 'vertical' }} value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            placeholder="Describe el evento, quiénes participan, qué se celebra..." />
                    </div>

                    <div>
                        <label style={labelStyle}>URL de imagen</label>
                        <input type="url" style={fieldStyle} value={formData.imagen}
                            onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                            placeholder="https://ejemplo.com/imagen.jpg" />
                        {formData.imagen && (
                            <img src={formData.imagen} alt="Vista previa"
                                style={{ marginTop: '8px', width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        )}
                    </div>

                    <div>
                        <label style={labelStyle}>Enlace externo</label>
                        <input type="url" style={fieldStyle} value={formData.enlace}
                            onChange={(e) => setFormData({ ...formData, enlace: e.target.value })}
                            placeholder="https://specialolympics.org/..." />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                        <button type="button" onClick={onClose} disabled={isSubmitting}
                            style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: '600', color: '#64748b', opacity: isSubmitting ? 0.6 : 1 }}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSubmitting}
                            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#e62334', color: 'white', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', opacity: isSubmitting ? 0.6 : 1 }}>
                            {isSubmitting && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                            {editData ? 'Guardar Cambios' : 'Crear Evento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
