import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../../style/ModalNuevoRegistro.css';
import { ServicesAtletas } from '../../services/ServicesAtletas';
import type { Atleta, Registro } from '../../types';

/* [verde] Interfaz para los datos temporales del formulario */
interface AtletaFormData {
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  fecha_nacimiento: string;
  genero: 'Masculino' | 'Femenino' | 'Otro';
  telefono: string;
  correo_electronico: string;
}

interface ModalNuevoRegistroProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  editData?: Registro | Atleta | null;
}

/* [verde] Componente Modal para el registro de nuevos atletas con conexión directa al Backend */
export default function ModalNuevoRegistro({ isOpen, onClose, onSaveSuccess, editData = null }: ModalNuevoRegistroProps): React.JSX.Element | null {
  const [formData, setFormData] = useState<AtletaFormData>({
    nombre: '', primer_apellido: '', segundo_apellido: '',
    fecha_nacimiento: '', genero: 'Masculino', telefono: '', correo_electronico: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /* [verde] Efecto para cargar datos en caso de edición o limpiar al crear nuevo */
  useEffect(() => {
    if (isOpen && editData) {
      // Mapeo de datos para edición (maneja campos de 'Registro' o 'Atleta')
      setFormData({
        nombre: (editData as any).nombre || (editData as any).name || '',
        primer_apellido: (editData as any).primer_apellido || '',
        segundo_apellido: (editData as any).segundo_apellido || '',
        fecha_nacimiento: (editData as any).fecha_nacimiento || (editData as any).fechaNacimiento || '',
        genero: (editData as any).genero || 'Masculino',
        telefono: (editData as any).telefono || (editData as any).phone || '',
        correo_electronico: (editData as any).correo_electronico || (editData as any).email || ''
      });
    } else if (isOpen) {
      setFormData({
        nombre: '', primer_apellido: '', segundo_apellido: '',
        fecha_nacimiento: '', genero: 'Masculino', telefono: '', correo_electronico: ''
      });
    }
  }, [isOpen, editData]);


  if (!isOpen) return null;

  /* [verde] Maneja los cambios en los inputs de forma genérica */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* [verde] Función principal para persistir los datos en la base de datos MySQL */
  const manejarGuardado = async () => {
    // [verde] Validación simple antes de enviar
    if (!formData.nombre || !formData.primer_apellido || !formData.fecha_nacimiento) {
      Swal.fire({ title: 'Campos requeridos', text: 'Por favor, complete los campos obligatorios.', icon: 'warning', confirmButtonColor: '#e62334' });
      return;
    }

    try {
      setIsSubmitting(true);
      
      /* [verde] Llamada al servicio que usa Axios (apiClient) */
      await ServicesAtletas.registrarAtleta(formData as Partial<Atleta>);
      
      Swal.fire({ title: '¡Registrado!', text: '¡Atleta registrado exitosamente!', icon: 'success', confirmButtonColor: '#e62334' });
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error("Error al registrar:", error);
      Swal.fire({ title: 'Error', text: 'Ocurrió un error al intentar conectar con el servidor.', icon: 'error', confirmButtonColor: '#e62334' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Nuevo Registro de Atleta Oficial</h2>
          <button className="btn-close-modal" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>

        <div className="modal-form">
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Juan" />
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Primer Apellido</label>
              <input type="text" name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} placeholder="Ej. Pérez" />
            </div>
            <div className="form-group">
              <label>Segundo Apellido</label>
              <input type="text" name="segundo_apellido" value={formData.segundo_apellido} onChange={handleChange} placeholder="Ej. Gómez" />
            </div>
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Género</label>
              <select name="genero" value={formData.genero} onChange={handleChange}>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" name="correo_electronico" value={formData.correo_electronico} onChange={handleChange} placeholder="atleta@correo.com" />
          </div>

          <div className="form-group">
            <label>Teléfono de Contacto</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="88887777" />
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button className="btn-cancel" onClick={onClose} disabled={isSubmitting} style={{ padding: '10px 20px', cursor: 'pointer' }}>
              Cancelar
            </button>
            {/* [verde] Usamos un botón con evento onClick, no un submit de formulario */}
            <button className="btn-primary-red" onClick={manejarGuardado} disabled={isSubmitting}
              style={{ padding: '10px 20px', backgroundColor: '#e62334', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              {isSubmitting ? 'Guardando...' : 'Registrar Atleta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
