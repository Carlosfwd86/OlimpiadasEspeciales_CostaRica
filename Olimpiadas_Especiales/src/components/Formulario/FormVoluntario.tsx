import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import { getConfig } from '../../services/ServicesConfig';
import DatePickerInput from '../DatePickerInput';
import { mensajeValidacionFechaAdulto } from '../../utils/edad';
import '../../styles/Formulario/FormVoluntario.css';
import type { ConfigItem } from '../../types';
import { ArchivoAdjuntoBadge, FormIcon, type FormIconName } from './FormIcons';

emailjs.init("4zWvRC7Yn7lUDqd1q");

interface FormVoluntarioProps { onVolver: () => void; }
interface DatosVoluntario { nombre: string; cedula: string; fechaNacimiento: string; genero: string; telefono: string; correoElectronico: string; direccion: string; pais: string; areasInteres: string[]; otraArea: string; disponibilidad: string; experienciaPrevia: string; [key: string]: unknown; }
interface ArchivosVoluntario { cedula: File | null; delincuencia: File | null; foto: File | null; }

function FormVoluntario({ onVolver }: FormVoluntarioProps): React.JSX.Element {
  const [paso, setPaso] = useState<number>(1);
  const [datos, setDatos] = useState<DatosVoluntario>({ nombre: '', cedula: '', fechaNacimiento: '', genero: '', telefono: '', correoElectronico: '', direccion: '', pais: '', areasInteres: [], otraArea: '', disponibilidad: '', experienciaPrevia: '' });
  const [errores, setErrores] = useState<Record<string, boolean>>({});
  const [errorFechaNacimiento, setErrorFechaNacimiento] = useState<string>('');
  const [archivos, setArchivos] = useState<ArchivosVoluntario>({ cedula: null, delincuencia: null, foto: null });
  const [areasCatalogo, setAreasCatalogo] = useState<ConfigItem[]>([]);

  useEffect(() => { getConfig('areas_voluntariado').then(setAreasCatalogo); }, []);
  useEffect(() => {
    const sesion = localStorage.getItem('usuarioSesion');
    if (sesion) {
      const user = JSON.parse(sesion) as Record<string, string>;
      setDatos(prev => ({ ...prev, nombre: user.nombre || prev.nombre, cedula: user.cedula || prev.cedula, fechaNacimiento: user.fechaNacimiento || prev.fechaNacimiento, genero: user.genero || prev.genero, telefono: user.telefono || prev.telefono, correoElectronico: user.correoElectronico || prev.correoElectronico, direccion: user.direccion || prev.direccion, pais: user.pais || prev.pais }));
    }
  }, []);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { id, value } = e.target;
    setDatos(prev => ({ ...prev, [id]: value }));
    if (errores[id]) setErrores(prev => ({ ...prev, [id]: false }));
  };

  const manejarCambioFecha = (e: { target: { name: string; value: string } }): void => {
    const { name, value } = e.target;
    setDatos(prev => ({ ...prev, [name]: value }));
    const msg = mensajeValidacionFechaAdulto(value, 'voluntario');
    setErrorFechaNacimiento(msg || '');
    setErrores(prev => ({ ...prev, fechaNacimiento: !!msg }));
  };

  const validarYGuardarArchivo = (file: File | null, campo: keyof ArchivosVoluntario): void => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { Swal.fire({ icon: 'error', title: 'Archivo Muy Grande', text: 'El archivo no debe superar los 5MB.', confirmButtonColor: '#E00000' }); return; }
    setArchivos(prev => ({ ...prev, [campo]: file }));
  };

  const validarPaso = (): boolean => {
    const nuevosErrores: Record<string, boolean> = {};
    let falte = false;
    if (paso === 1) {
      ['nombre', 'cedula', 'fechaNacimiento', 'telefono', 'correoElectronico', 'direccion'].forEach(f => { if (!datos[f]?.toString().trim()) { nuevosErrores[f] = true; falte = true; } });
      if (datos.correoElectronico && !/\S+@\S+\.\S+/.test(datos.correoElectronico)) { Swal.fire({ icon: 'error', title: 'Correo Inválido', text: 'Ingrese un correo válido.', confirmButtonColor: '#E00000' }); return false; }
      const msgFecha = mensajeValidacionFechaAdulto(datos.fechaNacimiento, 'voluntario');
      if (msgFecha) {
        setErrorFechaNacimiento(msgFecha);
        setErrores(prev => ({ ...prev, fechaNacimiento: true }));
        Swal.fire({
          icon: 'error',
          title: 'Edad no permitida',
          text: msgFecha,
          confirmButtonColor: '#E00000',
        });
        return false;
      }
    }
    if (paso === 2 && datos.areasInteres.length === 0 && !datos.otraArea.trim()) { Swal.fire({ icon: 'error', title: 'Selección Requerida', text: 'Seleccione al menos un área de interés.', confirmButtonColor: '#E00000' }); return false; }
    if (paso === 3 && !datos.disponibilidad.trim()) { Swal.fire({ icon: 'error', title: 'Falta Disponibilidad', text: 'Indique su disponibilidad de tiempo.', confirmButtonColor: '#E00000' }); return false; }
    if (paso === 4 && !archivos.cedula) { Swal.fire({ icon: 'error', title: 'Documento Requerido', text: 'Por favor adjunte su identificación.', confirmButtonColor: '#E00000' }); return false; }
    if (falte) { setErrores(nuevosErrores); Swal.fire({ icon: 'error', title: 'Campos Incompletos', text: 'Llene todos los campos obligatorios.', confirmButtonColor: '#E00000' }); return false; }
    return true;
  };

  const manejarSiguiente = (): void => { if (validarPaso()) setPaso(paso + 1); };
  const manejarAnterior = (): void => { if (paso === 1) onVolver(); else setPaso(paso - 1); };

  const finalizarInscripcion = (): void => {
    const msgFecha = mensajeValidacionFechaAdulto(datos.fechaNacimiento, 'voluntario');
    if (msgFecha) {
      setErrorFechaNacimiento(msgFecha);
      setErrores(prev => ({ ...prev, fechaNacimiento: true }));
      setPaso(1);
      Swal.fire({
        icon: 'error',
        title: 'Edad no permitida',
        text: msgFecha,
        confirmButtonColor: '#E00000',
      });
      return;
    }
    Swal.fire({ title: '¿Finalizar Inscripción de Voluntario?', icon: 'question', showCancelButton: true, confirmButtonText: 'Enviar Registro', confirmButtonColor: '#E00000' }).then(async (res) => {
      if (res.isConfirmed) {
        Swal.fire({ title: 'Guardando registro...', didOpen: () => Swal.showLoading() });
        const sesion = JSON.parse(localStorage.getItem('usuarioSesion') || '{}') as Record<string, string>;
        const archivosNombres = { cedula_nombre: archivos.cedula?.name || 'No adjuntado', delincuencia_nombre: archivos.delincuencia?.name || 'No adjuntado', foto_nombre: archivos.foto?.name || 'No adjuntado' };
        const entry = { ...datos, ...archivosNombres, usuarioId: sesion.id || null, rol: 'voluntario' as const, fechaRegistro: new Date().toISOString(), status: 'PENDIENTE', statusColor: 'yellow', bgColor: 'bg-light-blue', name: datos.nombre, initials: (datos.nombre?.charAt(0) || '') + (datos.nombre?.split(' ')[1]?.charAt(0) || ''), time: 'Registrado ahora' };
        try {
          await ServicesAdmin.saveRegistroConDocumentos(entry, {
            cedula: archivos.cedula,
            delincuencia: archivos.delincuencia,
            foto: archivos.foto,
          });
          await emailjs.send('service_ttxcgou', 'template_2eklg8i', { to_email: datos.correoElectronico, to_name: datos.nombre, message: 'Tu registro como Voluntario fue enviado correctamente.' }, '4zWvRC7Yn7lUDqd1q');
          Swal.fire({ icon: 'success', title: '¡Bienvenido!', text: 'Te has unido exitosamente como voluntario.' }).then(() => window.location.href = '/');
        } catch { Swal.fire({ icon: 'success', title: 'Registro Guardado', text: 'Tu solicitud fue guardada.' }).then(() => window.location.href = '/'); }
      }
    });
  };

  const porcentajeProgreso = paso * 25;
  const steps: { id: number; name: string; icon: FormIconName }[] = [
    { id: 1, name: '1. Datos Personales', icon: 'user' },
    { id: 2, name: '2. Áreas de Interés', icon: 'lightbulb' },
    { id: 3, name: '3. Disponibilidad', icon: 'handshake' },
    { id: 4, name: '4. Documentos', icon: 'file' },
  ];

  return (
    <div className="form-voluntario-layout">
      <header className="form-header"><div className="header-logo"><div className="logo-icon"><FormIcon name="handshake" size={22} /></div><h1>Inscripción Voluntario</h1></div></header>
      <div className="form-body">
        <aside className="form-sidebar">
          <div className="sidebar-card"><div className="registro-info"><div className="registro-icon"><FormIcon name="medal" size={26} /></div><div className="registro-text"><h4>Registro</h4><p>NUEVO VOLUNTARIO</p></div></div></div>
          <nav className="sidebar-nav sidebar-card">{steps.map(s => <div key={s.id} className={`nav-item ${paso === s.id ? 'active' : ''}`}><span className="nav-icon"><FormIcon name={s.icon} size={18} /></span><span>{s.name}</span></div>)}</nav>
          <div className="sidebar-footer"><div className="progress-label"><span>PROGRESO</span><span>{porcentajeProgreso}%</span></div><div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${porcentajeProgreso}%` }}></div></div></div>
        </aside>
        <main className="form-content">
          <div className="content-header">
            {paso === 1 && <h2>Paso 1: Datos de Contacto</h2>}{paso === 2 && <h2>Paso 2: ¿Cómo deseas ayudar?</h2>}{paso === 3 && <h2>Paso 3: Disponibilidad y Experiencia</h2>}{paso === 4 && <h2>Paso 4: Legalidad y Documentos</h2>}
          </div>
          <div className="content-body">
            {paso === 1 && (<div className="form-grid-ref">
              <div className="input-container"><label>Nombre Completo *</label><input type="text" id='nombre' className={`input-field ${errores.nombre ? 'error' : ''}`} value={datos.nombre} onChange={manejarCambio} /></div>
              <div className="input-container"><label>Cédula *</label><input type="text" id='cedula' className={`input-field ${errores.cedula ? 'error' : ''}`} value={datos.cedula} onChange={manejarCambio} /></div>
              <div className="input-container">
                <label>Fecha de Nacimiento *</label>
                <DatePickerInput
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={datos.fechaNacimiento}
                  onChange={manejarCambioFecha}
                  hasError={!!errores.fechaNacimiento}
                />
                {errorFechaNacimiento && (
                  <p style={{ color: '#E00000', fontSize: '13px', marginTop: '6px', fontWeight: 600 }}>
                    {errorFechaNacimiento}
                  </p>
                )}
              </div>
              <div className="input-container"><label>Género</label><select id="genero" className="input-field" value={datos.genero} onChange={manejarCambio}><option value="">Seleccione...</option><option value="Masculino">Masculino</option><option value="Femenino">Femenino</option></select></div>
              <div className="input-container"><label>Teléfono *</label><input type="text" id='telefono' className={`input-field ${errores.telefono ? 'error' : ''}`} value={datos.telefono} onChange={manejarCambio} /></div>
              <div className="input-container"><label>País</label><input type="text" id='pais' className="input-field" value={datos.pais} onChange={manejarCambio} /></div>
              <div className="input-container"><label>Correo Electrónico *</label><input type="email" id='correoElectronico' className={`input-field ${errores.correoElectronico ? 'error' : ''}`} value={datos.correoElectronico} onChange={manejarCambio} /></div>
              <div className="input-container" style={{ gridColumn: 'span 2' }}><label>Dirección *</label><textarea id="direccion" className={`input-field ${errores.direccion ? 'error' : ''}`} value={datos.direccion} onChange={manejarCambio}></textarea></div>
            </div>)}
            {paso === 2 && (<div className="form-sections-modern">
              <p style={{ fontWeight: 600, color: '#64748b', marginBottom: '15px' }}>Selecciona las áreas donde te gustaría colaborar:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {areasCatalogo.map(area => (
                  <label key={String(area.id)} className="checkbox-label">
                    <input type="checkbox" checked={datos.areasInteres.includes(String(area.nombre))} onChange={() => setDatos(prev => ({ ...prev, areasInteres: prev.areasInteres.includes(String(area.nombre)) ? prev.areasInteres.filter(a => a !== String(area.nombre)) : [...prev.areasInteres, String(area.nombre)] }))} style={{ accentColor: '#E00000', width: '16px', height: '16px' }} />
                    <span>{String(area.nombre)}</span>
                  </label>
                ))}
              </div>
              <div className="input-container" style={{ marginTop: '20px' }}><label>Otra área específica:</label><input type="text" id='otraArea' className="input-field" value={datos.otraArea} onChange={manejarCambio} /></div>
            </div>)}
            {paso === 3 && (<div className="form-grid-ref">
              <div className="input-container" style={{ gridColumn: 'span 2' }}><label>Disponibilidad de Tiempo (Días / Horas) *</label><textarea id='disponibilidad' className="input-field" rows={3} value={datos.disponibilidad} onChange={manejarCambio}></textarea></div>
              <div className="input-container" style={{ gridColumn: 'span 2' }}><label>Experiencia previa en voluntariado (Opcional)</label><textarea id='experienciaPrevia' className="input-field" rows={3} value={datos.experienciaPrevia} onChange={manejarCambio}></textarea></div>
            </div>)}
            {paso === 4 && (<div className="form-sections-modern">
              {[{ campo: 'cedula' as keyof ArchivosVoluntario, fileId: 'file-cedula-v', icon: 'file' as FormIconName, titulo: 'Cédula de Identidad', requerido: true }, { campo: 'delincuencia' as keyof ArchivosVoluntario, fileId: 'file-del-v', icon: 'clipboard-list', titulo: 'Hoja de Delincuencia', requerido: false }, { campo: 'foto' as keyof ArchivosVoluntario, fileId: 'file-foto-v', icon: 'camera', titulo: 'Foto de Perfil', requerido: false }].map(({ campo, fileId, icon, titulo, requerido }) => (
                <div key={fileId} onClick={() => (document.getElementById(fileId) as HTMLInputElement)?.click()} style={{ cursor: 'pointer', border: `2px dashed ${archivos[campo] ? '#16a34a' : requerido ? '#E00000' : '#cbd5e1'}`, borderRadius: '16px', padding: '25px', textAlign: 'center', background: archivos[campo] ? '#f0fdf4' : requerido ? '#fff1f2' : '#f8fafc', transition: 'all 0.2s' }}>
                  <div className="upload-zone-icon"><FormIcon name={icon} size={36} /></div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1e293b' }}>{titulo}{requerido && <span style={{ color: '#E00000' }}> *</span>}</h4>
                  <input id={fileId} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" style={{ display: 'none' }} onChange={(e) => validarYGuardarArchivo(e.target.files?.[0] ?? null, campo)} />
                  {archivos[campo] && <ArchivoAdjuntoBadge nombre={archivos[campo]!.name} />}
                </div>
              ))}
              <div style={{ marginTop: '10px', padding: '15px 20px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="checkbox" id="verificado-v" style={{ width: '18px', height: '18px', accentColor: '#E00000', cursor: 'pointer' }} />
                <label htmlFor="verificado-v" style={{ fontSize: '13px', color: '#475569', cursor: 'pointer' }}>Confirmo que los datos son verídicos y autorizo el tratamiento de mi información.</label>
              </div>
            </div>)}
          </div>
          <div className="content-footer">
            <button className="btn-secondary" onClick={manejarAnterior}>{paso === 1 ? 'Cancelar' : 'Anterior'}</button>
            {paso < 4 ? <button className="btn-primary" onClick={manejarSiguiente}>Siguiente Paso →</button> : <button className="btn-primary" onClick={finalizarInscripcion} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><FormIcon name="check" size={18} /> Unirse</button>}
          </div>
        </main>
      </div>
    </div>
  );
}

export default FormVoluntario;
