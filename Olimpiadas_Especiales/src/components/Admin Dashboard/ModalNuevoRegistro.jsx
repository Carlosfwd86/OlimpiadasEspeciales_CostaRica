import React, { useState, useEffect } from 'react';
import '../../style/ModalNuevoRegistro.css';
import { ServicesAdmin } from '../../services/ServicesAdmin';

export default function ModalNuevoRegistro({ isOpen, onClose, onSaveSuccess, editData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sport: 'Fútbol',
    region: 'San José'
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && editData) {
      setFormData({
        name: editData.name || '',
        email: editData.email || '',
        phone: editData.phone || '',
        sport: editData.sport || 'Fútbol',
        region: editData.region || 'San José'
      });
      setErrors({});
      setTouched({});
    } else if (isOpen) {
      setFormData({ name: '', email: '', phone: '', sport: 'Fútbol', region: 'San José' });
      setErrors({});
      setTouched({});
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

    const validate = (name, value, currentErrors = errors) => {
    let newErrors = { ...currentErrors };
    
    if (name === 'name') {
      if (!value || !value.trim()) {
        newErrors.name = 'El nombre es requerido.';
      } else if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        newErrors.name = 'El nombre solo debe contener letras.';
      } else {
        delete newErrors.name;
      }
    }

    if (name === 'email') {
      if (!value || !value.trim()) {
        newErrors.email = 'El correo es requerido.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = 'Formato de correo inválido.';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'phone') {
      const cleanPhone = (value || '').replace(/\s/g, '');
      if (!value || !value.trim()) {
        newErrors.phone = 'El teléfono es requerido.';
      } else if (!/^\d{8,10}$/.test(cleanPhone)) {
        newErrors.phone = 'Debe tener entre 8 y 10 dígitos.';
      } else {
        delete newErrors.phone;
      }
    }
    
    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Evitar que el primer carácter sea un espacio en blanco
    if (value.startsWith(' ')) return;
    
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      validate(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validate(name, value);
  };

  // El botón será deshabilitado si está enviando.
  // La validación se hará al intentar enviar.
  const hasErrors = Object.keys(errors).length > 0 || !formData.name.trim() || !formData.email.trim() || !formData.phone.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ejecutar validaciones y obtener estado actual de errores
    let currentErrors = validate('name', formData.name, {});
    currentErrors = validate('email', formData.email, currentErrors);
    currentErrors = validate('phone', formData.phone, currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      alert("Por favor corrige los errores antes de continuar.");
      return;
    }

    setIsSubmitting(true);

    const nameTrimmed = formData.name.trim();
    const words = nameTrimmed.split(' ');
    let initials = 'AT';
    if (words.length > 1) {
      initials = (words[0][0] + (words[1][0] || '')).toUpperCase();
    } else if (words.length === 1 && words[0].length > 0) {
      initials = words[0].substring(0, Math.min(2, words[0].length)).toUpperCase();
    }

    const payload = {
      initials,
      name: nameTrimmed,
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim().replace(/\s/g, ''),
      sport: formData.sport,
      region: formData.region,
      time: editData ? (editData.time || 'Editado ahora') : 'Registrado ahora',
      status: editData ? (editData.status || 'VERIFICACIÓN PEND.') : 'VERIFICACIÓN PEND.',
      statusColor: editData ? (editData.statusColor || 'yellow') : 'yellow',
      bgColor: editData ? (editData.bgColor || 'bg-light-blue') : 'bg-light-blue'
    };

    ServicesAdmin.saveRegistro(payload, editData?.id)
        .then(() => {
          setIsSubmitting(false);
          const action = editData ? "Actualización" : "Nuevo Registro";
          ServicesAdmin.logActivity(action, `${action} de ${nameTrimmed}`, editData ? "fa-solid fa-pen" : "fa-solid fa-user-plus", editData ? "purple" : "blue");
          
          if (!editData) {
            setFormData({ name: '', email: '', phone: '', sport: 'Fútbol', region: 'San José' });
            setErrors({});
            setTouched({});
            alert("¡Registro guardado exitosamente en Pendientes!");
          } else {
            alert("¡Registro actualizado exitosamente!");
          }
          onSaveSuccess();
          onClose();
        })
        .catch(error => {
          console.error("Error al guardar:", error);
          alert("Error: " + (error.message || "No se pudo conectar con el servidor"));
          setIsSubmitting(false);
        });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editData ? 'Editar Registro' : 'Nuevo Registro de Atleta'}</h2>
          <button className="btn-close-modal" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nombre Completo del Atleta</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Ej. Juan Pérez" 
              value={formData.name} 
              onChange={handleChange} 
              onBlur={handleBlur}
              className={touched.name && errors.name ? 'input-error' : ''}
              autoComplete="off"
            />
            {touched.name && errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                name="email" 
                placeholder="juan@correo.com" 
                value={formData.email} 
                onChange={handleChange} 
                onBlur={handleBlur}
                className={touched.email && errors.email ? 'input-error' : ''}
              />
              {touched.email && errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label>Teléfono</label>
              <input 
                type="text" 
                name="phone" 
                placeholder="88887777" 
                value={formData.phone} 
                onChange={handleChange} 
                onBlur={handleBlur}
                className={touched.phone && errors.phone ? 'input-error' : ''}
              />
              {touched.phone && errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label>Deporte a Competir</label>
            <select name="sport" value={formData.sport} onChange={handleChange}>
              <option value="Fútbol">Fútbol</option>
              <option value="Natación">Natación</option>
              <option value="Atletismo">Atletismo</option>
              <option value="Bochas">Bochas</option>
              <option value="Baloncesto">Baloncesto</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Región / Provincia</label>
            <select name="region" value={formData.region} onChange={handleChange}>
              <option value="San José">San José</option>
              <option value="Alajuela">Alajuela</option>
              <option value="Cartago">Cartago</option>
              <option value="Heredia">Heredia</option>
              <option value="Guanacaste">Guanacaste</option>
              <option value="Puntarenas">Puntarenas</option>
              <option value="Limón">Limón</option>
            </select>
          </div>
          
          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose} 
              disabled={isSubmitting}
              style={{ padding: '10px 20px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary-red" 
              disabled={isSubmitting}
              style={{ padding: '10px 20px', backgroundColor: '#e62334', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {isSubmitting ? 'Guardando...' : (editData ? 'Actualizar Registro' : 'Guardar Registro')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
