import React, { useState, useEffect } from 'react';
import '../../style/ModalNuevoRegistro.css';
import type { Competicion } from '../../types';

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
  onSave: (data: CompeticionFormData, id?: string) => void;
  editData?: Competicion | null;
}

export default function ModalNuevaCompeticion({ isOpen, onClose, onSave, editData = null }: ModalNuevaCompeticionProps): React.JSX.Element | null {
    const [formData, setFormData] = useState<CompeticionFormData>({
        nombre: '', deporte: 'Fútbol', fecha: '', fechaFin: '',
        ubicacion: '', descripcion: '', imagen: '', enlace: ''
    });

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
    }, [editData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!formData.nombre || !formData.fecha) {
            alert("Nombre y fecha son requeridos");
            return;
        }
        onSave(formData, editData?.id);
        onClose();
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
                        <button type="button" onClick={onClose}
                            style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: '600', color: '#64748b' }}>
                            Cancelar
                        </button>
                        <button type="submit"
                            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#e62334', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                            {editData ? 'Guardar Cambios' : 'Crear Evento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
