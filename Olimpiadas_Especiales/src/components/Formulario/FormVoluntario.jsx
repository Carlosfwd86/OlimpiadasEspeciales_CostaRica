import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import { createVoluntario } from '../../services/ServicesVoluntarios';
import '../../styles/Formulario/FormVoluntario.css';

emailjs.init("4zWvRC7Yn7lUDqd1q");

function FormVoluntario({ onVolver }) {
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState({
    nombre: '', cedula: '', fechaNacimiento: '', genero: '',
    telefono: '', correoElectronico: '', direccion: '',
    areasInteres: [], otraArea: '',
    disponibilidad: '', experienciaPrevia: '',
  });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const sesion = localStorage.getItem('usuarioSesion');
    if (sesion) {
      const user = JSON.parse(sesion);
      if (user.rol === 'usuario') {
        setDatos(prev => ({
          ...prev,
          nombre: user.nombre || prev.nombre,
          correoElectronico: user.correoElectronico || prev.correoElectronico
        }));
      }
    }
  }, []);
  const [archivos, setArchivos] = useState({ cedula: null, delincuencia: null, foto: null });

  const manejarCambio = (e) => {
    const { id, value } = e.target;
    setDatos(prev => ({ ...prev, [id]: value }));
    if (errores[id]) setErrores(prev => ({ ...prev, [id]: false }));
  };

  const manejarCheckbox = (area) => {
    setDatos(prev => {
      const actual = [...prev.areasInteres];
      return { ...prev, areasInteres: actual.includes(area) ? actual.filter(a => a !== area) : [...actual, area] };
    });
  };

  const validarYGuardarArchivo = (file, campo) => {
    if (!file) return;
    const maxSize = 5 * 1024 * 1024;
    const permitidos = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!permitidos.includes(file.type)) {
      Swal.fire({ icon: 'error', title: 'Formato Inválido', text: 'Solo se permiten JPG, PNG, WEBP o PDF.', confirmButtonColor: '#E00000' });
      return;
    }
    if (file.size > maxSize) {
      Swal.fire({ icon: 'error', title: 'Archivo Muy Grande', text: 'El archivo no debe superar los 5MB.', confirmButtonColor: '#E00000' });
      return;
    }
    setArchivos(prev => ({ ...prev, [campo]: file }));
  };

  const validarPaso = () => {
    const nuevosErrores = {};
    let falte = false;

    if (paso === 1) {
      ['nombre', 'cedula', 'fechaNacimiento', 'telefono', 'correoElectronico', 'direccion'].forEach(f => {
        if (!datos[f]?.toString().trim()) { nuevosErrores[f] = true; falte = true; }
      });
      if (datos.correoElectronico && !/\S+@\S+\.\S+/.test(datos.correoElectronico)) {
        Swal.fire({ icon: 'error', title: 'Correo Inválido', text: 'Ingrese un correo válido.', confirmButtonColor: '#E00000' });
        return false;
      }
    }
    if (paso === 2 && datos.areasInteres.length === 0 && !datos.otraArea.trim()) {
      Swal.fire({ icon: 'error', title: 'Selección Requerida', text: 'Seleccione al menos un área de interés.', confirmButtonColor: '#E00000' });
      return false;
    }
    if (paso === 3 && !datos.disponibilidad.trim()) {
      Swal.fire({ icon: 'error', title: 'Falta Disponibilidad', text: 'Indique su disponibilidad de tiempo.', confirmButtonColor: '#E00000' });
      return false;
    }
    if (paso === 4 && !archivos.cedula) {
      Swal.fire({ icon: 'error', title: 'Documento Requerido', text: 'Por favor adjunte su identificación.', confirmButtonColor: '#E00000' });
      return false;
    }
    if (falte) {
      setErrores(nuevosErrores);
      Swal.fire({ icon: 'error', title: 'Campos Incompletos', text: 'Llene todos los campos obligatorios.', confirmButtonColor: '#E00000' });
      return false;
    }
    return true;
  };

  const manejarSiguiente = () => { if (validarPaso()) setPaso(paso + 1); };
  const manejarAnterior = () => { if (paso === 1) onVolver(); else setPaso(paso - 1); };

  const finalizarInscripcion = () => {
    Swal.fire({
      title: '¿Finalizar Inscripción de Voluntario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Enviar Registro',
      confirmButtonColor: '#E00000'
    }).then(async (res) => {
      if (res.isConfirmed) {
        Swal.fire({ title: 'Guardando registro...', didOpen: () => Swal.showLoading() });
        const pass = Math.random().toString(36).slice(-8);
        const archivosNombres = {
          cedula_nombre: archivos.cedula?.name || 'No adjuntado',
          delincuencia_nombre: archivos.delincuencia?.name || 'No adjuntado',
          foto_nombre: archivos.foto?.name || 'No adjuntado',
        };
        const entry = { ...datos, ...archivosNombres, password: pass, rol: 'voluntario', fechaRegistro: new Date().toISOString() };

        try {
          await createVoluntario(entry);
          await emailjs.send('service_ttxcgou', 'template_2eklg8i', {
            to_email: datos.correoElectronico,
            to_name: datos.nombre,
            message: `¡Bienvenido al equipo de voluntarios! Tu clave es: ${pass}\n\nDocumentos adjuntos:\n- Cédula: ${archivosNombres.cedula_nombre}\n- Hoja Delincuencia: ${archivosNombres.delincuencia_nombre}\n- Foto: ${archivosNombres.foto_nombre}`
          }, '4zWvRC7Yn7lUDqd1q');
          Swal.fire({ icon: 'success', title: '¡Bienvenido!', text: 'Te has unido exitosamente como voluntario.' }).then(() => window.location.href = '/');
        } catch (error) {
          Swal.fire({ icon: 'success', title: 'Registro Guardado', text: 'Tu solicitud fue guardada.' }).then(() => window.location.href = '/');
        }
      }
    });
  };

  const porcentajeProgreso = paso * 25;
  const AREAS = ['Apoyo en Eventos', 'Logística y Transporte', 'Asistencia Médica', 'Entrenamiento Deportivo', 'Redes Sociales / Fotos', 'Administración'];

  return (
    <div className="form-voluntario-layout">
      <header className="form-header">
        <div className="header-logo">
          <div className="logo-icon">🤝</div>
          <h1>Inscripción Voluntario</h1>
        </div>
      </header>

      <div className="form-body">
        <aside className="form-sidebar">
          <div className="sidebar-card">
            <div className="registro-info">
              <div className="registro-icon">🎖️</div>
              <div className="registro-text"><h4>Registro</h4><p>NUEVO VOLUNTARIO</p></div>
            </div>
          </div>
          <nav className="sidebar-nav sidebar-card">
            {[
              { id: 1, name: "1. Datos Personales", icon: "👤" },
              { id: 2, name: "2. Áreas de Interés", icon: "💡" },
              { id: 3, name: "3. Disponibilidad", icon: "🤝" },
              { id: 4, name: "4. Documentos", icon: "📄" }
            ].map(step => (
              <div key={step.id} className={`nav-item ${paso === step.id ? 'active' : ''}`}>
                <span className="nav-icon">{step.icon}</span>
                <span>{step.name}</span>
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="progress-label"><span>PROGRESO</span><span>{porcentajeProgreso}%</span></div>
            <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${porcentajeProgreso}%` }}></div></div>
          </div>
        </aside>

        <main className="form-content">
          <div className="content-header">
            {paso === 1 && <h2>Paso 1: Datos de Contacto</h2>}
            {paso === 2 && <h2>Paso 2: ¿Cómo deseas ayudar?</h2>}
            {paso === 3 && <h2>Paso 3: Disponibilidad y Experiencia</h2>}
            {paso === 4 && <h2>Paso 4: Legalidad y Documentos</h2>}
          </div>

          <div className="content-body">
            {paso === 1 && (
              <div className="form-grid-ref">
                <div className="input-container"><label>Nombre Completo *</label><input type="text" id='nombre' className={`input-field ${errores.nombre ? 'error' : ''}`} value={datos.nombre} onChange={manejarCambio} /></div>
                <div className="input-container"><label>Cédula *</label><input type="text" id='cedula' className={`input-field ${errores.cedula ? 'error' : ''}`} value={datos.cedula} onChange={manejarCambio} /></div>
                <div className="input-container"><label>Fecha de Nacimiento *</label><input type="date" id='fechaNacimiento' className={`input-field ${errores.fechaNacimiento ? 'error' : ''}`} value={datos.fechaNacimiento} onChange={manejarCambio} /></div>
                <div className="input-container"><label>Género</label>
                  <select id="genero" className="input-field" value={datos.genero} onChange={manejarCambio}>
                    <option value="">Seleccione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>
                <div className="input-container"><label>Teléfono *</label><input type="text" id='telefono' className={`input-field ${errores.telefono ? 'error' : ''}`} value={datos.telefono} onChange={manejarCambio} /></div>
                <div className="input-container"><label>Correo Electrónico *</label><input type="email" id='correoElectronico' className={`input-field ${errores.correoElectronico ? 'error' : ''}`} value={datos.correoElectronico} onChange={manejarCambio} /></div>
                <div className="input-container" style={{ gridColumn: 'span 2' }}><label>Dirección *</label><textarea id="direccion" className={`input-field ${errores.direccion ? 'error' : ''}`} value={datos.direccion} onChange={manejarCambio}></textarea></div>
              </div>
            )}

            {paso === 2 && (
              <div className="form-sections-modern">
                <p style={{ fontWeight: 600, color: '#64748b', marginBottom: '15px' }}>Selecciona las áreas donde te gustaría colaborar:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {AREAS.map(area => (
                    <label key={area} className="checkbox-label">
                      <input type="checkbox" checked={datos.areasInteres.includes(area)} onChange={() => manejarCheckbox(area)} style={{ accentColor: '#E00000', width: '16px', height: '16px' }} />
                      <span>{area}</span>
                    </label>
                  ))}
                </div>
                <div className="input-container" style={{ marginTop: '20px' }}>
                  <label>Otra área específica:</label>
                  <input type="text" id='otraArea' className="input-field" placeholder="Describe otra forma en que puedes contribuir..." value={datos.otraArea} onChange={manejarCambio} />
                </div>
              </div>
            )}

            {paso === 3 && (
              <div className="form-grid-ref">
                <div className="input-container" style={{ gridColumn: 'span 2' }}>
                  <label>Disponibilidad de Tiempo (Días / Horas) *</label>
                  <textarea id='disponibilidad' className="input-field" rows={3} placeholder="Ej: Sábados por la mañana, unas 4 horas semanales." value={datos.disponibilidad} onChange={manejarCambio}></textarea>
                </div>
                <div className="input-container" style={{ gridColumn: 'span 2' }}>
                  <label>Experiencia previa en voluntariado (Opcional)</label>
                  <textarea id='experienciaPrevia' className="input-field" rows={3} placeholder="Cuéntanos brevemente..." value={datos.experienciaPrevia} onChange={manejarCambio}></textarea>
                </div>
              </div>
            )}

            {paso === 4 && (
              <div className="form-sections-modern">
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>
                  Para la seguridad de nuestros atletas, verificamos antecedentes. Adjunte sus documentos en <strong>PDF, JPG o PNG</strong> (máx. 5MB).
                </p>

                {/* Cédula */}
                <div
                  onClick={() => document.getElementById('file-cedula-v').click()}
                  style={{ cursor: 'pointer', border: `2px dashed ${archivos.cedula ? '#16a34a' : '#E00000'}`, borderRadius: '16px', padding: '25px', textAlign: 'center', background: archivos.cedula ? '#f0fdf4' : '#fff1f2', transition: 'all 0.2s' }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📄</div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1e293b' }}>Cédula de Identidad <span style={{ color: '#E00000' }}>*</span></h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Haga clic para seleccionar archivo</p>
                  <input id="file-cedula-v" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" style={{ display: 'none' }} onChange={(e) => validarYGuardarArchivo(e.target.files[0], 'cedula')} />
                  {archivos.cedula && <div style={{ marginTop: '12px', padding: '6px 16px', background: '#dcfce7', color: '#166534', borderRadius: '20px', display: 'inline-block', fontSize: '13px', fontWeight: 700 }}>✓ {archivos.cedula.name}</div>}
                </div>

                {/* Hoja de Delincuencia */}
                <div
                  onClick={() => document.getElementById('file-del-v').click()}
                  style={{ cursor: 'pointer', border: `2px dashed ${archivos.delincuencia ? '#16a34a' : '#cbd5e1'}`, borderRadius: '16px', padding: '25px', textAlign: 'center', background: archivos.delincuencia ? '#f0fdf4' : '#f8fafc', transition: 'all 0.2s' }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📋</div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1e293b' }}>Hoja de Delincuencia</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Opcional — requerida para roles con menores de edad</p>
                  <input id="file-del-v" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" style={{ display: 'none' }} onChange={(e) => validarYGuardarArchivo(e.target.files[0], 'delincuencia')} />
                  {archivos.delincuencia && <div style={{ marginTop: '12px', padding: '6px 16px', background: '#dcfce7', color: '#166534', borderRadius: '20px', display: 'inline-block', fontSize: '13px', fontWeight: 700 }}>✓ {archivos.delincuencia.name}</div>}
                </div>

                {/* Foto de Perfil */}
                <div
                  onClick={() => document.getElementById('file-foto-v').click()}
                  style={{ cursor: 'pointer', border: `2px dashed ${archivos.foto ? '#16a34a' : '#cbd5e1'}`, borderRadius: '16px', padding: '25px', textAlign: 'center', background: archivos.foto ? '#f0fdf4' : '#f8fafc', transition: 'all 0.2s' }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📸</div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1e293b' }}>Foto de Perfil</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Opcional — foto tipo carné</p>
                  <input id="file-foto-v" type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={(e) => validarYGuardarArchivo(e.target.files[0], 'foto')} />
                  {archivos.foto && <div style={{ marginTop: '12px', padding: '6px 16px', background: '#dcfce7', color: '#166534', borderRadius: '20px', display: 'inline-block', fontSize: '13px', fontWeight: 700 }}>✓ {archivos.foto.name}</div>}
                </div>

                <div style={{ marginTop: '10px', padding: '15px 20px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="checkbox" id="verificado-v" style={{ width: '18px', height: '18px', accentColor: '#E00000', cursor: 'pointer' }} />
                  <label htmlFor="verificado-v" style={{ fontSize: '13px', color: '#475569', cursor: 'pointer' }}>Confirmo que los datos son verídicos y autorizo el tratamiento de mi información.</label>
                </div>
              </div>
            )}
          </div>

          <div className="content-footer">
            <button className="btn-secondary" onClick={manejarAnterior}>{paso === 1 ? 'Cancelar' : 'Anterior'}</button>
            {paso < 4
              ? <button className="btn-primary" onClick={manejarSiguiente}>Siguiente Paso →</button>
              : <button className="btn-primary" onClick={finalizarInscripcion}>Unirse ✓</button>
            }
          </div>
        </main>
      </div>
    </div>
  );
}

export default FormVoluntario;
