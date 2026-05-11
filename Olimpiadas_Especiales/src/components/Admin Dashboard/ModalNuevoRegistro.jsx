import React, { useState, useEffect } from 'react';
import '../../style/ModalNuevoRegistro.css';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import Swal from 'sweetalert2';

export default function ModalNuevoRegistro({ isOpen, onClose, onSaveSuccess, editData }) {
  const [selectedRole, setSelectedRole] = useState('atleta');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sport: '',
    region: 'San José',
    nombreAtleta: '',
    relacionConAtleta: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && editData) {
      setSelectedRole(editData.rol || 'atleta');
      setFormData({
        name: editData.name || editData.nombre || '',
        email: editData.email || editData.correoElectronico || '',
        phone: editData.phone || editData.telefono || '',
        sport: editData.sport || editData.disciplina || editData.disciplinaPrincipal || editData.otraArea || '',
        region: editData.region || editData.programa || 'San José',
        nombreAtleta: editData.nombreAtleta || '',
        relacionConAtleta: editData.relacionConAtleta || ''
      });
      setErrors({});
      setTouched({});
    } else if (isOpen) {
      setFormData({ name: '', email: '', phone: '', sport: '', region: 'San José', nombreAtleta: '', relacionConAtleta: '' });
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
      } else if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{3,50}$/.test(value)) {
        newErrors.name = 'El nombre debe tener entre 3 y 50 letras.';
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
      } else if (!/^\d{8,15}$/.test(cleanPhone)) {
        newErrors.phone = 'Debe tener entre 8 y 15 dígitos.';
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
    
    let processedValue = value;
    if (name === 'phone') {
        processedValue = value.replace(/\D/g, ''); // Solo números
    }
    
    setFormData({ ...formData, [name]: processedValue });
    if (touched[name]) {
      validate(name, processedValue);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ejecutar validaciones y obtener estado actual de errores
    let currentErrors = validate('name', formData.name, {});
    currentErrors = validate('email', formData.email, currentErrors);
    currentErrors = validate('phone', formData.phone, currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      setTouched({
        name: true,
        email: true,
        phone: true,
      });
      Swal.fire({
        icon: 'error',
        title: 'Formulario Incompleto',
        text: 'Por favor corregir los campos marcados en rojo antes de continuar.',
        confirmButtonColor: '#e62334'
      });
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
      rol: selectedRole,
      name: nameTrimmed,
      nombre: nameTrimmed, // Soporte ambos nombres de campo
      email: formData.email.trim().toLowerCase(),
      correoElectronico: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim().replace(/\s/g, ''),
      telefono: formData.phone.trim().replace(/\s/g, ''),
      region: formData.region,
      programa: formData.region,
      time: editData ? (editData.time || 'Editado ahora') : 'Registrado ahora',
      status: editData ? (editData.status || 'VERIFICACIÓN PEND.') : 'VERIFICACIÓN PEND.',
      statusColor: editData ? (editData.statusColor || 'yellow') : 'yellow',
      bgColor: editData ? (editData.bgColor || 'bg-light-blue') : 'bg-light-blue'
    };

    // Agregar campos específicos según rol
    if (selectedRole === 'atleta') payload.sport = formData.sport;
    if (selectedRole === 'entrenador') payload.disciplinaPrincipal = formData.sport;
    if (selectedRole === 'voluntario') payload.otraArea = formData.sport;
    if (selectedRole === 'tutor') {
      payload.nombreAtleta = formData.nombreAtleta;
      payload.relacionConAtleta = formData.relacionConAtleta;
    }

    const determineTable = (data) => {
        if (!data) return 'registros_pendientes';
        // Si el usuario ya está activo, deducimos su tabla original a partir de su rol
        if (data.status === 'ACTIVO' || data.rol || selectedRole) {
            const role = String(data.rol || selectedRole || 'atleta').toLowerCase();
            if (data.status !== 'ACTIVO' && !editData) return 'registros_pendientes';
            return {
                'atleta': 'atletas',
                'entrenador': 'entrenadores',
                'voluntario': 'voluntarios',
                'tutor': 'tutores'
            }[role] || 'atletas';
        }
        return 'registros_pendientes';
    };

    try {
      const targetTable = determineTable(editData);
      await ServicesAdmin.saveRegistro(payload, editData?.id, targetTable);
      setIsSubmitting(false);
      const action = editData ? "Actualización" : "Nuevo Registro";
      ServicesAdmin.logActivity(action, `${action} de ${nameTrimmed}`, editData ? "fa-solid fa-pen" : "fa-solid fa-user-plus", editData ? "purple" : "blue");
      
      Swal.fire({
        icon: 'success',
        title: editData ? '¡Actualizado!' : '¡Guardado!',
        text: editData ? 'El registro ha sido actualizado correctamente.' : 'El registro se ha guardado exitosamente en Pendientes.',
        timer: 2000,
        showConfirmButton: false
      });

      if (!editData) {
        setFormData({ name: '', email: '', phone: '', sport: 'Fútbol', region: 'San José' });
        setErrors({});
        setTouched({});
      }
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de Servidor',
        text: error.message || "No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.",
        confirmButtonColor: '#e62334'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <h2 style={{ fontSize: '20px', margin: 0 }}>
              {editData ? 'Editar Registro' : 'Nuevo Registro'}
            </h2>
          </div>
          <button className="btn-close-modal" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>

        {/* ROLE SELECTOR TABS */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '20px', padding: '0 5px' }}>
            {['atleta', 'voluntario', 'entrenador', 'tutor'].map(role => (
                <button
                    key={role}
                    type="button"
                    onClick={() => !editData && setSelectedRole(role)}
                    style={{
                        flex: 1,
                        padding: '10px 5px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        borderRadius: '8px',
                        border: 'none',
                        background: selectedRole === role ? '#e62334' : '#f1f5f9',
                        color: selectedRole === role ? 'white' : '#64748b',
                        cursor: editData ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: editData && selectedRole !== role ? 0.5 : 1
                    }}
                >
                    {role === 'tutor' ? 'Tutor/Fam' : role}
                </button>
            ))}
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <label>Nombre Completo del {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Ej. Juan Pérez" 
              value={formData.name} 
              onChange={handleChange} 
              onBlur={handleBlur}
              className={touched.name && errors.name ? 'input-error' : ''}
              autoComplete="off"
              required
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
                required
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
                required
              />
              {touched.phone && errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>
          
          {selectedRole === 'tutor' ? (
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                    <label>Nombre del Atleta Vinculado</label>
                    <input 
                        type="text" 
                        name="nombreAtleta" 
                        placeholder="Ej. Luis Pérez" 
                        value={formData.nombreAtleta} 
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Relación / Parentesco</label>
                    <select name="relacionConAtleta" value={formData.relacionConAtleta} onChange={handleChange}>
                        <option value="">Seleccione...</option>
                        <option value="Padre">Padre</option>
                        <option value="Madre">Madre</option>
                        <option value="Hermano(a)">Hermano(a)</option>
                        <option value="Tutor Legal">Tutor Legal</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
              </div>
          ) : (
            <div className="form-group">
                <label>
                    {selectedRole === 'entrenador' ? 'Disciplina Principal' : 
                     selectedRole === 'voluntario' ? 'Área de Interés / Deporte' : 'Deporte a Competir'}
                </label>
                <select name="sport" value={formData.sport} onChange={handleChange}>
                    <option value="">Seleccione Deporte...</option>
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
                </select>
            </div>
          )}
          
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
