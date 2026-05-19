import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../../style/ModalNuevoRegistro.css';
import { ServicesUsuarios } from '../../services/ServicesUsuarios';

interface ModalNuevoUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function ModalNuevoUsuario({ isOpen, onClose, onSaveSuccess }: ModalNuevoUsuarioProps): React.JSX.Element | null {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    correoElectronico: '',
    password: '',
    rol_id: 6, // Usuario General por defecto
    telefono: '',
    pais: 'Costa Rica',
    genero: 'Otro'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'rol_id' ? parseInt(value) : value });
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.correoElectronico || !formData.password) {
      Swal.fire({ title: 'Campos requeridos', text: 'Por favor complete los campos obligatorios (Nombre, Email, Contraseña).', icon: 'warning', confirmButtonColor: '#e62334' });
      return;
    }

    try {
      setIsSubmitting(true);
      await ServicesUsuarios.createUsuario(formData);
      Swal.fire({ title: '¡Creado!', text: 'Usuario creado exitosamente.', icon: 'success', confirmButtonColor: '#e62334' });
      onSaveSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error al crear usuario:", error);
      Swal.fire({ title: 'Error', text: error.response?.data?.error || "Error al crear el usuario.", icon: 'error', confirmButtonColor: '#e62334' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>Crear Nuevo Usuario Administrativo</h2>
          <button className="btn-close-modal" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>

        <div className="modal-form">
          <div className="form-group">
            <label>Nombre Completo *</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Pedro Pérez" />
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Identificación (Cédula)</label>
              <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} placeholder="123456789" />
            </div>
            <div className="form-group">
              <label>Rol del Sistema</label>
              <select name="rol_id" value={formData.rol_id} onChange={handleChange}>
                <option value={1}>Administrador</option>
                <option value={2}>Atleta</option>
                <option value={3}>Entrenador</option>
                <option value={4}>Voluntario</option>
                <option value={5}>Tutor</option>
                <option value={6}>Usuario General</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Correo Electrónico *</label>
            <input type="email" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange} placeholder="usuario@correo.com" />
          </div>

          <div className="form-group">
            <label>Contraseña *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="********" />
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Teléfono</label>
              <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="88887777" />
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

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button className="btn-cancel" onClick={onClose} disabled={isSubmitting} style={{ padding: '10px 20px', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button className="btn-primary-red" onClick={handleSave} disabled={isSubmitting}
              style={{ padding: '10px 20px', backgroundColor: '#e62334', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              {isSubmitting ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
