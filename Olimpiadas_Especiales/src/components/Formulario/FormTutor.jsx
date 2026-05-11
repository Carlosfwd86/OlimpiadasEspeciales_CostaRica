import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import { getConfig } from '../../services/ServicesConfig';
import '../../styles/Formulario/FormTutor.css';

emailjs.init("4zWvRC7Yn7lUDqd1q");

function FormTutor({ onVolver }) {
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState({
    nombre: '', cedula: '', telefono: '', correoElectronico: '', direccion: '', fechaNacimiento: '',
    nombreAtleta: '', relacionConAtleta: '',
    ocupacion: '', motivacion: '', experienciaNecesidadesEspeciales: 'No',
  });
  const [errores, setErrores] = useState({});
  const [archivos, setArchivos] = useState({ cedula: null, foto: null });
  const [parentescos, setParentescos] = useState([]);

  useEffect(() => {
    getConfig('parentescos').then(setParentescos);
  }, []);

  useEffect(() => {
    const sesion = localStorage.getItem('usuarioSesion');
    if (sesion) {
      const user = JSON.parse(sesion);
      setDatos(prev => ({
        ...prev,
        nombre: user.nombre || prev.nombre,
        cedula: user.cedula || prev.cedula,
        telefono: user.telefono || prev.telefono,
        correoElectronico: user.correoElectronico || prev.correoElectronico,
        direccion: user.direccion || prev.direccion,
        fechaNacimiento: user.fechaNacimiento || prev.fechaNacimiento,
      }));
    }
  }, []);

  const manejarCambio = (e) => {
    const { id, value } = e.target;
    setDatos(prev => ({ ...prev, [id]: value }));
    if (errores[id]) setErrores(prev => ({ ...prev, [id]: false }));
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
      if (datos.fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(datos.fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
          edad--;
        }
        if (edad < 18) {
          Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: 'Debes ser mayor de 18 años para registrarte como tutor.',
            confirmButtonColor: '#E00000',
            confirmButtonText: 'Entendido'
          }).then(() => {
            window.location.href = '/plataforma-registro'; // Kick them out
          });
          return false;
        }
      }
    }
    if (paso === 2 && (!datos.nombreAtleta || !datos.relacionConAtleta)) {
      Swal.fire({ icon: 'error', title: 'Paso 2 Incompleto', text: 'Indique el nombre del atleta y su relación.', confirmButtonColor: '#E00000' });
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
      title: '¿Registrar como Tutor?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Registrar',
      confirmButtonColor: '#E00000'
    }).then(async (res) => {
      if (res.isConfirmed) {
        Swal.fire({ title: 'Procesando...', didOpen: () => Swal.showLoading() });
        const sesion = JSON.parse(localStorage.getItem('usuarioSesion') || '{}');
        const pass = Math.random().toString(36).slice(-8);
        const archivosNombres = {
          cedula_nombre: archivos.cedula?.name || 'No adjuntado',
          foto_nombre: archivos.foto?.name || 'No adjuntado',
        };
        const getBase64 = (file) => new Promise((resolve) => {
          if (!file) { resolve(null); return; }
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        const cedula_base64 = await getBase64(archivos.cedula);

        const entry = { 
          ...datos, 
          ...archivosNombres, 
          cedula_base64,
          usuarioId: sesion.id || null,
          password: pass, 
          rol: 'tutor', 
          fechaRegistro: new Date().toISOString(),
          status: 'PENDIENTE',
          statusColor: 'yellow',
          bgColor: 'bg-light-blue',
          name: datos.nombre,
          initials: (datos.nombre?.charAt(0) || '') + (datos.nombre?.split(' ')[1]?.charAt(0) || ''),
          time: 'Registrado ahora'
        };

        try {
          await ServicesAdmin.saveRegistro(entry);
          await emailjs.send('service_ttxcgou', 'template_2eklg8i', {
            to_email: datos.correoElectronico,
            to_name: datos.nombre,
            message: `Tus datos de postulación para el rol de Tutor han sido enviados correctamente. Un administrador revisará tu información pronto.\n\nPor favor, mantente atento a tu correo para la confirmación de aprobación.\n\nDocumentos adjuntos:\n- Cédula: ${archivosNombres.cedula_nombre}\n- Foto: ${archivosNombres.foto_nombre}`
          }, '4zWvRC7Yn7lUDqd1q');
          Swal.fire({ icon: 'success', title: '¡Completado!', text: 'Registro de tutor exitoso.' }).then(() => window.location.href = '/');
        } catch (error) {
          Swal.fire({ icon: 'success', title: 'Guardado', text: 'Registro guardado correctamente.' }).then(() => window.location.href = '/');
        }
      }
    });
  };

  const porcentajeProgreso = paso * 25;

  return (
    <div className="form-tutor-layout">
      <header className="form-header">
        <div className="header-logo">
          <div className="logo-icon">👪</div>
          <h1>Inscripción Tutor / Familiar</h1>
        </div>
      </header>

      <div className="form-body">
        <aside className="form-sidebar">
          <div className="sidebar-card">
            <div className="registro-info">
              <div className="registro-icon">🏠</div>
              <div className="registro-text"><h4>Registro</h4><p>NUEVO TUTOR</p></div>
            </div>
          </div>
          <nav className="sidebar-nav sidebar-card">
            {[
              { id: 1, name: "1. Datos Personales", icon: "👤" },
              { id: 2, name: "2. Atleta a Cargo", icon: "🏃" },
              { id: 3, name: "3. Perfil y Motivo", icon: "✨" },
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
            {paso === 1 && <h2>Paso 1: Información Personal</h2>}
            {paso === 2 && <h2>Paso 2: Información del Atleta</h2>}
            {paso === 3 && <h2>Paso 3: Perfil del Tutor</h2>}
            {paso === 4 && <h2>Paso 4: Documentación</h2>}
          </div>

          <div className="content-body">
            {paso === 1 && (
              <div className="form-grid-ref">
                <div className="input-container"><label>Nombre Completo *</label><input type="text" id='nombre' className={`input-field ${errores.nombre ? 'error' : ''}`} value={datos.nombre} onChange={manejarCambio} /></div>
                <div className="input-container"><label>Cédula *</label><input type="text" id='cedula' className={`input-field ${errores.cedula ? 'error' : ''}`} value={datos.cedula} onChange={manejarCambio} readOnly={!!datos.cedula} /></div>
                <div className="input-container"><label>Fecha de Nacimiento *</label><input type="date" id='fechaNacimiento' className={`input-field ${errores.fechaNacimiento ? 'error' : ''}`} value={datos.fechaNacimiento} onChange={manejarCambio} readOnly={!!datos.fechaNacimiento} /></div>
                <div className="input-container"><label>Teléfono *</label><input type="text" id='telefono' className={`input-field ${errores.telefono ? 'error' : ''}`} value={datos.telefono} onChange={manejarCambio} /></div>
                <div className="input-container"><label>País *</label><input type="text" id='pais' className="input-field" value={datos.pais} onChange={manejarCambio} readOnly={!!datos.pais} /></div>
                <div className="input-container"><label>Correo Electrónico *</label><input type="email" id='correoElectronico' className={`input-field ${errores.correoElectronico ? 'error' : ''}`} value={datos.correoElectronico} onChange={manejarCambio} readOnly={!!datos.correoElectronico} /></div>
                <div className="input-container" style={{ gridColumn: 'span 2' }}><label>Dirección Exacta *</label><textarea id="direccion" className={`input-field ${errores.direccion ? 'error' : ''}`} value={datos.direccion} onChange={manejarCambio}></textarea></div>
              </div>
            )}

            {paso === 2 && (
              <div className="form-grid-ref">
                <div className="input-container" style={{ gridColumn: 'span 2' }}>
                  <label>Nombre Completo del Atleta *</label>
                  <input type="text" id='nombreAtleta' className="input-field" placeholder="Nombre del atleta que representa" value={datos.nombreAtleta} onChange={manejarCambio} />
                </div>
                <div className="input-container">
                  <label>Parentesco / Relación *</label>
                  <select id="relacionConAtleta" className="input-field" value={datos.relacionConAtleta} onChange={manejarCambio}>
                    <option value="">Seleccione...</option>
                    {parentescos.map(p => <option key={p.id || p.nombre} value={p.nombre}>{p.nombre}</option>)}
                  </select>
                </div>
              </div>
            )}

            {paso === 3 && (
              <div className="form-grid-ref">
                <div className="input-container"><label>Ocupación Actual</label><input type="text" id='ocupacion' className="input-field" value={datos.ocupacion} onChange={manejarCambio} /></div>
                <div className="input-container" style={{ gridColumn: 'span 2' }}><label>¿Por qué desea unirse a Olimpiadas Especiales?</label><textarea id='motivacion' className="input-field" rows={4} value={datos.motivacion} onChange={manejarCambio}></textarea></div>
                <div className="input-container" style={{ gridColumn: 'span 2' }}>
                  <label>¿Tiene experiencia previa con personas con necesidades especiales?</label>
                  <div className="switch-container">
                    <div className={`switch-option yes ${datos.experienciaNecesidadesEspeciales === 'Si' ? 'active' : ''}`} onClick={() => setDatos(p => ({ ...p, experienciaNecesidadesEspeciales: 'Si' }))}>SÍ</div>
                    <div className={`switch-option no ${datos.experienciaNecesidadesEspeciales === 'No' ? 'active' : ''}`} onClick={() => setDatos(p => ({ ...p, experienciaNecesidadesEspeciales: 'No' }))}>NO</div>
                  </div>
                </div>
              </div>
            )}

            {paso === 4 && (
              <div className="form-sections-modern">
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>
                  Adjunte sus documentos en formato <strong>PDF, JPG o PNG</strong> (máx. 5MB). La cédula es obligatoria.
                </p>

                {/* Cédula */}
                <div
                  onClick={() => document.getElementById('file-cedula-t').click()}
                  style={{ cursor: 'pointer', border: `2px dashed ${archivos.cedula ? '#16a34a' : '#E00000'}`, borderRadius: '16px', padding: '25px', textAlign: 'center', background: archivos.cedula ? '#f0fdf4' : '#fff1f2', transition: 'all 0.2s' }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📄</div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1e293b' }}>Cédula de Identidad <span style={{ color: '#E00000' }}>*</span></h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Haga clic para seleccionar archivo</p>
                  <input id="file-cedula-t" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" style={{ display: 'none' }} onChange={(e) => validarYGuardarArchivo(e.target.files[0], 'cedula')} />
                  {archivos.cedula && <div style={{ marginTop: '12px', padding: '6px 16px', background: '#dcfce7', color: '#166534', borderRadius: '20px', display: 'inline-block', fontSize: '13px', fontWeight: 700 }}>✓ {archivos.cedula.name}</div>}
                </div>

                {/* Foto de Perfil */}
                <div
                  onClick={() => document.getElementById('file-foto-t').click()}
                  style={{ cursor: 'pointer', border: `2px dashed ${archivos.foto ? '#16a34a' : '#cbd5e1'}`, borderRadius: '16px', padding: '25px', textAlign: 'center', background: archivos.foto ? '#f0fdf4' : '#f8fafc', transition: 'all 0.2s' }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📸</div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1e293b' }}>Foto de Perfil</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Opcional — foto tipo carné</p>
                  <input id="file-foto-t" type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={(e) => validarYGuardarArchivo(e.target.files[0], 'foto')} />
                  {archivos.foto && <div style={{ marginTop: '12px', padding: '6px 16px', background: '#dcfce7', color: '#166534', borderRadius: '20px', display: 'inline-block', fontSize: '13px', fontWeight: 700 }}>✓ {archivos.foto.name}</div>}
                </div>

                <div style={{ marginTop: '10px', padding: '15px 20px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="checkbox" id="verificado-t" style={{ width: '18px', height: '18px', accentColor: '#E00000', cursor: 'pointer' }} />
                  <label htmlFor="verificado-t" style={{ fontSize: '13px', color: '#475569', cursor: 'pointer' }}>Confirmo que los datos son verídicos y autorizo el tratamiento de mi información.</label>
                </div>
              </div>
            )}
          </div>

          <div className="content-footer">
            <button className="btn-secondary" onClick={manejarAnterior}>{paso === 1 ? 'Cancelar' : 'Anterior'}</button>
            {paso < 4
              ? <button className="btn-primary" onClick={manejarSiguiente}>Siguiente Paso →</button>
              : <button className="btn-primary" onClick={finalizarInscripcion}>Registrar ✓</button>
            }
          </div>
        </main>
      </div>
    </div>
  );
}

export default FormTutor;
