import React from 'react';
import '../../style/ModalNuevoRegistro.css';
import Swal from 'sweetalert2';

export default function ModalNuevaCompeticion({ isOpen, onClose, onSave, editData = null }) {
    const [formData, setFormData] = React.useState({
        nombre: '',
        categoria: 'Fútbol',
        fecha: '',
        fechaFin: '',
        ubicacion: '',
        resumen: '',
        img: '',
        enlace: ''
    });

    React.useEffect(() => {
        if (editData) {
            setFormData({
                nombre: editData.nombre || '',
                categoria: editData.categoria || editData.deporte || 'Fútbol',
                fecha: editData.fecha || '',
                fechaFin: editData.fechaFin || '',
                ubicacion: editData.ubicacion || '',
                resumen: editData.resumen || editData.descripcion || '',
                img: editData.img || editData.imagen || '',
                enlace: editData.enlace || ''
            });
        } else {
            setFormData({
                nombre: '',
                categoria: 'Fútbol',
                fecha: '',
                fechaFin: '',
                ubicacion: '',
                resumen: '',
                img: '',
                enlace: ''
            });
        }
    }, [editData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.nombre.trim() || !formData.fecha || !formData.ubicacion.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Campos Incompletos',
                text: 'El Nombre, la Fecha de inicio y la Ubicación son datos obligatorios para registrar un evento.',
                confirmButtonColor: '#e62334'
            });
            return;
        }
        
        onSave(formData, editData?.id);
        onClose();
    };

    const fieldStyle = {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '6px',
        fontWeight: '600',
        fontSize: '13px',
        color: '#374151'
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

                    {/* Nombre */}
                    <div>
                        <label style={labelStyle}>Nombre del Evento *</label>
                        <input
                            type="text"
                            style={fieldStyle}
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            placeholder="Ej. Torneo Nacional de Verano 2026"
                            required
                            pattern=".*\S+.*"
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Deporte / Categoría *</label>
                        <select
                            style={fieldStyle}
                            value={formData.categoria}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        >
                            <option value="Atletismo">Atletismo</option>
                            <option value="Baloncesto">Baloncesto</option>
                            <option value="Balonmano">Balonmano</option>
                            <option value="Bochas">Bochas</option>
                            <option value="Ciclismo">Ciclismo</option>
                            <option value="Deportes de Invierno">Deportes de Invierno</option>
                            <option value="Ecuestre">Ecuestre</option>
                            <option value="Fútbol">Fútbol</option>
                            <option value="Gimnasia Rítmica">Gimnasia Rítmica</option>
                            <option value="Halterofilia">Halterofilia</option>
                            <option value="Judo">Judo</option>
                            <option value="Natación">Natación</option>
                            <option value="Tenis de Campo">Tenis de Campo</option>
                            <option value="Tenis de Mesa">Tenis de Mesa</option>
                            <option value="Triatlón">Triatlón</option>
                            <option value="Voleibol">Voleibol</option>
                            <option value="Varios/Multideportivo">Varios / Multideportivo</option>
                        </select>
                    </div>

                    {/* Fechas en fila */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={labelStyle}>Fecha inicio *</label>
                            <input
                                type="date"
                                style={fieldStyle}
                                value={formData.fecha}
                                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Fecha fin</label>
                            <input
                                type="date"
                                style={fieldStyle}
                                value={formData.fechaFin}
                                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Sede / Ubicación *</label>
                        <input
                            type="text"
                            style={fieldStyle}
                            value={formData.ubicacion}
                            onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                            placeholder="Ej. Estadio Nacional, La Sabana"
                            required
                            pattern=".*\S+.*"
                        />
                    </div>

                    {/* Resumen / Descripción */}
                    <div>
                        <label style={labelStyle}>Resumen / Descripción</label>
                        <textarea
                            style={{ ...fieldStyle, minHeight: '90px', resize: 'vertical' }}
                            value={formData.resumen}
                            onChange={(e) => setFormData({ ...formData, resumen: e.target.value })}
                            placeholder="Describe el evento, quiénes participan, qué se celebra..."
                        />
                    </div>

                    {/* URL imagen /img/... */}
                    <div>
                        <label style={labelStyle}>Ruta de imagen (Local o URL)</label>
                        <input
                            type="text"
                            style={fieldStyle}
                            value={formData.img}
                            onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                            placeholder="Ej: /img/evento_competencia.png o https://url.com/img.png"
                        />
                        {formData.img && (
                            <img
                                src={formData.img}
                                alt="Vista previa"
                                style={{ marginTop: '8px', width: '100%', height: '120px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        )}
                    </div>

                    {/* Enlace externo */}
                    <div>
                        <label style={labelStyle}>Enlace externo</label>
                        <input
                            type="url"
                            style={fieldStyle}
                            value={formData.enlace}
                            onChange={(e) => setFormData({ ...formData, enlace: e.target.value })}
                            placeholder="https://specialolympics.org/..."
                        />
                    </div>

                    {/* Botones */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: '600', color: '#64748b' }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#e62334', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
                        >
                            {editData ? 'Guardar Cambios' : 'Crear Evento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
