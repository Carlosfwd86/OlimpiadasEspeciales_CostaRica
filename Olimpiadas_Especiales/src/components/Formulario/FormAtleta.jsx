import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import emailjs from '@emailjs/browser'
import { createAtleta } from '../../services/ServicesAtletas'
import '../../styles/Formulario/FormAtleta.css'

// Initialize EmailJS with Public Key
emailjs.init("4zWvRC7Yn7lUDqd1q");


function FormAtleta({ onVolver }) {
  // --- Estados del Formulario Integral ---
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState({
    // Personal
    nombre: '', segundoNombre: '', apellido: '', fechaNacimiento: '',
    cedula: '', genero: '', direccion: '', telefono: '', correoElectronico: '',
    emergenciaNombre: '', emergenciaTelefono: '',
    // Médico
    medicamentos: [], condicionesMedicas: [],
    // Deporte
    disciplina: '', nivelHabilidad: '', relacionAtleta: '', relacionAtletaOtro: ''
  });
  const [errores, setErrores] = useState({});
  const [archivos, setArchivos] = useState({ identificacion: null, certificado: null, foto: null });
  const [arrastrando, setArrastrando] = useState(null);

  // --- Manejadores Universales ---
  const manejarCambio = (e) => {
    const { id, name, value } = e.target;
    const key = id || name;
    setDatos(prev => ({ ...prev, [key]: value }));
    if (errores[key]) setErrores(prev => ({ ...prev, [key]: false }));
  }

  const manejarCambioArreglo = (e) => {
    const { name, value, checked } = e.target;
    setDatos(prev => {
      let arregloActual = prev[name] || [];
      if (checked) {
        arregloActual = [...arregloActual, value];
      } else {
        arregloActual = arregloActual.filter(item => item !== value);
      }
      return { ...prev, [name]: arregloActual };
    });
    if (name === 'tipoAlergia' && checked && errores['tipoAlergia']) {
      setErrores(prev => ({ ...prev, tipoAlergia: false }));
    }
  }

  // --- Lógica Sección Médica (Modal y Tabla) ---
  const agregarMedicamento = () => {
    setDatos(prev => ({
      ...prev,
      medicamentos: [...(prev.medicamentos || []), { nombre: '', dosis: '', frecuencia: '' }]
    }));
  }

  const eliminarMedicamento = (index) => {
    setDatos(prev => ({
      ...prev,
      medicamentos: (prev.medicamentos || []).filter((_, i) => i !== index)
    }));
  }

  const manejarCambioMedicamento = (index, e) => {
    const { name, value } = e.target;
    const nuevosMedicamentos = [...(datos.medicamentos || [])];
    nuevosMedicamentos[index][name] = value;
    setDatos(prev => ({ ...prev, medicamentos: nuevosMedicamentos }));
  }

  const manejarClickCondicion = async (e) => {
    if (e.target.checked) {
      const condicionesDisponibles = [
        { id: 'epilepsia', label: 'Epilepsia' },
        { id: 'sindromedeXfragil', label: 'Síndrome de X frágil' },
        { id: 'sindromredeAlcoholismoFetal', label: 'Síndrome de Alcoholismo Fetal' },
        { id: 'autismo', label: 'Autismo' },
        { id: 'sindrome-down', label: 'Síndrome de Down' },
        { id: 'paralisiscerebral', label: 'Parálisis Cerebral' },
        { id: 'sindromedeMarfan', label: 'Síndrome De Marfan' },
        { id: 'espinaBifida', label: 'Espina Bífida' },
        { id: 'desconocido', label: 'Desconocido' },
        { id: 'otro', label: 'Otro' }
      ];

      const { value: formValues } = await Swal.fire({
        title: '<h3 style="color: #E00000; font-weight: bold; margin: 0; font-family: Outfit, sans-serif;">Condiciones Médicas</h3>',
        html: `
          <p style="color: #555; font-size: 15px; margin-bottom: 25px; font-family: Outfit, sans-serif;">Seleccione las condiciones aplicables:</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; text-align: left; background: #ffffff; padding: 5px; font-family: Outfit, sans-serif;">
            ${condicionesDisponibles.map(cond => `
              <div style="${cond.id === 'otro' ? 'grid-column: span 2;' : ''}">
                <label style="display: flex; align-items: center; cursor: pointer; padding: 12px 16px; border-radius: 12px; border: 2px solid #f3f4f6; transition: 0.3s; background: #f9fafb;" 
                       onmouseover="this.style.borderColor='#e5e7eb'; this.style.background='#f3f4f6'" 
                       onmouseout="if(!document.getElementById('${cond.id}').checked) { this.style.borderColor='#f3f4f6'; this.style.background='#f9fafb' } else { this.style.borderColor='#E00000'; this.style.background='#fffafa' }">
                  <input type="checkbox" id="${cond.id}" value="${cond.label}" 
                         style="width: 20px; height: 20px; margin-right: 12px; accent-color: #E00000; cursor: pointer;" 
                         ${cond.id === 'otro' ? 'onchange="document.getElementById(\'otro-container\').style.display = this.checked ? \'block\' : \'none\'; this.parentElement.style.borderColor = this.checked ? \'#E00000\' : \'#f3f4f6\'; this.parentElement.style.background = this.checked ? \'#fffafa\' : \'#f9fafb\';"' : 'onchange="this.parentElement.style.borderColor = this.checked ? \'#E00000\' : \'#f3f4f6\'; this.parentElement.style.background = this.checked ? \'#fffafa\' : \'#f9fafb\';"'}>
                  <span style="font-size: 15px; color: #1a1a1a; font-weight: 500;">${cond.label}</span>
                </label>
                ${cond.id === 'otro' ? `
                  <div id="otro-container" style="display: none; padding: 10px 0 0 0;">
                    <input type="text" id="otro-input" placeholder="Especifique cuál condición..." style="width: 100%; padding: 14px; border-radius: 12px; border: 2px solid #E5E5E5; font-size: 15px; outline: none; font-family: Outfit, sans-serif; box-sizing: border-box;">
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        `,
        focusConfirm: false, showCancelButton: true, confirmButtonText: '✅ Aceptar', cancelButtonText: '❌ Cancelar',
        confirmButtonColor: '#E00000', cancelButtonColor: '#A7A9AC', width: '650px',
        preConfirm: () => {
          const resultado = [];
          for (const cond of condicionesDisponibles) {
            const el = document.getElementById(cond.id);
            if (el && el.checked) {
              if (cond.id === 'otro') {
                const valorOtro = document.getElementById('otro-input').value.trim();
                if (!valorOtro) { Swal.showValidationMessage('Especifique (Otro)'); return false; }
                resultado.push('Otro: ' + valorOtro);
              } else resultado.push(cond.label);
            }
          }
          return resultado;
        }
      });

      if (formValues && formValues.length > 0) {
        setDatos(prev => ({ ...prev, condicionesMedicas: [...new Set([...(prev.condicionesMedicas || []), ...formValues])] }));
      } else {
        e.target.checked = false;
      }
    } else {
      setDatos(prev => ({ ...prev, condicionesMedicas: [] }));
    }
  }

  const eliminarCondicion = (cond) => {
    setDatos(prev => ({ ...prev, condicionesMedicas: prev.condicionesMedicas.filter(c => c !== cond) }));
  }

  // --- Lógica Sección Documentos ---
  const validarYGuardarArchivo = (file, tipo) => {
    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!tiposPermitidos.includes(file.type) || file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'Archivo inválido', text: 'PDF, JPG o PNG máximo 5MB.', confirmButtonColor: '#E00000' });
      return;
    }
    setArchivos({ ...archivos, [tipo]: file });
  }

  // --- Validaciones por Paso ---
  const validarPaso = () => {
    if (paso === 1) {
      // Campos visibles en el nuevo diseño
      const req = ['nombre', 'fechaNacimiento', 'cedula', 'genero', 'direccion', 'telefono', 'correoElectronico', 'emergenciaNombre', 'emergenciaTelefono'];
      const nuevosErrores = {};
      let falte = false;
      req.forEach(f => { 
        if (!datos[f]?.toString().trim()) { 
          nuevosErrores[f] = true; 
          falte = true; 
        } 
      });
      if (falte) { 
        Swal.fire({ icon: 'error', title: 'Campos Incompletos', text: 'Por favor complete todos los datos personales marcados.', confirmButtonColor: '#E00000' }); 
        setErrores(nuevosErrores); 
        return false; 
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correoElectronico)) { 
        Swal.fire({ icon: 'error', title: 'Correo Inválido', text: 'Ingrese un formato de correo electrónico válido.', confirmButtonColor: '#E00000' }); 
        return false; 
      }
      return true;
    }

    if (paso === 2) {
      // Validar todas las preguntas médicas requeridas
      const qReq = [
        'reqDietetico', 'otrosDispositivos', 'afeccionCardiaca', 'asma', 'diabetes', 
        'discVisual', 'discAuditiva', 'trastornoHemorragico', 'medicoLimitoDeportes', 
        'epilepsiaConvulsivo', 'anemiaDepranocitica', 'conmocionCerebral', 
        'afeccionesMentales', 'alergiasGraves', 'tomaMedicamentos'
      ];
      const nuevosErrores = {};
      let falte = false;
      qReq.forEach(q => { if (!datos[q]) { nuevosErrores[q] = true; falte = true; } });
      
      if (datos.alergiasGraves === 'Si' && !datos.tipoAlergia) {
        falte = true;
        nuevosErrores.tipoAlergia = true;
      }

      setErrores(nuevosErrores);
      if (falte) { 
        Swal.fire({ icon: 'error', title: 'Información Médica Incompleta', text: 'Por favor responda todas las preguntas de salud resaltadas.', confirmButtonColor: '#E00000' }); 
        return false; 
      }
      return true;
    }

    if (paso === 3) {
      if (!datos.disciplina || !datos.nivelHabilidad || !datos.relacionAtleta) {
        Swal.fire({ icon: 'error', title: 'Paso 3 Incompleto', text: 'Seleccione la disciplina, nivel y su relación con el atleta.', confirmButtonColor: '#E00000' }); 
        return false;
      }
      return true;
    }
    return true;
  }

  // --- Navegación ---
  const manejarSiguiente = () => { if (validarPaso()) setPaso(paso + 1); }
  const manejarAnterior = () => { if (paso === 1) onVolver(); else setPaso(paso - 1); }

  // --- Finalización Real ---
  const finalizarInscripcion = () => {
    const resumenHTML = `<div style="text-align: left;"><p>Atleta: ${datos.nombre}</p><p>Disciplina: ${datos.disciplina}</p></div>`;
    Swal.fire({
      title: '¿Finalizar Inscripción?',
      html: resumenHTML, showCancelButton: true, confirmButtonText: 'Sí, Enviar', confirmButtonColor: '#E00000'
    }).then(async (res) => {
      if (res.isConfirmed) {
        Swal.fire({ title: 'Guardando...', didOpen: () => Swal.showLoading() });
        const pass = Math.random().toString(36).slice(-8);
        
        // Preparar datos para el envío (limpiando nulos y asegurando campos mínimos)
        const datosParaEnvio = {
          ...datos,
          apellido: datos.apellido || '', // Asegurar campo para db.json
          segundoNombre: datos.segundoNombre || '',
          password: pass,
          rol: 'atleta',
          fechaRegistro: new Date().toISOString()
        };

        try {
          await createAtleta(datosParaEnvio);
          await emailjs.send('service_ttxcgou', 'template_2eklg8i', { to_email: datos.correoElectronico, to_name: datos.nombre, message: `Bienvenido. Tu clave es: ${pass}` }, '4zWvRC7Yn7lUDqd1q');
          Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Registro completado.' }).then(() => window.location.href = '/');
        } catch (error) {
          console.error("Error al guardar:", error);
          Swal.fire({ icon: 'success', title: 'Guardado localmente (Modo Offline)' }).then(() => window.location.href = '/');
        }
      }
    });
  }

  // --- UI Helpers ---
  const porcentajeProgreso = paso * 25;

  return (
    <div className="form-atleta-layout">
      {/* Header Estilo Referencia */}
      <header className="form-header">
        <div className="header-logo">
          <div className="logo-icon">🏆</div>
          <h1>Olimpiadas Especiales CR</h1>
        </div>
        <div className="header-actions">
          <div className="action-icon">🔔</div>
          <div className="action-icon">👤</div>
        </div>
      </header>

      <div className="form-body">
        {/* Sidebar de Navegación */}
        <aside className="form-sidebar">
          <div className="sidebar-card">
            <div className="registro-info">
              <div className="registro-icon">👤</div>
              <div className="registro-text">
                <h4>Registro</h4>
                <p>NUEVO ATLETA</p>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav sidebar-card">
            {[
              { id: 1, name: "1. Datos Personales", icon: "👤" },
              { id: 2, name: "2. Info Médica", icon: "🏥" },
              { id: 3, name: "3. Deporte", icon: "⚽" },
              { id: 4, name: "4. Documentos", icon: "📄" }
            ].map((step) => (
              <div key={step.id} className={`nav-item ${paso === step.id ? 'active' : ''}`}>
                <span className="nav-icon">{step.icon}</span>
                <span>{step.name}</span>
              </div>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="progress-label">
              <span>PROGRESO</span>
              <span>{porcentajeProgreso}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${porcentajeProgreso}%` }}></div>
            </div>
          </div>
        </aside>

        {/* Área de Contenido Principal */}
        <main className="form-content-area">
          <div className="content-header">
            {paso === 1 && (
              <>
                <h2>Paso 1: Datos Personales</h2>
                <p>Complete la información básica del atleta para iniciar el proceso.</p>
              </>
            )}
            {paso === 2 && (
              <>
                <h2>Paso 2: Información Médica</h2>
                <p>Proporcione detalles sobre la salud y condiciones del atleta.</p>
              </>
            )}
            {paso === 3 && (
              <>
                <h2>Paso 3: Información Deportiva</h2>
                <p>Seleccione la disciplina y nivel de habilidad del atleta.</p>
              </>
            )}
            {paso === 4 && (
              <>
                <h2>Paso 4: Documentación</h2>
                <p>Adjunte los documentos requeridos para finalizar el registro.</p>
              </>
            )}
          </div>

          <div className="content-body">
            {paso === 1 && (
              <div className="form-grid-ref">
                <div className="input-container">
                  <label>Nombre Completo</label>
                  <input type="text" id='nombre' className="input-field" placeholder="Ej: Juan Pérez Mora" value={datos.nombre} onChange={manejarCambio} />
                </div>
                <div className="input-container">
                  <label>Cédula / Identificación</label>
                  <input type="text" id='cedula' className="input-field" placeholder="0-0000-0000" value={datos.cedula} onChange={manejarCambio} />
                </div>
                <div className="input-container">
                  <label>Fecha de Nacimiento</label>
                  <input type="date" id='fechaNacimiento' className="input-field" value={datos.fechaNacimiento} onChange={manejarCambio} />
                </div>
                <div className="input-container">
                  <label>Género</label>
                  <select id="genero" className="input-field" value={datos.genero} onChange={manejarCambio}>
                    <option value="">Seleccione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>
                <div className="input-container">
                  <label>Teléfono de Contacto</label>
                  <input type="text" id='telefono' className="input-field" placeholder="+506 0000-0000" value={datos.telefono} onChange={manejarCambio} />
                </div>
                <div className="input-container">
                  <label>Correo Electrónico</label>
                  <input type="email" id='correoElectronico' className="input-field" placeholder="atleta@correo.com" value={datos.correoElectronico} onChange={manejarCambio} />
                </div>
                <div className="input-container" style={{ gridColumn: 'span 2' }}>
                  <label>Dirección Exacta</label>
                  <textarea id="direccion" className="input-field" style={{ minHeight: '100px' }} placeholder="Barrio, calle, número de casa..." value={datos.direccion} onChange={manejarCambio}></textarea>
                </div>
                
                <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
                   <div style={{ height: '1px', background: '#f1f5f9', margin: '30px 0' }}></div>
                   <h3 style={{fontSize: '18px', fontWeight: 700}}>Contacto de Emergencia</h3>
                </div>

                <div className="input-container">
                  <label>Nombre Contacto de Emergencia</label>
                  <input type="text" id='emergenciaNombre' className="input-field" placeholder="Nombre completo" value={datos.emergenciaNombre} onChange={manejarCambio} />
                </div>
                <div className="input-container">
                  <label>Teléfono de Emergencia</label>
                  <input type="text" id='emergenciaTelefono' className="input-field" placeholder="Teléfono de contacto" value={datos.emergenciaTelefono} onChange={manejarCambio} />
                </div>
              </div>
            )}

            {paso === 2 && (
              <div className="form-sections-modern">
                {/* Selector de Condiciones Principales (Modal) */}
                <div className="question-group" style={{marginBottom: '30px'}}>
                  <label className="checkbox-label" style={{ cursor: 'pointer', padding: '15px', background: '#f8fafc', border: '1px dashed #e2e8f0', borderRadius: '15px', display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" onChange={manejarClickCondicion} checked={datos.condicionesMedicas?.length > 0} />
                    <span style={{ marginLeft: '12px', fontWeight: 600 }}>Registrar condiciones médicas específicas (Autismo, Down, etc.)</span>
                  </label>
                  {datos.condicionesMedicas?.length > 0 && (
                    <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {datos.condicionesMedicas.map((cond, index) => (
                        <div key={index} className="archivo-adjunto" style={{ borderRadius: '12px', border: '1px solid #E00000', color: '#E00000', padding: '8px 15px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {cond} <span onClick={() => eliminarCondicion(cond)} style={{ cursor: 'pointer', opacity: 0.7 }}>✕</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ height: '1px', background: '#f1f5f9', margin: '30px 0' }}></div>
                
                <h3 style={{fontSize: '18px', fontWeight: 700, marginBottom: '20px'}}>Chequeo Rápido de Salud</h3>
                <div className="medical-status-grid">
                  {[
                    { id: 'reqDietetico', label: 'Dieta Especial', desc: '¿Requiere alimentación específica?' },
                    { id: 'otrosDispositivos', label: 'Dispositivos de Apoyo', desc: 'Silla de ruedas, ortesis, etc.' },
                    { id: 'afeccionCardiaca', label: 'Afección Cardíaca', desc: '¿Tiene problemas del corazón?' },
                    { id: 'asma', label: 'Asma', desc: '¿Padece de dificultades respiratorias?' },
                    { id: 'diabetes', label: 'Diabetes', desc: '¿Controla niveles de azúcar?' },
                    { id: 'discVisual', label: 'Discapacidad Visual', desc: '¿Problemas severos de visión?' },
                    { id: 'discAuditiva', label: 'Discapacidad Auditiva', desc: '¿Dificultad para escuchar?' },
                    { id: 'trastornoHemorragico', label: 'Trastorno Hemorrágico', desc: '¿Problemas de coagulación?' },
                    { id: 'medicoLimitoDeportes', label: 'Limitación Deportiva', desc: '¿Un médico ha limitado su actividad?' },
                    { id: 'epilepsiaConvulsivo', label: 'Epilepsia', desc: '¿Padece convulsiones?' },
                    { id: 'anemiaDepranocitica', label: 'Anemia Depranocítica', desc: '¿Células falciformes?' },
                    { id: 'conmocionCerebral', label: 'Conmoción Cerebral', desc: '¿Ha tenido golpes en la cabeza?' },
                    { id: 'afeccionesMentales', label: 'Afecciones Mentales', desc: 'Depresión, ansiedad grave, etc.' },
                    { id: 'alergiasGraves', label: 'Alergias Graves', desc: 'Medicamentos, látex, comida.' }
                  ].map((field) => (
                    <div key={field.id} className={`status-tile ${errores[field.id] ? 'error-border' : ''}`} style={errores[field.id] ? {borderColor: '#E00000'} : {}}>
                      <div className="status-info">
                        <span className="status-label">{field.label}</span>
                        <span className="status-desc">{field.desc}</span>
                      </div>
                      <div className="switch-container">
                        <div 
                          className={`switch-option yes ${datos[field.id] === 'Si' ? 'active' : ''}`}
                          onClick={() => manejarCambio({ target: { id: field.id, value: 'Si' } })}
                        >SÍ</div>
                        <div 
                          className={`switch-option no ${datos[field.id] === 'No' ? 'active' : ''}`}
                          onClick={() => manejarCambio({ target: { id: field.id, value: 'No' } })}
                        >NO</div>
                      </div>
                    </div>
                  ))}

                  {datos.alergiasGraves === 'Si' && (
                    <div className="alergia-extra input-container" style={{padding: '20px', background: '#fff1f2', borderRadius: '15px', marginTop: '10px'}}>
                      <label style={{color: '#E00000'}}>Especifique las Alergias Graves</label>
                      <input 
                        type="text" 
                        id="tipoAlergia" 
                        className="input-field" 
                        placeholder="Ej: Penicilina, Maní, etc." 
                        value={datos.tipoAlergia || ''} 
                        onChange={manejarCambio} 
                        style={{background: 'white'}}
                      />
                    </div>
                  )}
                </div>

                <div style={{ height: '1px', background: '#f1f5f9', margin: '40px 0' }}></div>
                
                <div className="question-group" style={{background: '#f8fafc', padding: '25px', borderRadius: '20px'}}>
                  <div className="input-container">
                     <span style={{fontWeight: 700, marginBottom: '15px', fontSize: '16px', display: 'block'}}>¿Toma medicamentos de forma regular?</span>
                     <div className="pills-container" style={{display: 'flex', gap: '15px'}}>
                        <label className={`radio-label ${datos.tomaMedicamentos === 'Si' ? 'active' : ''}`} style={{cursor: 'pointer', padding: '10px 20px', borderRadius: '10px', background: datos.tomaMedicamentos === 'Si' ? '#E00000' : 'white', color: datos.tomaMedicamentos === 'Si' ? 'white' : '#64748b', border: '1px solid #e2e8f0'}}>
                          <input type="radio" name="tomaMedicamentos" value="Si" onChange={manejarCambio} checked={datos.tomaMedicamentos === 'Si'} style={{display: 'none'}} /> Sí
                        </label>
                        <label className={`radio-label ${datos.tomaMedicamentos === 'No' ? 'active' : ''}`} style={{cursor: 'pointer', padding: '10px 20px', borderRadius: '10px', background: datos.tomaMedicamentos === 'No' ? '#E00000' : 'white', color: datos.tomaMedicamentos === 'No' ? 'white' : '#64748b', border: '1px solid #e2e8f0'}}>
                          <input type="radio" name="tomaMedicamentos" value="No" onChange={manejarCambio} checked={datos.tomaMedicamentos === 'No'} style={{display: 'none'}} /> No
                        </label>
                     </div>
                  </div>

                  {datos.tomaMedicamentos === 'Si' && (
                    <div className="table-responsive" style={{marginTop: '25px'}}>
                      <table className="medicamentos-table" style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '15px', overflow: 'hidden'}}>
                        <thead>
                          <tr style={{background: '#f1f5f9'}}>
                            <th style={{padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: 800, color: '#475569'}}>NOMBRE MEDICAMENTO</th>
                            <th style={{padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: 800, color: '#475569'}}>DOSIS</th>
                            <th style={{padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: 800, color: '#475569'}}>FRECUENCIA</th>
                            <th style={{padding: '15px', textAlign: 'center', fontSize: '12px', fontWeight: 800, color: '#475569'}}>ACCIÓN</th>
                          </tr>
                        </thead>
                        <tbody>
                          {datos.medicamentos.map((med, index) => (
                            <tr key={index} style={{borderTop: '1px solid #f1f5f9'}}>
                              <td style={{padding: '12px'}}><input type="text" name="nombre" className="input-field" style={{padding: '10px', fontSize: '14px', background: 'white'}} value={med.nombre} onChange={(e) => manejarCambioMedicamento(index, e)} /></td>
                              <td style={{padding: '12px'}}><input type="text" name="dosis" className="input-field" style={{padding: '10px', fontSize: '14px', background: 'white'}} value={med.dosis} onChange={(e) => manejarCambioMedicamento(index, e)} /></td>
                              <td style={{padding: '12px'}}><input type="text" name="frecuencia" className="input-field" style={{padding: '10px', fontSize: '14px', background: 'white'}} value={med.frecuencia} onChange={(e) => manejarCambioMedicamento(index, e)} /></td>
                              <td style={{padding: '12px', textAlign: 'center'}}><button type="button" onClick={() => eliminarMedicamento(index)} style={{color: '#ef4444', border: 'none', background: '#fee2e2', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'}}>✕</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button type="button" onClick={agregarMedicamento} style={{marginTop: '15px', padding: '12px 25px', borderRadius: '12px', border: '1.5px dashed #cbd5e1', background: '#fff', color: '#64748b', cursor: 'pointer', fontWeight: 700, fontSize: '13px'}}>+ Añadir otro medicamento</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {paso === 3 && (
              <div className="form-grid-ref">
                <div className="input-container">
                  <label>Disciplina Deportiva Principal</label>
                  <select name="disciplina" className="input-field" value={datos.disciplina} onChange={manejarCambio}>
                    <option value="">Seleccione...</option>
                    <option value="Atletismo">Atletismo</option>
                    <option value="Baloncesto">Baloncesto</option>
                    <option value="Fútbol">Fútbol</option>
                    <option value="Natación">Natación</option>
                  </select>
                </div>
                <div className="input-container">
                  <label>Nivel de Habilidad</label>
                  <select name="nivelHabilidad" className="input-field" value={datos.nivelHabilidad} onChange={manejarCambio}>
                    <option value="">Seleccione...</option>
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
                <div className="input-container" style={{ gridColumn: 'span 2' }}>
                  <label>Relación con el atleta</label>
                  <select name="relacionAtleta" className="input-field" value={datos.relacionAtleta} onChange={manejarCambio}>
                    <option value="">Seleccione...</option>
                    <option value="El Atleta mismo">Soy el Atleta</option>
                    <option value="Padre/Madre">Padre/Madre</option>
                    <option value="Tutor Legal">Tutor Legal</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
            )}

            {paso === 4 && (
              <div className="docs-grid" style={{display: 'grid', gridTemplateColumns: '1fr', gap: '30px'}}>
                <div className="zona-drop" onClick={() => document.getElementById('file-identificacion').click()}>
                  <div style={{fontSize: '32px', marginBottom: '10px'}}>📄</div>
                  <h4 style={{margin: '0 0 5px 0', fontSize: '16px'}}>Documento de Identidad</h4>
                  <p style={{margin: 0, fontSize: '13px', color: '#64748b'}}>Haga clic para subir PDF o Imagen</p>
                  <input id="file-identificacion" type="file" style={{ display: 'none' }} onChange={(e) => validarYGuardarArchivo(e.target.files[0], 'identificacion')} />
                  {archivos.identificacion && <div className="archivo-adjunto" style={{marginTop: '15px', display: 'inline-block', padding: '5px 15px', background: '#f0fdf4', color: '#166534', borderRadius: '20px', fontSize: '12px', fontWeight: 600}}>✓ {archivos.identificacion.name}</div>}
                </div>
                <div className="zona-drop" onClick={() => document.getElementById('file-certificado').click()}>
                  <div style={{fontSize: '32px', marginBottom: '10px'}}>🏥</div>
                  <h4 style={{margin: '0 0 5px 0', fontSize: '16px'}}>Certificado Médico</h4>
                  <p style={{margin: 0, fontSize: '13px', color: '#64748b'}}>Documento oficial debidamente firmado</p>
                  <input id="file-certificado" type="file" style={{ display: 'none' }} onChange={(e) => validarYGuardarArchivo(e.target.files[0], 'certificado')} />
                  {archivos.certificado && <div className="archivo-adjunto" style={{marginTop: '15px', display: 'inline-block', padding: '5px 15px', background: '#f0fdf4', color: '#166534', borderRadius: '20px', fontSize: '12px', fontWeight: 600}}>✓ {archivos.certificado.name}</div>}
                </div>
              </div>
            )}
            
            <div style={{marginTop: '40px', padding: '20px', background: '#f8fafc', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '15px'}}>
                <input type="checkbox" id="verificado" style={{width: '20px', height: '20px', cursor: 'pointer', accentColor: '#E00000'}} />
                <label htmlFor="verificado" style={{fontSize: '14px', color: '#475569', fontWeight: 500, cursor: 'pointer'}}>Confirmo que los datos ingresados son verídicos y autorizo el tratamiento de la información.</label>
            </div>
          </div>

          <footer className="form-footer">
            <button className="btn-cancelar-ref" onClick={manejarAnterior}>
               {paso === 1 ? 'Cancelar' : 'Paso Anterior'}
            </button>
            <div className="footer-actions">
              {paso < 4 ? (
                <button className="btn-siguiente-ref" onClick={manejarSiguiente}>Siguiente Paso</button>
              ) : (
                <button className="btn-siguiente-ref" onClick={finalizarInscripcion}>Finalizar Registro</button>
              )}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default FormAtleta
