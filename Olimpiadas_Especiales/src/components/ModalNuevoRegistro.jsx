import React, { useState, useEffect } from 'react';
import '../style/ModalNuevoRegistro.css';

export default function ModalNuevoRegistro({ isOpen, onClose, onSaveSuccess, editData }) {
  const [formData, setFormData] = useState({
    name: '',
    sport: 'Fútbol',
    region: 'San José'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && editData) {
      setFormData({
        name: editData.name,
        sport: editData.sport,
        region: editData.region
      });
      setErrors({});
    } else if (isOpen) {
      setFormData({ name: '', sport: 'Fútbol', region: 'San José' });
      setErrors({});
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const validate = (name, value) => {
    let newErrors = { ...errors };
    
    if (name === 'name') {
      if (!value.trim()) {
        newErrors.name = 'El nombre es requerido.';
      } else if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        newErrors.name = 'El nombre solo debe contener letras.';
      } else {
        delete newErrors.name;
      }
    }
    
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validate(name, value);
  };

  const handleBlur = (e) => {
    validate(e.target.name, e.target.value);
  };

  // El botón será deshabilitado si hay errores, o si el nombre está vacío.
  const hasErrors = Object.keys(errors).length > 0 || !formData.name.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasErrors) return;

    setIsSubmitting(true);

    const words = formData.name.trim().split(' ');
    let initials = 'AT';
    if (words.length > 1) {
      initials = (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1 && words[0].length > 0) {
      initials = words[0].substring(0, Math.min(2, words[0].length)).toUpperCase();
    }

    if (editData) {
      // Editar existente
      fetch(`http://localhost:3001/registros_pendientes/${editData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initials,
          name: formData.name.trim(),
          sport: formData.sport,
          region: formData.region
        })
      })
      .then(res => res.json())
      .then(() => {
        setIsSubmitting(false);
        onSaveSuccess();
        onClose();
      })
      .catch(error => {
        console.error("Error al actualizar:", error);
        alert("Hubo un error al actualizar el registro.");
        setIsSubmitting(false);
      });
    } else {
      // Crear nuevo
      const newEntry = {
        initials: initials,
        name: formData.name.trim(),
        time: 'Registrado ahora',
        sport: formData.sport,
        region: formData.region,
        status: 'VERIFICACIÓN PEND.',
        statusColor: 'yellow',
        bgColor: 'bg-light-blue'
      };

      fetch('http://localhost:3001/registros_pendientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      })
        .then(res => res.json())
        .then(() => {
          setIsSubmitting(false);
          setFormData({ name: '', sport: 'Fútbol', region: 'San José' });
          setErrors({});
          onSaveSuccess();
          onClose();
        })
        .catch(error => {
          console.error("Error al guardar:", error);
          alert("Hubo un error al guardar el registro.");
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Nuevo Registro de Atleta</h2>
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
              className={errors.name ? 'input-error' : ''}
              autoComplete="off"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
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
          
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className="btn-primary-red" disabled={isSubmitting || hasErrors}>
              {isSubmitting ? 'Guardando...' : 'Guardar en Base de Datos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
