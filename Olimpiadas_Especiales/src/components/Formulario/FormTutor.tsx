import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import { getConfig } from '../../services/ServicesConfig';
import '../../styles/Formulario/FormTutor.css';
import type { ConfigItem } from '../../types';

emailjs.init("4zWvRC7Yn7lUDqd1q");

interface FormTutorProps { onVolver: () => void; }
interface DatosTutor { nombre: string; cedula: string; telefono: string; correoElectronico: string; direccion: string; pais: string; nombreAtleta: string; relacionConAtleta: string; ocupacion: string; motivacion: string; experienciaNecesidadesEspeciales: string; [key: string]: string; }
interface ArchivosTutor { cedula: File | null; foto: File | null; }

function FormTutor({ onVolver }: FormTutorProps): React.JSX.Element {
  const [paso, setPaso] = useState<number>(1);
  const [datos, setDatos] = useState<DatosTutor>({ nombre: '', cedula: '', telefono: '', correoElectronico: '', direccion: '', pais: '', nombreAtleta: '', relacionConAtleta: '', ocupacion: '', motivacion: '', experienciaNecesidadesEspeciales: 'No' });
  const [errores, setErrores] = useState<Record<string, boolean>>({});
  const [archivos, setArchivos] = useState<ArchivosTutor>({ cedula: null, foto: null });
  const [parentescos, setParentescos] = useState<ConfigItem[]>([]);

  useEffect(() => { getConfig('parentescos').then(setParentescos); }, []);
  useEffect(() => {
    const sesion = localStorage.getItem('usuarioSesion');
    if (sesion) {
      const user = JSON.parse(sesion) as Record<string, string>;
      setDatos(prev => ({ ...prev, nombre: user.nombre || prev.nombre, cedula: user.cedula || prev.cedula, telefono: user.telefono || prev.telefono, correoElectronico: user.correoElectronico || prev.correoElectronico, direccion: user.direccion || prev.direccion, pais: user.pais || prev.pais }));
    }
  }, []);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { id, value } = e.target;
    setDatos(prev => ({ ...prev, [id]: value }));
    if (errores[id]) setErrores(prev => ({ ...prev, [id]: false }));
  };

  const validarYGuardarArchivo = (file: File | null, campo: keyof ArchivosTutor): void => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { Swal.fire({ icon: 'error', title: 'Archivo Muy Grande', text: 'El archivo no debe superar los 5MB.', confirmButtonColor: '#E00000' }); return; }
    setArchivos(prev => ({ ...prev, [campo]: file }));
  };

  const validarPaso = (): boolean => {
    const nuevosErrores: Record<string, boolean> = {};
    let falte = false;
    if (paso === 1) {
      ['nombre', 'cedula', 'telefono', 'correoElectronico', 'direccion'].forEach(f => { if (!datos[f]?.toString().trim()) { nuevosErrores[f] = true; falte = true; } });
      if (datos.correoElectronico && !/\S+@\S+\.\S+/.test(datos.correoElectronico)) { Swal.fire({ icon: 'error', title: 'Correo Inválido', text: 'Ingrese un correo válido.', confirmButtonColor: '#E00000' }); return false; }
    }
    if (paso === 2 && (!datos.nombreAtleta || !datos.relacionConAtleta)) { Swal.fire({ icon: 'error', title: 'Paso 2 Incompleto', text: 'Indique el nombre del atleta y su relación.', confirmButtonColor: '#E00000' }); return false; }
    if (paso === 4 && !archivos.cedula) { Swal.fire({ icon: 'error', title: 'Documento Requerido', text: 'Por favor adjunte su identificación.', confirmButtonColor: '#E00000' }); return false; }
    if (falte) { setErrores(nuevosErrores); Swal.fire({ icon: 'error', title: 'Campos Incompletos', text: 'Llene todos los campos obligatorios.', confirmButtonColor: '#E00000' }); return false; }
    return true;
  };

  const manejarSiguiente = (): void => { if (validarPaso()) setPaso(paso + 1); };
  const manejarAnterior = (): void => { if (paso === 1) onVolver(); else setPaso(paso - 1); };

  const finalizarInscripcion = (): void => {
    Swal.fire({ title: '¿Registrar como Tutor?', icon: 'question', showCancelButton: true, confirmButtonText: 'Sí, Registrar', confirmButtonColor: '#E00000' }).then(async (res) => {
      if (res.isConfirmed) {
        Swal.fire({ title: 'Procesando...', didOpen: () => Swal.showLoading() });
        const sesion = JSON.parse(localStorage.getItem('usuarioSesion') || '{}') as Record<string, string>;
        const archivosNombres = { cedula_nombre: archivos.cedula?.name || 'No adjuntado', foto_nombre: archivos.foto?.name || 'No adjuntado' };
        const entry = { ...datos, ...archivosNombres, usuarioId: sesion.id || null, rol: 'tutor' as const, fechaRegistro: new Date().toISOString(), status: 'PENDIENTE', statusColor: 'yellow', bgColor: 'bg-light-blue', name: datos.nombre, initials: (datos.nombre?.charAt(0) || '') + (datos.nombre?.split(' ')[1]?.charAt(0) || ''), time: 'Registrado ahora' };
        try {
          await ServicesAdmin.saveRegistro(entry);
          await emailjs.send('service_ttxcgou', 'template_2eklg8i', { to_email: datos.correoElectronico, to_name: datos.nombre, message: 'Tu registro como Tutor fue enviado correctamente.' }, '4zWvRC7Yn7lUDqd1q');
          Swal.fire({ icon: 'success', title: '¡Completado!', text: 'Registro de tutor exitoso.' }).then(() => window.location.href = '/');
        } catch { Swal.fire({ icon: 'success', title: 'Guardado', text: 'Registro guardado correctamente.' }).then(() => window.location.href = '/'); }
      }
    });
  };

  const porcentajeProgreso = paso * 25;
  const steps = [{ id: 1, name: "1. Datos Personales", icon: "👤" }, { id: 2, name: "2. Atleta a Cargo", icon: "🏃" }, { id: 3, name: "3. Perfil y Motivo", icon: "✨" }, { id: 4, name: "4. Documentos", icon: "📄" }];

  return (
    <div className="form-tutor-layout">
      <header className="form-header"><div className="header-logo"><div className="logo-icon">👪</div><h1>Inscripción Tutor / Familiar</h1></div></header>
      <div className="form-body">
        <aside className="form-sidebar">
          <div className="sidebar-card"><div className="registro-info"><div className="registro-icon">🏠</div><div className="registro-text"><h4>Registro</h4><p>NUEVO TUTOR</p></div></div></div>
          <nav className="sidebar-nav sidebar-card">{steps.map(s => <div key={s.id} className={`nav-item ${paso === s.id ? 'active' : ''}`}><span className="nav-icon">{s.icon}</span><span>{s.name}</span></div>)}</nav>
          <div className="sidebar-footer"><div className="progress-label"><span>PROGRESO</span><span>{porcentajeProgreso}%</span></div><div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${porcentajeProgreso}%` }}></div></div></div>
        </aside>
        <main className="form-content">
          <div className="content-header">
            {paso === 1 && <h2>Paso 1: Información Personal</h2>}{paso === 2 && <h2>Paso 2: Información del Atleta</h2>}{paso === 3 && <h2>Paso 3: Perfil del Tutor</h2>}{paso === 4 && <h2>Paso 4: Documentación</h2>}
          </div>
          <div className="content-body">
            {paso === 1 && (<div className="form-grid-ref">
              <div className="input-container"><label>Nombre Completo *</label><input type="text" id='nombre' className={`input-field ${errores.nombre ? 'error' : ''}`} value={datos.nombre} onChange={manejarCambio} /></div>
              <div className="input-container"><label>Cédula *</label><input type="text" id='cedula' className={`input-field ${errores.cedula ? 'error' : ''}`} value={datos.cedula} onChange={manejarCambio} /></div>
              <div className="input-container"><label>Teléfono *</label><input type="text" id='telefono' className={`input-field ${errores.telefono ? 'error' : ''}`} value={datos.telefono} onChange={manejarCambio} /></div>
              <div className="input-container"><label>País</label><input type="text" id='pais' className="input-field" value={datos.pais} onChange={manejarCambio} /></div>
              <div className="input-container"><label>Correo Electrónico *</label><input type="email" id='correoElectronico' className={`input-field ${errores.correoElectronico ? 'error' : ''}`} value={datos.correoElectronico} onChange={manejarCambio} /></div>
              <div className="input-container" style={{ gridColumn: 'span 2' }}><label>Dirección Exacta *</label><textarea id="direccion" className={`input-field ${errores.direccion ? 'error' : ''}`} value={datos.direccion} onChange={manejarCambio}></textarea></div>
            </div>)}
            {paso === 2 && (<div className="form-grid-ref">
              <div className="input-container" style={{ gridColumn: 'span 2' }}><label>Nombre Completo del Atleta *</label><input type="text" id='nombreAtleta' className="input-field" value={datos.nombreAtleta} onChange={manejarCambio} /></div>
              <div className="input-container"><label>Parentesco / Relación *</label><select id="relacionConAtleta" className="input-field" value={datos.relacionConAtleta} onChange={manejarCambio}><option value="">Seleccione...</option>{parentescos.map(p => <option key={String(p.id)} value={String(p.nombre)}>{String(p.nombre)}</option>)}</select></div>
            </div>)}
            {paso === 3 && (<div className="form-grid-ref">
              <div className="input-container"><label>Ocupación Actual</label><input type="text" id='ocupacion' className="input-field" value={datos.ocupacion} onChange={manejarCambio} /></div>
              <div className="input-container" style={{ gridColumn: 'span 2' }}><label>¿Por qué desea unirse a Olimpiadas Especiales?</label><textarea id='motivacion' className="input-field" rows={4} value={datos.motivacion} onChange={manejarCambio}></textarea></div>
              <div className="input-container" style={{ gridColumn: 'span 2' }}><label>¿Tiene experiencia previa con personas con necesidades especiales?</label><div className="switch-container"><div className={`switch-option yes ${datos.experienciaNecesidadesEspeciales === 'Si' ? 'active' : ''}`} onClick={() => setDatos(p => ({ ...p, experienciaNecesidadesEspeciales: 'Si' }))}>SÍ</div><div className={`switch-option no ${datos.experienciaNecesidadesEspeciales === 'No' ? 'active' : ''}`} onClick={() => setDatos(p => ({ ...p, experienciaNecesidadesEspeciales: 'No' }))}>NO</div></div></div>
            </div>)}
            {paso === 4 && (<div className="form-sections-modern">
              {[{ campo: 'cedula' as keyof ArchivosTutor, fileId: 'file-cedula-t', emoji: '📄', titulo: 'Cédula de Identidad', requerido: true }, { campo: 'foto' as keyof ArchivosTutor, fileId: 'file-foto-t', emoji: '📸', titulo: 'Foto de Perfil', requerido: false }].map(({ campo, fileId, emoji, titulo, requerido }) => (
                <div key={fileId} onClick={() => (document.getElementById(fileId) as HTMLInputElement)?.click()} style={{ cursor: 'pointer', border: `2px dashed ${archivos[campo] ? '#16a34a' : requerido ? '#E00000' : '#cbd5e1'}`, borderRadius: '16px', padding: '25px', textAlign: 'center', background: archivos[campo] ? '#f0fdf4' : requerido ? '#fff1f2' : '#f8fafc', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>{emoji}</div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1e293b' }}>{titulo}{requerido && <span style={{ color: '#E00000' }}> *</span>}</h4>
                  <input id={fileId} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" style={{ display: 'none' }} onChange={(e) => validarYGuardarArchivo(e.target.files?.[0] ?? null, campo)} />
                  {archivos[campo] && <div style={{ marginTop: '12px', padding: '6px 16px', background: '#dcfce7', color: '#166534', borderRadius: '20px', display: 'inline-block', fontSize: '13px', fontWeight: 700 }}>✓ {archivos[campo]!.name}</div>}
                </div>
              ))}
              <div style={{ marginTop: '10px', padding: '15px 20px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="checkbox" id="verificado-t" style={{ width: '18px', height: '18px', accentColor: '#E00000', cursor: 'pointer' }} />
                <label htmlFor="verificado-t" style={{ fontSize: '13px', color: '#475569', cursor: 'pointer' }}>Confirmo que los datos son verídicos y autorizo el tratamiento de mi información.</label>
              </div>
            </div>)}
          </div>
          <div className="content-footer">
            <button className="btn-secondary" onClick={manejarAnterior}>{paso === 1 ? 'Cancelar' : 'Anterior'}</button>
            {paso < 4 ? <button className="btn-primary" onClick={manejarSiguiente}>Siguiente Paso →</button> : <button className="btn-primary" onClick={finalizarInscripcion}>Registrar ✓</button>}
          </div>
        </main>
      </div>
    </div>
  );
}

export default FormTutor;
