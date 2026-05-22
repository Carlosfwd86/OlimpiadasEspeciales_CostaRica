import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import { getFullConfig } from '../../services/ServicesConfig';
import DatePickerInput from '../DatePickerInput';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import { mapUsuarioToDatosAtleta, leerUsuarioSesion } from '../../utils/mapUsuarioSesion';
import '../../styles/Formulario/FormAtleta.css';
import type { ConfigData } from '../../types';

emailjs.init("4zWvRC7Yn7lUDqd1q");

const getFechaHoyFormateada = (): string => {
  const hoy = new Date();
  return hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0') + '-' + String(hoy.getDate()).padStart(2, '0');
};

interface Medicamento {
  nombre: string;
  dosis: string;
  frecuencia: string;
}

interface DatosAtleta {
  programa: string;
  nombre: string;
  fechaNacimiento: string;
  pais: string;
  cedula: string;
  genero: string;
  direccion: string;
  telefono: string;
  correoElectronico: string;
  emergenciaNombre: string;
  emergenciaTelefono: string;
  tutorNombre: string;
  tutorApellido: string;
  tutorRelacion: string;
  tutorCorreo: string;
  tutorTelefono: string;
  tutorPais: string;
  tutorCedula: string;
  medicamentos: Medicamento[];
  condicionesMedicas: string[];
  dispositivosMovilidad: string[];
  ayudasEstiloVida: string[];
  comunicaciones: string[];
  dispositivosMedicos: string[];
  reqDietetico: string;
  especificacionDietetico: string;
  otrosDispositivos: string;
  especificacionOtrosDispositivos: string;
  afeccionCardiaca: string;
  asma: string;
  diabetes: string;
  discVisual: string;
  discAuditiva: string;
  trastornoHemorragico: string;
  medicoLimitoDeportes: string;
  epilepsiaConvulsivo: string;
  anemiaDepranocitica: string;
  conmocionCerebral: string;
  cantidadConmociones: string;
  fechaUltimaConmocion: string;
  afeccionesMentales: string;
  especificacionAfeccionesMentales: string;
  alergiasGraves: string;
  tiposAlergia: string[];
  especificacionAlergiaOtro: string;
  tomaMedicamentos: string;
  terminosAceptados: boolean;
  objecionTratamientoMedico: boolean;
  objecionTransfusiones: boolean;
  firmaAtleta: string;
  fechaFirmaAtleta: string;
  firmaTutor: string;
  relacionTutor: string;
  fechaFirmaTutor: string;
  interesInvestigacion: string;
  disciplina: string;
  nivelHabilidad: string;
  relacionAtleta: string;
  relacionAtletaOtro: string;
  [key: string]: unknown;
}

interface ArchivosAtleta {
  identificacion: File | null;
  certificado: File | null;
  foto: File | null;
  identificacionTutor: File | null;
  consentimiento?: File | null;
  exoneracion?: File | null;
}

interface FormAtletaProps {
  onVolver: () => void;
}

function FormAtleta({ onVolver }: FormAtletaProps): React.JSX.Element {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [paso, setPaso] = useState<number>(1);
  const [dislexiaActivo, setDislexiaActivo] = useState<boolean>(false);
  const [datos, setDatos] = useState<DatosAtleta>({
    programa: '', nombre: '', fechaNacimiento: '', pais: '', cedula: '', genero: '', direccion: '', telefono: '', correoElectronico: '', emergenciaNombre: '', emergenciaTelefono: '',
    tutorNombre: '', tutorApellido: '', tutorRelacion: '', tutorCorreo: '', tutorTelefono: '', tutorPais: '', tutorCedula: '',
    medicamentos: [], condicionesMedicas: [], dispositivosMovilidad: [], ayudasEstiloVida: [], comunicaciones: [], dispositivosMedicos: [],
    reqDietetico: '', especificacionDietetico: '', otrosDispositivos: '', especificacionOtrosDispositivos: '', afeccionCardiaca: '', asma: '', diabetes: '',
    discVisual: '', discAuditiva: '', trastornoHemorragico: '', medicoLimitoDeportes: '', epilepsiaConvulsivo: '', anemiaDepranocitica: '', conmocionCerebral: '',
    cantidadConmociones: '', fechaUltimaConmocion: '', afeccionesMentales: '', especificacionAfeccionesMentales: '', alergiasGraves: '', tiposAlergia: [],
    especificacionAlergiaOtro: '', tomaMedicamentos: '', terminosAceptados: false, objecionTratamientoMedico: false, objecionTransfusiones: false,
    firmaAtleta: '', fechaFirmaAtleta: getFechaHoyFormateada(), firmaTutor: '', relacionTutor: '', fechaFirmaTutor: getFechaHoyFormateada(), interesInvestigacion: '',
    disciplina: '', nivelHabilidad: '', relacionAtleta: '', relacionAtletaOtro: ''
  });
  const [errores, setErrores] = useState<Record<string, boolean>>({});
  const [archivos, setArchivos] = useState<ArchivosAtleta>({ identificacion: null, certificado: null, foto: null, identificacionTutor: null });
  const [catalogos, setCatalogos] = useState<ConfigData>({ disciplinas: [], programas: [], niveles_habilidad: [], roles: [], areas_voluntariado: [], tipos_recursos: [], categorias_eventos: [] });
  const [ocrCargando, setOcrCargando] = useState<boolean>(false);


  useEffect(() => {
    const cargarCatalogos = async (): Promise<void> => {
      const data = await getFullConfig();
      setCatalogos(data);
    };
    cargarCatalogos();
  }, []);

  useEffect(() => {
    if (authLoading) return;

    const aplicarPrefill = (raw: Record<string, unknown> | null | undefined) => {
      const mapped = mapUsuarioToDatosAtleta(raw);
      if (!Object.values(mapped).some(v => v)) return;

      setDatos(prev => ({
        ...prev,
        nombre: mapped.nombre || prev.nombre,
        cedula: mapped.cedula || prev.cedula,
        correoElectronico: mapped.correoElectronico || prev.correoElectronico,
        telefono: mapped.telefono || prev.telefono,
        direccion: mapped.direccion || prev.direccion,
        pais: mapped.pais || prev.pais,
        genero: mapped.genero || prev.genero,
        fechaNacimiento: mapped.fechaNacimiento || prev.fechaNacimiento
      }));
    };

    const cargarDatosUsuario = async (): Promise<void> => {
      aplicarPrefill(leerUsuarioSesion());
      aplicarPrefill(user as Record<string, unknown> | null);

      if (!isAuthenticated) return;

      try {
        const res = await apiClient.get<{ data: Record<string, unknown> }>('/auth/profile');
        if (res.data?.data) aplicarPrefill(res.data.data);
      } catch (err) {
        console.warn('[FormAtleta] No se pudo cargar perfil para autocompletar:', err);
      }
    };

    cargarDatosUsuario();
  }, [authLoading, isAuthenticated, user]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { id, name, value } = e.target;
    const key = id || name;
    setDatos(prev => ({ ...prev, [key]: value }));
    if (errores[key]) setErrores(prev => ({ ...prev, [key]: false }));
  };

  const manejarCambioCheckbox = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, name, checked } = e.target;
    const key = id || name;
    setDatos(prev => ({ ...prev, [key]: checked }));
    if (errores[key]) setErrores(prev => ({ ...prev, [key]: false }));
  };

  const manejarCambioArreglo = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, checked } = e.target;
    setDatos(prev => {
      let arregloActual = (prev[name] as string[]) || [];
      if (checked) {
        arregloActual = [...arregloActual, value];
      } else {
        arregloActual = arregloActual.filter(item => item !== value);
      }
      return { ...prev, [name]: arregloActual };
    });
    if (errores[name] && checked) {
      setErrores(prev => ({ ...prev, [name]: false }));
    }
  };

  const esMenorDeEdad = (): boolean => {
    if (!datos.fechaNacimiento) return false;
    const hoy = new Date();
    const nacimiento = new Date(datos.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad < 18;
  };

  const agregarMedicamento = (): void => {
    setDatos(prev => ({
      ...prev,
      medicamentos: [...(prev.medicamentos || []), { nombre: '', dosis: '', frecuencia: '' }]
    }));
  };

  const eliminarMedicamento = (index: number): void => {
    setDatos(prev => ({
      ...prev,
      medicamentos: (prev.medicamentos || []).filter((_, i) => i !== index)
    }));
  };

  const manejarCambioMedicamento = (index: number, e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const nuevosMedicamentos = [...(datos.medicamentos || [])];
    nuevosMedicamentos[index] = { ...nuevosMedicamentos[index], [name]: value };
    setDatos(prev => ({ ...prev, medicamentos: nuevosMedicamentos }));
  };

  const manejarClickCondicion = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (e.target.checked) {
      const condicionesDisponibles = [
        { id: 'epilepsia', label: 'Epilepsia' }, { id: 'sindromedeXfragil', label: 'Síndrome de X frágil' },
        { id: 'sindromredeAlcoholismoFetal', label: 'Síndrome de Alcoholismo Fetal' }, { id: 'autismo', label: 'Autismo' },
        { id: 'sindrome-down', label: 'Síndrome de Down' }, { id: 'paralisiscerebral', label: 'Parálisis Cerebral' },
        { id: 'sindromedeMarfan', label: 'Síndrome De Marfan' }, { id: 'espinaBifida', label: 'Espina Bífida' },
        { id: 'desconocido', label: 'Desconocido' }, { id: 'otro', label: 'Otro' }
      ];

      const { value: formValues } = await Swal.fire({
        title: '<h3 style="color: #E00000; font-weight: bold; margin: 0; font-family: Outfit, sans-serif;">Condiciones Médicas</h3>',
        html: `
          <p style="color: #555; font-size: 15px; margin-bottom: 25px; font-family: Outfit, sans-serif;">Seleccione las condiciones aplicables:</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; text-align: left; background: #ffffff; padding: 5px; font-family: Outfit, sans-serif;">
            ${condicionesDisponibles.map(cond => `
              <div style="${cond.id === 'otro' ? 'grid-column: span 2;' : ''}">
                <label style="display: flex; align-items: center; cursor: pointer; padding: 12px 16px; border-radius: 12px; border: 2px solid #f3f4f6; transition: 0.3s; background: #f9fafb;">
                  <input type="checkbox" id="${cond.id}" value="${cond.label}" 
                         style="width: 20px; height: 20px; margin-right: 12px; accent-color: #E00000; cursor: pointer;" 
                         ${cond.id === 'otro' ? 'onchange="document.getElementById(\'otro-container\').style.display = this.checked ? \'block\' : \'none\';"' : ''}>
                  <span style="font-size: 15px; color: #1a1a1a; font-weight: 500;">${cond.label}</span>
                </label>
                ${cond.id === 'otro' ? `
                  <div id="otro-container" style="display: none; padding: 10px 0 0 0;">
                    <input type="text" id="otro-input" placeholder="Especifique cuál condición..." style="width: 100%; padding: 14px; border-radius: 12px; border: 2px solid #E5E5E5; font-size: 15px; outline: none; box-sizing: border-box;">
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        `,
        focusConfirm: false, showCancelButton: true, confirmButtonText: '✅ Aceptar', cancelButtonText: '❌ Cancelar',
        confirmButtonColor: '#E00000', cancelButtonColor: '#A7A9AC', width: '650px',
        preConfirm: () => {
          const resultado: string[] = [];
          for (const cond of condicionesDisponibles) {
            const el = document.getElementById(cond.id) as HTMLInputElement;
            if (el && el.checked) {
              if (cond.id === 'otro') {
                const valorOtro = (document.getElementById('otro-input') as HTMLInputElement).value.trim();
                if (!valorOtro) { Swal.showValidationMessage('Especifique (Otro)'); return false; }
                resultado.push('Otro: ' + valorOtro);
              } else resultado.push(cond.label);
            }
          }
          return resultado;
        }
      });

      if (formValues && (formValues as string[]).length > 0) {
        setDatos(prev => ({ ...prev, condicionesMedicas: [...new Set([...(prev.condicionesMedicas || []), ...(formValues as string[])])] }));
      } else {
        e.target.checked = false;
      }
    } else {
      setDatos(prev => ({ ...prev, condicionesMedicas: [] }));
    }
  };

  const eliminarCondicion = (cond: string): void => {
    setDatos(prev => ({ ...prev, condicionesMedicas: prev.condicionesMedicas.filter(c => c !== cond) }));
  };

  const validarYGuardarArchivo = (file: File | null, tipo: keyof ArchivosAtleta): void => {
    if (!file) return;
    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(file.type) || file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'Archivo inválido', text: 'PDF, JPG o PNG máximo 5MB.', confirmButtonColor: '#E00000' });
      return;
    }
    setArchivos({ ...archivos, [tipo]: file });
  };

  // Procesa el certificado médico con GPT-4o Vision y autocompleta el formulario
  const procesarCertificadoConIA = async (): Promise<void> => {
    if (!archivos.certificado) return;
    const esImagen = archivos.certificado.type.startsWith('image/');
    if (!esImagen) {
      Swal.fire({ icon: 'info', title: 'Formato no compatible con IA', text: 'El auto-completado con IA solo funciona con imágenes (JPG, PNG, WebP). Para PDFs, complete el formulario manualmente.', confirmButtonColor: '#E00000' });
      return;
    }

    setOcrCargando(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(archivos.certificado as File);
      });

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      const response = await fetch(`${API_URL}/ia/registro/ocr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ imagenBase64: base64 })
      });

      const json = await response.json();
      if (json.success && json.datos?.valido) {
        const d = json.datos;
        setDatos(prev => ({
          ...prev,
          ...(d.nombre && { nombre: d.nombre }),
          ...(d.cedula && { cedula: d.cedula }),
          ...(d.fechaNacimiento && { fechaNacimiento: d.fechaNacimiento }),
          ...(d.medicamentos?.length && { medicamentos: d.medicamentos.map((m: string) => ({ nombre: m, dosis: '', frecuencia: '' })), tomaMedicamentos: 'Si' }),
          ...(d.condiciones?.length && { condicionesMedicas: d.condiciones }),
        }));
        Swal.fire({ icon: 'success', title: '¡Datos detectados!', text: `La IA extrajo información del certificado. Revisa y ajusta los campos si es necesario.`, confirmButtonColor: '#E00000' });
      } else {
        Swal.fire({ icon: 'warning', title: 'No se pudo leer el certificado', text: json.datos?.error || 'La imagen no contiene datos médicos reconocibles. Complete el formulario manualmente.', confirmButtonColor: '#E00000' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo conectar con el servicio de IA.', confirmButtonColor: '#E00000' });
    } finally {
      setOcrCargando(false);
    }
  };

  const validarPaso = (): boolean => {
    if (paso === 1) {
      const req = ['nombre', 'fechaNacimiento', 'cedula', 'genero', 'direccion', 'telefono', 'correoElectronico', 'emergenciaNombre', 'emergenciaTelefono'];
      const nuevosErrores: Record<string, boolean> = {};
      let falte = false;
      req.forEach(f => { if (!datos[f]?.toString().trim()) { nuevosErrores[f] = true; falte = true; } });

      if (esMenorDeEdad()) {
        const reqTutor = ['tutorNombre', 'tutorApellido', 'tutorCedula', 'tutorRelacion', 'tutorCorreo', 'tutorTelefono', 'tutorPais'];
        reqTutor.forEach(f => { if (!datos[f]?.toString().trim()) { nuevosErrores[f] = true; falte = true; } });
      }

      if (falte) {
        const mensajeError = esMenorDeEdad() ? 'Por favor complete todos los datos personales obligatorios y los datos del tutor.' : 'Por favor complete todos los campos personales obligatorios.';
        Swal.fire({ icon: 'error', title: 'Campos Incompletos', text: mensajeError, confirmButtonColor: '#E00000' });
        setErrores(nuevosErrores);
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correoElectronico)) {
        Swal.fire({ icon: 'error', title: 'Correo Inválido', text: 'Ingrese un formato de correo electrónico válido.', confirmButtonColor: '#E00000' });
        return false;
      }
      if (esMenorDeEdad() && datos.tutorCorreo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.tutorCorreo)) {
        Swal.fire({ icon: 'error', title: 'Correo del Tutor Inválido', text: 'Ingrese un formato válido para el tutor.', confirmButtonColor: '#E00000' });
        return false;
      }
      return true;
    }

    if (paso === 2) {
      const qReq = ['reqDietetico', 'otrosDispositivos', 'afeccionCardiaca', 'asma', 'diabetes', 'discVisual', 'discAuditiva', 'trastornoHemorragico', 'medicoLimitoDeportes', 'epilepsiaConvulsivo', 'anemiaDepranocitica', 'conmocionCerebral', 'afeccionesMentales', 'alergiasGraves', 'tomaMedicamentos'];
      const nuevosErrores: Record<string, boolean> = {};
      let falte = false;
      qReq.forEach(q => { if (!datos[q]) { nuevosErrores[q] = true; falte = true; } });

      if (datos.alergiasGraves === 'Si') {
        if (!datos.tiposAlergia || datos.tiposAlergia.length === 0) { falte = true; nuevosErrores.tiposAlergia = true; }
        if (datos.tiposAlergia?.includes('Otros (especifique)') && !datos.especificacionAlergiaOtro?.trim()) { falte = true; nuevosErrores.especificacionAlergiaOtro = true; }
      }
      if (datos.reqDietetico === 'Si' && !datos.especificacionDietetico?.trim()) { falte = true; nuevosErrores.especificacionDietetico = true; }
      if (datos.otrosDispositivos === 'Si' && !datos.especificacionOtrosDispositivos?.trim()) { falte = true; nuevosErrores.especificacionOtrosDispositivos = true; }
      if (datos.conmocionCerebral === 'Si' && (!datos.cantidadConmociones?.trim() || !datos.fechaUltimaConmocion?.trim())) {
        falte = true;
        if(!datos.cantidadConmociones?.trim()) nuevosErrores.cantidadConmociones = true;
        if(!datos.fechaUltimaConmocion?.trim()) nuevosErrores.fechaUltimaConmocion = true;
      }
      if (datos.afeccionesMentales === 'Si' && !datos.especificacionAfeccionesMentales?.trim()) { falte = true; nuevosErrores.especificacionAfeccionesMentales = true; }

      setErrores(nuevosErrores);
      if (falte) { Swal.fire({ icon: 'error', title: 'Información Médica Incompleta', text: 'Responda todas las preguntas de salud.', confirmButtonColor: '#E00000' }); return false; }
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
  };

  const manejarSiguiente = (): void => { if (validarPaso()) setPaso(paso + 1); };
  const manejarAnterior = (): void => { if (paso === 1) onVolver(); else setPaso(paso - 1); };

  const finalizarInscripcion = (): void => {
    if (paso === 4) {
      if (!datos.terminosAceptados) {
        Swal.fire({ icon: 'error', title: 'Visualización Requerida', text: 'Debe marcar la casilla indicando que ha leído, entendido y aceptado el formulario legal.', confirmButtonColor: '#E00000' });
        setErrores(prev => ({ ...prev, terminosAceptados: true }));
        return;
      }
      
      const p4Req = esMenorDeEdad() ? ['firmaAtleta', 'fechaFirmaAtleta', 'firmaTutor', 'fechaFirmaTutor'] : ['firmaAtleta', 'fechaFirmaAtleta'];
      const nuevosErrores: Record<string, boolean> = {};
      let falte = false;
      p4Req.forEach(f => { if (!datos[f]?.toString().trim()) { nuevosErrores[f] = true; falte = true; } });
      if (falte) {
        setErrores(prev => ({ ...prev, ...nuevosErrores }));
        Swal.fire({ icon: 'error', title: 'Firmas Incompletas', text: 'Por favor complete todos los campos de firma requeridos.', confirmButtonColor: '#E00000' });
        return;
      }

      if (esMenorDeEdad() && !archivos.identificacionTutor) {
        Swal.fire({ icon: 'error', title: 'Documentación Faltante', text: 'Debe subir el Documento de Identidad del Padre / Tutor.', confirmButtonColor: '#E00000' });
        return;
      }
    }

    const resumenHTML = `<div style="text-align: left;"><p>Atleta: ${datos.nombre}</p><p>Disciplina: ${datos.disciplina}</p></div>`;
    Swal.fire({
      title: '¿Finalizar Inscripción?',
      html: resumenHTML, showCancelButton: true, confirmButtonText: 'Sí, Enviar', confirmButtonColor: '#E00000'
    }).then(async (res) => {
      if (res.isConfirmed) {
        Swal.fire({ title: 'Guardando...', didOpen: () => Swal.showLoading() });
        const sesion = JSON.parse(localStorage.getItem('usuarioSesion') || '{}') as Record<string, string>;
        const pass = Math.random().toString(36).slice(-8);
        const archivosNombres = {
          cedula_nombre: archivos.identificacion?.name || 'No adjuntado',
          consentimiento_nombre: archivos.certificado?.name || 'No adjuntado',
          exoneracion_nombre: archivos.identificacionTutor?.name || 'No adjuntado',
          foto_nombre: archivos.foto?.name || 'No adjuntado',
        };
        const entry = { 
          ...datos, 
          ...archivosNombres, 
          usuarioId: sesion.id || null,
          password: pass, 
          rol: 'atleta' as const, 
          fechaRegistro: new Date().toISOString(),
          status: 'PENDIENTE',
          statusColor: 'yellow',
          bgColor: 'bg-light-blue',
          name: datos.nombre,
          initials: (datos.nombre?.charAt(0) || '') + (datos.nombre?.split(' ')[1]?.charAt(0) || ''),
          time: 'Registrado ahora'
        };

        try {
          await ServicesAdmin.saveRegistroConDocumentos(entry, {
            cedula: archivos.identificacion,
            certificado: archivos.certificado,
            foto: archivos.foto,
            identificacion_tutor: archivos.identificacionTutor,
          });
          await emailjs.send('service_ttxcgou', 'template_2eklg8i', {
            to_email: datos.correoElectronico,
            to_name: datos.nombre,
            message: `Tus datos de postulación para el rol de Atleta han sido enviados correctamente. Un administrador revisará tu información pronto.\n\nPor favor, mantente atento a tu correo para la confirmación de aprobación. Una vez aprobado, podrás ver tu información deportiva y médica en tu perfil.\n\nDocumentos adjuntos:\n- Cédula: ${archivosNombres.cedula_nombre}\n- Certificado Médico: ${archivosNombres.consentimiento_nombre}\n- ID Tutor: ${archivosNombres.exoneracion_nombre}\n- Foto: ${archivosNombres.foto_nombre}`
          }, '4zWvRC7Yn7lUDqd1q');

          Swal.fire({ icon: 'success', title: '¡Enviado!', text: 'Tu solicitud ha sido enviada al administrador.' }).then(() => {
            window.location.href = '/';
          });
        } catch (error) {
          console.error("Error al guardar:", error);
          Swal.fire({ icon: 'error', title: 'Error al enviar', text: 'No se pudo enviar la solicitud. Intenta de nuevo.' });
        }
      }
    });
  };

  const porcentajeProgreso = paso * 25;

  return (
    <div className="form-atleta-layout">
      <header className="form-header">
        <div className="header-logo"><div className="logo-icon">🏆</div><h1>Olimpiadas Especiales CR</h1></div>
        <div className="header-actions"><div className="action-icon">🔔</div><div className="action-icon">👤</div></div>
      </header>

      <div className="form-body">
        <aside className="form-sidebar">
          <div className="sidebar-card"><div className="registro-info"><div className="registro-icon">👤</div><div className="registro-text"><h4>Registro</h4><p>NUEVO ATLETA</p></div></div></div>
          <nav className="sidebar-nav sidebar-card">
            {[{ id: 1, name: "1. Datos Personales", icon: "👤" }, { id: 2, name: "2. Info Médica", icon: "🏥" }, { id: 3, name: "3. Deporte", icon: "⚽" }, { id: 4, name: "4. Documentos", icon: "📄" }].map((step) => (
              <div key={step.id} className={`nav-item ${paso === step.id ? 'active' : ''}`}><span className="nav-icon">{step.icon}</span><span>{step.name}</span></div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="progress-label"><span>PROGRESO</span><span>{porcentajeProgreso}%</span></div>
            <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${porcentajeProgreso}%` }}></div></div>
          </div>
        </aside>

        <main className="form-content-area">
          <div className="content-header">
            {paso === 1 && (<><h2>Paso 1: Datos Personales</h2><p>Complete la información básica del atleta para iniciar el proceso.</p></>)}
            {paso === 2 && (<><h2>Paso 2: Información Médica</h2><p>Proporcione detalles sobre la salud y condiciones del atleta.</p></>)}
            {paso === 3 && (<><h2>Paso 3: Información Deportiva</h2><p>Seleccione la disciplina y nivel de habilidad del atleta.</p></>)}
            {paso === 4 && (<><h2>Paso 4: Documentación</h2><p>Adjunte los documentos requeridos para finalizar el registro.</p></>)}
          </div>

          <div className="content-body">
            {paso === 1 && (
              <div className="form-grid-ref">
                <div className='input-container'>
                  <label>Programa local de Olimpiadas Especiales:</label>
                  <select id='programa' className="input-field" value={datos.programa} onChange={manejarCambio}>
                    <option value="">Seleccione Programa...</option>
                    {catalogos.programas.map(p => <option key={String(p.id || p.nombre)} value={String(p.nombre)}>{String(p.nombre)}</option>)}
                  </select>
                </div>
                <div className="input-container"><label>Nombre Completo</label><input type="text" id='nombre' className={`input-field ${errores.nombre ? 'error-border' : ''}`} value={datos.nombre} onChange={manejarCambio} style={errores.nombre ? { borderColor: '#E00000' } : {}} /></div>
                <div className="input-container"><label>Cédula / Identificación</label><input type="text" id='cedula' className={`input-field ${errores.cedula ? 'error-border' : ''}`} value={datos.cedula} onChange={manejarCambio} style={errores.cedula ? { borderColor: '#E00000' } : {}} readOnly={!!datos.cedula} /></div>
                <div className="input-container"><label>Fecha de Nacimiento</label><DatePickerInput id='fechaNacimiento' name='fechaNacimiento' value={datos.fechaNacimiento} onChange={manejarCambio as any} hasError={!!errores.fechaNacimiento} readOnly={!!datos.fechaNacimiento} /></div>
                <div className="input-container"><label>Género</label><select id="genero" className={`input-field ${errores.genero ? 'error-border' : ''}`} value={datos.genero} onChange={manejarCambio} style={errores.genero ? { borderColor: '#E00000' } : {}}><option value="">Seleccione...</option><option value="NoDefinido">Prefiero no responder</option><option value="Masculino">Masculino</option><option value="Femenino">Femenino</option></select></div>
                <div className="input-container"><label>Teléfono de Contacto</label><input type="text" id='telefono' className={`input-field ${errores.telefono ? 'error-border' : ''}`} value={datos.telefono} onChange={manejarCambio} style={errores.telefono ? { borderColor: '#E00000' } : {}} /></div>
                <div className="input-container"><label>País</label><input type="text" id='pais' className={`input-field ${errores.pais ? 'error-border' : ''}`} value={datos.pais} onChange={manejarCambio} style={errores.pais ? { borderColor: '#E00000' } : {}} readOnly={!!datos.pais} /></div>
                <div className="input-container"><label>Correo Electrónico</label><input type="email" id='correoElectronico' className={`input-field ${errores.correoElectronico ? 'error-border' : ''}`} value={datos.correoElectronico} onChange={manejarCambio} style={errores.correoElectronico ? { borderColor: '#E00000' } : {}} readOnly={!!datos.correoElectronico} /></div>
                <div className="input-container" style={{ gridColumn: 'span 2' }}><label>Dirección Exacta</label><textarea id="direccion" className={`input-field ${errores.direccion ? 'error-border' : ''}`} style={errores.direccion ? { minHeight: '100px', borderColor: '#E00000' } : { minHeight: '100px' }} value={datos.direccion} onChange={manejarCambio}></textarea></div>
                
                <div style={{ gridColumn: 'span 2', marginTop: '20px' }}><div style={{ height: '1px', background: '#f1f5f9', margin: '30px 0' }}></div><h3 style={{fontSize: '18px', fontWeight: 700}}>Contacto de Emergencia</h3></div>
                <div className="input-container"><label>Nombre Contacto de Emergencia</label><input type="text" id='emergenciaNombre' className={`input-field ${errores.emergenciaNombre ? 'error-border' : ''}`} value={datos.emergenciaNombre} onChange={manejarCambio} style={errores.emergenciaNombre ? { borderColor: '#E00000' } : {}} /></div>
                <div className="input-container"><label>Teléfono de Emergencia</label><input type="text" id='emergenciaTelefono' className={`input-field ${errores.emergenciaTelefono ? 'error-border' : ''}`} value={datos.emergenciaTelefono} onChange={manejarCambio} style={errores.emergenciaTelefono ? { borderColor: '#E00000' } : {}} /></div>

                {esMenorDeEdad() && (
                  <div style={{ gridColumn: 'span 2', marginTop: '20px', background: '#fff5f5', padding: '25px', borderRadius: '15px', border: '1px solid #fecaca' }}>
                    <div style={{ marginBottom: '20px' }}><h3 style={{ fontSize: '18px', fontWeight: 700, color: '#E00000', margin: 0 }}>Información del Tutor / Encargado</h3><p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#64748b' }}>Requerido para atletas menores de edad</p></div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                      <div className="input-container" style={{ margin: 0 }}><label>Nombre del Tutor</label><input type="text" id='tutorNombre' className={`input-field ${errores.tutorNombre ? 'error-border' : ''}`} value={datos.tutorNombre} onChange={manejarCambio} style={errores.tutorNombre ? { background: 'white', borderColor: '#E00000' } : { background: 'white' }} /></div>
                      <div className="input-container" style={{ margin: 0 }}><label>Apellido del Tutor</label><input type="text" id='tutorApellido' className={`input-field ${errores.tutorApellido ? 'error-border' : ''}`} value={datos.tutorApellido} onChange={manejarCambio} style={errores.tutorApellido ? { background: 'white', borderColor: '#E00000' } : { background: 'white' }} /></div>
                      <div className="input-container" style={{ margin: 0 }}><label>Cédula / Identificación del Tutor</label><input type="text" id='tutorCedula' className={`input-field ${errores.tutorCedula ? 'error-border' : ''}`} value={datos.tutorCedula} onChange={manejarCambio} style={errores.tutorCedula ? { background: 'white', borderColor: '#E00000' } : { background: 'white' }} /></div>
                      <div className="input-container" style={{ margin: 0 }}><label>Relación con el Deportista</label><select id="tutorRelacion" className={`input-field ${errores.tutorRelacion ? 'error-border' : ''}`} value={datos.tutorRelacion} onChange={manejarCambio} style={errores.tutorRelacion ? { background: 'white', borderColor: '#E00000' } : { background: 'white' }}><option value="">Seleccione...</option><option value="Madre">Madre</option><option value="Padre">Padre</option><option value="Abuelo/a">Abuelo/a</option><option value="Hermano/a">Hermano/a</option><option value="Tutor Legal">Tutor Legal</option><option value="Otro">Otro</option></select></div>
                      <div className="input-container" style={{ margin: 0 }}><label>País</label><input type="text" id='tutorPais' className={`input-field ${errores.tutorPais ? 'error-border' : ''}`} value={datos.tutorPais} onChange={manejarCambio} style={errores.tutorPais ? { background: 'white', borderColor: '#E00000' } : { background: 'white' }} /></div>
                      <div className="input-container" style={{ margin: 0 }}><label>Correo Electrónico</label><input type="email" id='tutorCorreo' className={`input-field ${errores.tutorCorreo ? 'error-border' : ''}`} value={datos.tutorCorreo} onChange={manejarCambio} style={errores.tutorCorreo ? { background: 'white', borderColor: '#E00000' } : { background: 'white' }} /></div>
                      <div className="input-container" style={{ margin: 0 }}><label>Número de Teléfono</label><input type="text" id='tutorTelefono' className={`input-field ${errores.tutorTelefono ? 'error-border' : ''}`} value={datos.tutorTelefono} onChange={manejarCambio} style={errores.tutorTelefono ? { background: 'white', borderColor: '#E00000' } : { background: 'white' }} /></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {paso === 2 && (
              <div className="form-sections-modern">
                <div className="question-group" style={{marginBottom: '30px'}}>
                  <h3 style={{fontSize: '18px', fontWeight: 700, marginBottom: '20px'}}>Dispositivos de asistencia y adaptaciones</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    {[{ title: 'Movilidad', prop: 'dispositivosMovilidad', opts: ['Caminador', 'Aparatos ortopédicos o muletas', 'Silla de ruedas', 'Aparatos ortopédicos removibles', 'Prótesis', 'Ninguno'] },
                      { title: 'Ayudas para el estilo de vida', prop: 'ayudasEstiloVida', opts: ['CPAP', 'Dentadura postiza', 'Gafas/lentes de contacto', 'Ninguno'] },
                      { title: 'Comunicaciones', prop: 'comunicaciones', opts: ['Audífono', 'Dispositivos de comunicación', 'Lenguaje de señas', 'Ninguno'] },
                      { title: 'Dispositivos médicos', prop: 'dispositivosMedicos', opts: ['Desfibrilador cardioversor implantable', 'Dispositivo implantable para convulsiones', 'Derivación ventrículo peritoneal', 'Marcapasos', 'Ninguno'] }
                    ].map(group => (
                      <div key={group.title} style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px' }}>
                        <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#334155' }}>{group.title}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                          {group.opts.map(opt => (
                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#475569' }}>
                              <input type="checkbox" name={group.prop} value={opt} onChange={manejarCambioArreglo} checked={(datos[group.prop] as string[])?.includes(opt) || false} style={{ width: '16px', height: '16px', accentColor: '#E00000' }} />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ height: '1px', background: '#f1f5f9', margin: '30px 0' }}></div>
                <div className="question-group" style={{marginBottom: '30px'}}>
                  <label className="checkbox-label" style={{ cursor: 'pointer', padding: '15px', background: '#f8fafc', border: '1px dashed #e2e8f0', borderRadius: '15px', display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" onChange={manejarClickCondicion} checked={datos.condicionesMedicas?.length > 0} />
                    <span style={{ marginLeft: '12px', fontWeight: 600 }}>Registrar condiciones médicas específicas (Autismo, Down, etc. Obligatorio)</span>
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
                    { id: 'otrosDispositivos', label: 'Otros Dispositivos', desc: '¿Usa algún otro no listado arriba?' },
                    { id: 'afeccionCardiaca', label: 'Afección Cardíaca', desc: '¿Tiene problemas del corazón?' },
                    { id: 'asma', label: 'Asma', desc: '¿Padece de dificultades respiratorias?' },
                    { id: 'diabetes', label: 'Diabetes', desc: '¿Controla niveles de azúcar?' },
                    { id: 'discVisual', label: 'Discapacidad Visual', desc: '¿Problemas severos de visión?' },
                    { id: 'discAuditiva', label: 'Discapacidad Auditiva', desc: '¿Dificultad para escuchar?' },
                    { id: 'trastornoHemorragico', label: 'Trastorno Hemorrágico', desc: '¿Problemas de coagulación?' },
                    { id: 'medicoLimitoDeportes', label: 'Limitación Deportiva', desc: '¿Un médico ha limitado su actividad?' },
                    { id: 'epilepsiaConvulsivo', label: 'Epilepsia', desc: '¿Padece convulsiones?' },
                    { id: 'anemiaDepranocitica', label: 'Anemia Depranocítica', desc: '¿Células falciformes?' },
                    { id: 'conmocionCerebral', label: 'Conmoción Cerebral', desc: '¿Alguna vez ha tenido una conmoción cerebral?' },
                    { id: 'afeccionesMentales', label: 'Afecciones de Salud Mental / Conductuales', desc: '¿Tiene afecciones conductuales, de salud mental y/o sensoriales?' },
                    { id: 'alergiasGraves', label: 'Alergias Graves', desc: 'Medicamentos, látex, comida.' }
                  ].map((field) => (
                    <div key={field.id} className={`status-tile ${errores[field.id] ? 'error-border' : ''}`} style={errores[field.id] ? {borderColor: '#E00000'} : {}}>
                      <div className="status-info"><span className="status-label">{field.label}</span><span className="status-desc">{field.desc}</span></div>
                      <div className="switch-container">
                        <div className={`switch-option yes ${datos[field.id] === 'Si' ? 'active' : ''}`} onClick={() => manejarCambio({ target: { id: field.id, name: field.id, value: 'Si' } } as unknown as React.ChangeEvent<HTMLInputElement>)}>SÍ</div>
                        <div className={`switch-option no ${datos[field.id] === 'No' ? 'active' : ''}`} onClick={() => manejarCambio({ target: { id: field.id, name: field.id, value: 'No' } } as unknown as React.ChangeEvent<HTMLInputElement>)}>NO</div>
                      </div>
                    </div>
                  ))}
                  {datos.alergiasGraves === 'Si' && (
                    <div className="alergia-extra" style={{padding: '20px', background: '#fff1f2', borderRadius: '15px', marginTop: '10px'}}>
                      <label style={{color: '#E00000', fontWeight: 'bold', display: 'block', marginBottom: '15px'}}>Especifique si se trata de alguno de los siguientes:</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                        {['Picaduras de insectos', 'Medicamentos/drogas', 'Alimentos', 'Látex', 'Otros (especifique)'].map(opt => (
                          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#475569' }}>
                            <input type="checkbox" name="tiposAlergia" value={opt} onChange={manejarCambioArreglo} checked={datos.tiposAlergia?.includes(opt) || false} style={{ width: '16px', height: '16px', accentColor: '#E00000' }} />
                            <span style={errores.tiposAlergia ? {color: '#E00000'} : {}}>{opt}</span>
                          </label>
                        ))}
                      </div>
                      {datos.tiposAlergia?.includes('Otros (especifique)') && (
                        <div className="input-container" style={{margin: 0}}><input type="text" id="especificacionAlergiaOtro" className={`input-field ${errores.especificacionAlergiaOtro ? 'error-border' : ''}`} value={datos.especificacionAlergiaOtro || ''} onChange={manejarCambio} style={errores.especificacionAlergiaOtro ? {background: 'white', borderColor: '#E00000', marginTop: '5px'} : {background: 'white', marginTop: '5px'}} /></div>
                      )}
                    </div>
                  )}
                  {datos.reqDietetico === 'Si' && <div className="input-container" style={{padding: '20px', background: '#f8fafc', borderRadius: '15px', marginTop: '10px'}}><label style={{color: '#334155'}}>Especifique el requerimiento dietético:</label><input type="text" id="especificacionDietetico" className={`input-field ${errores.especificacionDietetico ? 'error-border' : ''}`} value={datos.especificacionDietetico || ''} onChange={manejarCambio} style={errores.especificacionDietetico ? {background: 'white', borderColor: '#E00000'} : {background: 'white'}} /></div>}
                  {datos.otrosDispositivos === 'Si' && <div className="input-container" style={{padding: '20px', background: '#f8fafc', borderRadius: '15px', marginTop: '10px'}}><label style={{color: '#334155'}}>Especifique otros dispositivos de asistencia:</label><input type="text" id="especificacionOtrosDispositivos" className={`input-field ${errores.especificacionOtrosDispositivos ? 'error-border' : ''}`} value={datos.especificacionOtrosDispositivos || ''} onChange={manejarCambio} style={errores.especificacionOtrosDispositivos ? {background: 'white', borderColor: '#E00000'} : {background: 'white'}} /></div>}
                  {datos.conmocionCerebral === 'Si' && (
                    <div style={{padding: '20px', background: '#f8fafc', borderRadius: '15px', marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                      <div className="input-container" style={{margin: 0}}><label style={{color: '#334155'}}>¿Cuántos a lo largo de su vida?</label><input type="number" id="cantidadConmociones" className={`input-field ${errores.cantidadConmociones ? 'error-border' : ''}`} value={datos.cantidadConmociones || ''} onChange={manejarCambio} style={errores.cantidadConmociones ? {background: 'white', borderColor: '#E00000'} : {background: 'white'}} /></div>
                      <div className="input-container" style={{margin: 0}}><label style={{color: '#334155'}}>Fecha de la última (mm/aaaa):</label><input type="text" id="fechaUltimaConmocion" className={`input-field ${errores.fechaUltimaConmocion ? 'error-border' : ''}`} value={datos.fechaUltimaConmocion || ''} onChange={manejarCambio} style={errores.fechaUltimaConmocion ? {background: 'white', borderColor: '#E00000'} : {background: 'white'}} /></div>
                    </div>
                  )}
                  {datos.afeccionesMentales === 'Si' && <div className="input-container" style={{padding: '20px', background: '#f8fafc', borderRadius: '15px', marginTop: '10px'}}><label style={{color: '#334155'}}>En caso afirmativo, especifique:</label><input type="text" id="especificacionAfeccionesMentales" className={`input-field ${errores.especificacionAfeccionesMentales ? 'error-border' : ''}`} value={datos.especificacionAfeccionesMentales || ''} onChange={manejarCambio} style={errores.especificacionAfeccionesMentales ? {background: 'white', borderColor: '#E00000'} : {background: 'white'}} /></div>}
                </div>

                <div style={{ height: '1px', background: '#f1f5f9', margin: '40px 0' }}></div>
                <div className="question-group" style={{background: '#f8fafc', padding: '25px', borderRadius: '20px'}}>
                  <div className="input-container">
                     <span style={{fontWeight: 700, marginBottom: '15px', fontSize: '16px', display: 'block'}}>¿Toma medicamentos de forma regular?</span>
                     <div className="pills-container" style={{display: 'flex', gap: '15px'}}>
                        <label className={`radio-label ${datos.tomaMedicamentos === 'Si' ? 'active' : ''}`} style={{cursor: 'pointer', padding: '10px 20px', borderRadius: '10px', background: datos.tomaMedicamentos === 'Si' ? '#E00000' : 'white', color: datos.tomaMedicamentos === 'Si' ? 'white' : '#64748b', border: '1px solid #e2e8f0'}}><input type="radio" name="tomaMedicamentos" value="Si" onChange={manejarCambio} checked={datos.tomaMedicamentos === 'Si'} style={{display: 'none'}} /> Sí</label>
                        <label className={`radio-label ${datos.tomaMedicamentos === 'No' ? 'active' : ''}`} style={{cursor: 'pointer', padding: '10px 20px', borderRadius: '10px', background: datos.tomaMedicamentos === 'No' ? '#E00000' : 'white', color: datos.tomaMedicamentos === 'No' ? 'white' : '#64748b', border: '1px solid #e2e8f0'}}><input type="radio" name="tomaMedicamentos" value="No" onChange={manejarCambio} checked={datos.tomaMedicamentos === 'No'} style={{display: 'none'}} /> No</label>
                     </div>
                  </div>
                  {datos.tomaMedicamentos === 'Si' && (
                    <div className="table-responsive" style={{marginTop: '25px'}}>
                      <table className="medicamentos-table" style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '15px', overflow: 'hidden'}}>
                        <thead><tr style={{background: '#f1f5f9'}}><th style={{padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: 800, color: '#475569'}}>NOMBRE MEDICAMENTO</th><th style={{padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: 800, color: '#475569'}}>DOSIS</th><th style={{padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: 800, color: '#475569'}}>FRECUENCIA</th><th style={{padding: '15px', textAlign: 'center', fontSize: '12px', fontWeight: 800, color: '#475569'}}>ACCIÓN</th></tr></thead>
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
                <div className="input-container"><label>Disciplina Deportiva Principal</label><select name="disciplina" className="input-field" value={datos.disciplina} onChange={manejarCambio}><option value="">Seleccione Disciplina...</option>{catalogos.disciplinas.map(d => <option key={String(d.id || d.nombre)} value={String(d.nombre)}>{String(d.nombre)}</option>)}</select></div>
                <div className="input-container"><label>Nivel de Habilidad</label><select name="nivelHabilidad" className="input-field" value={datos.nivelHabilidad} onChange={manejarCambio}><option value="">Seleccione Nivel...</option>{catalogos.niveles_habilidad.map(n => <option key={String(n.id || n.nombre)} value={String(n.nombre)}>{String(n.nombre)}</option>)}</select></div>
                <div className="input-container" style={{ gridColumn: 'span 2' }}><label>Relación con el atleta</label><select name="relacionAtleta" className="input-field" value={datos.relacionAtleta} onChange={manejarCambio}><option value="">Seleccione...</option><option value="El Atleta mismo">Soy el Atleta</option><option value="Padre/Madre">Padre/Madre</option><option value="Tutor Legal">Tutor Legal</option><option value="Otro">Otro</option></select></div>
              </div>
            )}

            {paso === 4 && (
              <div className="docs-grid" style={{display: 'flex', flexDirection: 'column', gap: '40px'}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '30px'}}>
                  <div className="zona-drop" onClick={() => document.getElementById('file-identificacion')?.click()}>
                    <div style={{fontSize: '32px', marginBottom: '10px'}}>📄</div><h4 style={{margin: '0 0 5px 0', fontSize: '16px'}}>Documento de Identidad</h4><p style={{margin: 0, fontSize: '13px', color: '#64748b'}}>Haga clic para subir PDF o Imagen</p>
                    <input id="file-identificacion" type="file" style={{ display: 'none' }} onChange={(e) => validarYGuardarArchivo(e.target.files?.[0] ?? null, 'identificacion')} />
                    {archivos.identificacion && <div className="archivo-adjunto" style={{marginTop: '15px', display: 'inline-block', padding: '5px 15px', background: '#f0fdf4', color: '#166534', borderRadius: '20px', fontSize: '12px', fontWeight: 600}}>✓ {archivos.identificacion.name}</div>}
                  </div>
                  <div className="zona-drop" onClick={() => document.getElementById('file-certificado')?.click()}>
                    <div style={{fontSize: '32px', marginBottom: '10px'}}>🏥</div><h4 style={{margin: '0 0 5px 0', fontSize: '16px'}}>Certificado Médico</h4><p style={{margin: 0, fontSize: '13px', color: '#64748b'}}>Documento oficial debidamente firmado</p>
                    <input id="file-certificado" type="file" style={{ display: 'none' }} onChange={(e) => { validarYGuardarArchivo(e.target.files?.[0] ?? null, 'certificado'); }} />
                    {archivos.certificado && (
                      <div style={{marginTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
                        <div className="archivo-adjunto" style={{display: 'inline-block', padding: '5px 15px', background: '#f0fdf4', color: '#166534', borderRadius: '20px', fontSize: '12px', fontWeight: 600}}>✓ {archivos.certificado.name}</div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); procesarCertificadoConIA(); }}
                          disabled={ocrCargando}
                          style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: ocrCargando ? '#f1f5f9' : '#E00000', color: ocrCargando ? '#94a3b8' : '#fff', fontWeight: 700, fontSize: '13px', cursor: ocrCargando ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease' }}
                        >
                          {ocrCargando
                            ? <><span style={{width:'14px',height:'14px',border:'2px solid #e2e8f0',borderTopColor:'#94a3b8',borderRadius:'50%',display:'inline-block'}} />Analizando certificado...</>
                            : '✨ Auto-completar con IA'
                          }
                        </button>
                      </div>
                    )}
                  </div>
                  {esMenorDeEdad() && (
                    <div className="zona-drop" onClick={() => document.getElementById('file-identificacion-tutor')?.click()} style={{ border: '2px dashed #fda4af', background: '#fff1f2' }}>
                      <div style={{fontSize: '32px', marginBottom: '10px'}}>👤</div><h4 style={{margin: '0 0 5px 0', fontSize: '16px', color: '#E00000'}}>ID del Padre / Tutor</h4><p style={{margin: 0, fontSize: '13px', color: '#64748b'}}>Requerido (PDF o Imagen)</p>
                      <input id="file-identificacion-tutor" type="file" style={{ display: 'none' }} onChange={(e) => validarYGuardarArchivo(e.target.files?.[0] ?? null, 'identificacionTutor')} />
                      {archivos.identificacionTutor && <div className="archivo-adjunto" style={{marginTop: '15px', display: 'inline-block', padding: '5px 15px', background: '#f0fdf4', color: '#166534', borderRadius: '20px', fontSize: '12px', fontWeight: 600}}>✓ {archivos.identificacionTutor.name}</div>}
                    </div>
                  )}
                </div>

                <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                    <h3 style={{fontSize: '18px', fontWeight: 700, color: '#E00000', margin: 0, textTransform: 'uppercase'}}>Exenciones, Liberaciones y Políticas</h3>
                    <button type="button" onClick={() => setDislexiaActivo(!dislexiaActivo)} style={{ padding: '8px 15px', background: dislexiaActivo ? '#E00000' : 'white', color: dislexiaActivo ? 'white' : '#475569', border: `1px solid ${dislexiaActivo ? '#E00000' : '#cbd5e1'}`, borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' }}>{dislexiaActivo ? '✔️ Modo Lectura Activado (Ubuntu)' : '👁️ Modo Lectura (Anti-Dislexia)'}</button>
                  </div>
                  
                  <div style={{ background: 'white', padding: '20px', borderRadius: '10px', height: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', fontSize: dislexiaActivo ? '15px' : '14px', color: '#475569', lineHeight: dislexiaActivo ? '1.8' : '1.6', fontFamily: dislexiaActivo ? '"Ubuntu", sans-serif' : 'inherit', letterSpacing: dislexiaActivo ? '0.5px' : 'normal', wordSpacing: dislexiaActivo ? '1px' : 'normal', transition: 'all 0.3s ease' }}>
                    <p style={{fontWeight: 700, marginBottom: '15px'}}>Por favor, lea la siguiente información y marque todas las casillas antes de firmar.</p>
                    <p>Estoy de acuerdo con lo siguiente:</p>
                    <ol style={{paddingLeft: '20px', marginBottom: '20px'}}>
                      <li style={{marginBottom: '10px'}}><strong>Capacidad de participación.</strong> Soy físicamente capaz de participar en las actividades de Olimpiadas Especiales y cumpliré con todas las reglas, requisitos y códigos de conducta aplicables.</li>
                      <li style={{marginBottom: '10px'}}><strong>Autorización uso de imagen.</strong> Doy permiso a Olimpiadas Especiales, Inc., a los comités organizadores de los juegos de Olimpiadas Especiales, a los programas acreditados por Olimpiadas Especiales (colectivamente "Olimpiadas Especiales"), así como a los auspiciadores y socios oficiales de Olimpiadas Especiales que tengan autorización de Olimpiadas Especiales, para usar mi imagen, foto, video, nombre, voz, palabras, información biográfica y material similar o relacionado (mi "imagen") para promover Olimpiadas Especiales y recaudar fondos para Olimpiadas Especiales. Entiendo que mi imagen puede ser utilizada en todo tipo de medios de comunicación en campañas locales o globales, incluidas las de los auspiciadores y socios de Olimpiadas Especiales, pero entiendo que mi imagen no se utilizará para respaldar productos o servicios comerciales. Entiendo que no seré compensado por el uso de mi imagen.</li>
                      <li style={{marginBottom: '10px'}}><strong>Atención de emergencia.</strong> Si no puedo, o mi tutor no está disponible, para dar mi consentimiento o tomar decisiones médicas en una emergencia, autorizo a Olimpiadas Especiales a buscar atención médica en mi nombre, a menos que marque una de estas casillas:
                        <div style={{ marginTop: '10px', marginBottom: '10px', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '8px', color: '#334155' }}><input type="checkbox" name="objecionTratamientoMedico" checked={datos.objecionTratamientoMedico} onChange={manejarCambioCheckbox} style={{ width: '16px', height: '16px', accentColor: '#E00000' }} />Tengo una objeción religiosa o de otro tipo para recibir tratamiento médico.</label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#334155' }}><input type="checkbox" name="objecionTransfusiones" checked={datos.objecionTransfusiones} onChange={manejarCambioCheckbox} style={{ width: '16px', height: '16px', accentColor: '#E00000' }} />No doy mi consentimiento para las transfusiones de sangre.</label>
                        </div>
                        (Si alguna de las casillas está marcada, se debe completar un FORMULARIO DE RECHAZO DE ATENCIÓN MÉDICA DE EMERGENCIA).
                      </li>
                      <li style={{marginBottom: '10px'}}><strong>Pernocte.</strong> Para algunos eventos, es posible que se requiera alojamiento durante la noche. Si tengo preguntas, me pondré en contacto con mi Programa de Olimpiadas Especiales.</li>
                      <li style={{marginBottom: '10px'}}><strong>Programas de Salud.</strong> Si participo en un programa de salud, doy mi consentimiento para las actividades de salud, las pruebas de detección y el tratamiento. Esto no debe reemplazar la atención médica regular. Tengo el derecho de rechazar el tratamiento de la programación de salud (que es diferente de la atención médica secundaria o de emergencia) en cualquier momento".</li>
                      <li style={{marginBottom: '10px'}}><strong>Información personal.</strong> Entiendo que Olimpiadas Especiales recopilará mi información personal como parte de mi participación, incluyendo mi nombre, imagen, dirección, número de teléfono, información de salud y otra información de identificación personal y relacionada con la salud que proporciono a Olimpiadas Especiales ("información personal").</li>
                    </ol>

                    <p>Estoy de acuerdo y doy mi consentimiento a Olimpiadas Especiales:</p>
                    <ul style={{paddingLeft: '20px', marginBottom: '20px', listStyleType: 'disc'}}>
                      <li style={{marginBottom: '8px'}}>usar mi información personal para: asegurarme de que soy elegible y puedo participar de manera segura; llevar a cabo capacitaciones y eventos; compartir los resultados de los concursos (incluso en la Web y en los medios de comunicación); proporcionar tratamiento de salud si participo en un programa de salud; analizar los datos con el fin de mejorar la programación e identificar y responder a las necesidades de los participantes de Olimpiadas Especiales; realizar operaciones informáticas, aseguramiento de la calidad, pruebas y otras actividades relacionadas; y proporcionar servicios relacionados con eventos.</li>
                      <li style={{marginBottom: '8px'}}>usar mi información de contacto para comunicarse conmigo acerca de Olimpiadas Especiales.</li>
                      <li style={{marginBottom: '8px'}}>compartir mi información personal de manera confidencial con (i) investigadores, como universidades y agencias de salud pública que estudian la discapacidad intelectual y el impacto de las actividades de Olimpiadas Especiales, (ii) profesionales médicos en una emergencia, y (iii) autoridades gubernamentales con el fin de ayudarme con las visas requeridas para viajes internacionales a eventos de Olimpiadas Especiales y para cualquier otro propósito necesario para proteger la seguridad pública, responder a las solicitudes del gobierno y reportar información según lo requiera la ley.</li>
                      <li style={{marginBottom: '8px'}}>Tengo derecho a solicitar ver mi información personal o a ser informado sobre la información personal que se procesa sobre mí. Tengo derecho a solicitar que se corrija y elimine mi información personal, y a restringir el procesamiento de mi información personal si es inconsistente con este consentimiento.</li>
                    </ul>

                    <p style={{marginBottom: '20px'}}><strong>Política de privacidad.</strong> La información personal puede usarse y compartirse de acuerdo con este formulario y como se explica con más detalle en la política de privacidad de Olimpiadas Especiales en <a href="http://www.SpecialOlympics.org/Privacy-Policy" target="_blank" rel="noopener noreferrer" style={{color: '#0066cc', textDecoration: 'underline'}}>www.SpecialOlympics.org/Privacy-Policy</a>.</p>
                    
                    <h4 style={{ color: '#E00000', marginTop: '30px', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>Síntomas de Compresión de la Médula Espinal E INESTABILIDAD ATLANTOAXIAL<br/><span style={{fontSize: '14px', textTransform: 'none'}}>(Solo para atletas con síndrome de Down)</span></h4>
                    <p style={{marginTop: '15px'}}>Si yo (o el atleta) hemos sido diagnosticados o hemos experimentado alguno de los siguientes síntomas que han aumentado en gravedad en los últimos tres años: dificultad para controlar los intestinos o la vejiga; entumecimiento u hormigueo en piernas, brazos, manos o pies; debilidad en brazos, piernas, manos o pies; quemadura/hincones/pinzamiento del nervio, dolor en el cuello, la espalda, de los hombros, los brazos, las manos, los glúteos, las piernas o los pies; espasticidad o parálisis: debo obtener una revisión y el permiso de un médico con licencia para que autorice a entrenar y / o participar en las actividades de Olimpiadas Especiales.</p>

                    <h4 style={{ color: '#E00000', marginTop: '30px', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>Renuncia y Liberación de Responsabilidad / Asunción de Riesgos / Indemnización</h4>
                    <p style={{marginTop: '15px'}}>En consideración a que se le permita participar de cualquier manera en las actividades de Olimpiadas Especiales, el abajo firmante reconoce, aprecia y acepta que:</p>
                    <ol style={{paddingLeft: '20px', marginBottom: '20px'}}>
                      <li style={{marginBottom: '10px'}}>Si bien las reglas particulares y la disciplina personal pueden reducir este riesgo, existe el riesgo de enfermedad (incluidas las enfermedades transmisibles), lesiones (incluida la conmoción cerebral), discapacidad y muerte;</li>
                      <li style={{marginBottom: '10px'}}>Si observo algún peligro inusual o significativo durante mi presencia o participación, me retiraré de la participación y lo pondré en conocimiento del representante de Olimpiadas Especiales más cercano de inmediato; y</li>
                      <li style={{marginBottom: '10px'}}><strong>Entiendo los riesgos que implica la participación en las actividades de Olimpiadas Especiales. Acepto y asumo plenamente todos los riesgos y toda la responsabilidad por pérdidas, costos y daños en los que pueda incurrir como resultado de mi participación. En la mayor medida de la ley, libero y acepto no demandar a ninguna organización de Olimpiadas Especiales, sus directores, agentes, voluntarios y empleados, otros participantes, agencias patrocinadoras, patrocinadores, anunciantes y, si corresponde, propietarios y arrendadores de instalaciones en las que se lleva a cabo cualquier actividad de Olimpiadas Especiales ("Exonerados") relacionados con cualquier responsabilidad, reclamo o pérdida en mi cuenta causada o presuntamente causada en su totalidad o en parte por los Exonerados, incluso si surgen de la negligencia de los Exonerados. He leído esta disposición de liberación de responsabilidad y asunción de riesgos, comprendo completamente sus términos, reconozco que he renunciado a derechos sustanciales al firmarla y la firmo libre y voluntariamente sin ningún incentivo. Además, acepto que si, a pesar de esta liberación, yo, o cualquier persona en mi nombre, presento una reclamación contra cualquiera de los Exonerados, indemnizaré y eximiré de responsabilidad a cada uno de los Exonerados de dichas responsabilidades, reclamaciones o pérdidas como resultado de dicha reclamación. Estoy de acuerdo en que si alguna parte de este formulario se considera inválida, las otras partes continuarán en pleno vigor y efecto.</strong></li>
                    </ol>
                  </div>

                  <div style={{ marginTop: '20px', padding: '15px', background: datos.terminosAceptados ? '#f0fdf4' : '#fff', border: `2px solid ${datos.terminosAceptados ? '#166534' : (errores.terminosAceptados ? '#E00000' : '#e2e8f0')}`, borderRadius: '10px', transition: 'border 0.3s' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', fontWeight: 600, color: datos.terminosAceptados ? '#166534' : '#334155' }}>
                      <input type="checkbox" name="terminosAceptados" checked={datos.terminosAceptados} onChange={manejarCambioCheckbox} style={{ width: '24px', height: '24px', accentColor: '#166534' }} />
                      He leído y entiendo este formulario. Al firmar, acepto este formulario.
                    </label>
                  </div>

                  <div style={{ marginTop: '30px', transition: 'all 0.4s ease', opacity: datos.terminosAceptados ? 1 : 0.4, pointerEvents: datos.terminosAceptados ? 'auto' : 'none', background: '#fff', border: '1px solid #e2e8f0', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '15px', borderBottom: '2px solid #f1f5f9' }}>
                      <label style={{fontWeight: 700, fontSize: '15px', color: '#0f172a', margin: 0}}>Nombre del atleta:</label>
                      <p style={{margin: 0, fontSize: '16px', color: '#475569', fontWeight: 600}}>{datos.nombre || '(Nombre pendiente)'}</p>
                    </div>

                    <div style={{ marginBottom: '35px' }}>
                      <h4 style={{fontSize: '16px', color: '#0f172a', margin: '0 0 5px 0', fontWeight: 800}}>FIRMA DEL ATLETA</h4>
                      <p style={{fontSize: '13px', color: '#64748b', margin: '0 0 15px 0'}}>(requerido para atletas adultos con capacidad para firmar documentos legales)</p>
                      <p style={{fontSize: '14px', color: '#334155', marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6'}}>He leído y entiendo este formulario. Si tengo preguntas, las haré. Al firmar, acepto este formulario.</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        <div className="input-container" style={{ margin: 0 }}><label style={{fontWeight: 600, color: '#0f172a'}}>Firma del atleta:</label><input type="text" name="firmaAtleta" className={`input-field ${errores.firmaAtleta ? 'error-border' : ''}`} placeholder="Digitar firma digital..." value={datos.firmaAtleta} onChange={manejarCambio} style={errores.firmaAtleta ? { borderColor: '#E00000', background: '#fff1f2' } : {}} /></div>
                        <div className="input-container" style={{ margin: 0 }}><label style={{fontWeight: 600, color: '#0f172a'}}>Fecha (dd/mm/aaaa):</label><DatePickerInput name='fechaFirmaAtleta' value={datos.fechaFirmaAtleta} disabled={true} /></div>
                      </div>
                    </div>

                    {esMenorDeEdad() && (
                      <div style={{ marginBottom: '20px', padding: '20px', background: '#fff5f5', borderRadius: '10px', border: '1px solid #fecaca' }}>
                        <h4 style={{fontSize: '16px', color: '#E00000', margin: '0 0 5px 0', fontWeight: 800}}>FIRMA DEL PADRE/TUTOR</h4>
                        <p style={{fontSize: '13px', color: '#64748b', margin: '0 0 15px 0'}}>(requerido para el atleta que es menor de edad o carece de capacidad para firmar documentos legales)</p>
                        <p style={{fontSize: '14px', color: '#334155', marginBottom: '20px', padding: '15px', background: '#fff', borderRadius: '8px', borderLeft: '4px solid #E00000'}}>Soy padre o tutor del atleta. He leído y entiendo este formulario y he explicado el contenido al atleta según corresponda. Al firmar, acepto este formulario en mi propio nombre y en nombre del atleta.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '15px' }}>
                          <div className="input-container" style={{ margin: 0 }}><label style={{fontWeight: 600, color: '#0f172a'}}>Firma del Padre/Tutor:</label><input type="text" name="firmaTutor" className={`input-field ${(errores.firmaTutor && esMenorDeEdad()) ? 'error-border' : ''}`} placeholder="Digitar firma..." value={datos.firmaTutor} onChange={manejarCambio} style={(errores.firmaTutor && esMenorDeEdad()) ? { borderColor: '#E00000', background: '#fff' } : { background: '#fff' }} /></div>
                          <div className="input-container" style={{ margin: 0 }}><label style={{fontWeight: 600, color: '#0f172a'}}>Fecha (dd/mm/aaaa):</label><DatePickerInput name='fechaFirmaTutor' value={datos.fechaFirmaTutor} disabled={true} /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                          <div className="input-container" style={{ margin: 0 }}><label style={{fontWeight: 600, color: '#0f172a'}}>Nombre en letra de imprenta:</label><input type="text" className="input-field" disabled={true} value={`${datos.tutorNombre || ''} ${datos.tutorApellido || ''}`.trim() || ''} style={{ background: '#f8fafc', fontWeight: 600, color: '#475569', cursor: 'not-allowed' }} placeholder="Autocompletado del Paso 1" /></div>
                          <div className="input-container" style={{ margin: 0 }}><label style={{fontWeight: 600, color: '#0f172a'}}>Relación:</label><input type="text" className="input-field" disabled={true} value={datos.tutorRelacion || ''} style={{ background: '#f8fafc', fontWeight: 600, color: '#475569', cursor: 'not-allowed' }} placeholder="Autocompletado del Paso 1" /></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '30px', background: '#f8fafc', padding: '25px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                    <div style={{textAlign: 'center', marginBottom: '20px'}}><h4 style={{ color: '#E00000', margin: '0 0 5px 0', fontSize: '16px', fontWeight: 800, textTransform: 'uppercase' }}>Evaluación e Investigación</h4><span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>(Opcional)</span></div>
                    <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px', lineHeight: '1.6', textAlign: 'center', maxWidth: '800px', margin: '0 auto 20px auto' }}>Olimpiadas Especiales quiere ayudar a nuestros atletas y sus familias a mantenerse sanos y felices. Es posible que participemos en estudios de investigación y compartiremos información para su posible participación. Todos los estudios serán revisados por el Director de Salud de Olimpiadas Especiales.</p>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                      <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: 600, margin: 0, textAlign: 'center' }}>¿A usted o a su familia les interesaría aprender sobre estudios de investigación?</p>
                      <div style={{ display: 'flex', gap: '40px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#334155', fontWeight: 600, padding: '10px 20px', background: datos.interesInvestigacion === 'Si' ? '#fff1f2' : '#f8fafc', borderRadius: '30px', border: `1px solid ${datos.interesInvestigacion === 'Si' ? '#fda4af' : '#e2e8f0'}`, transition: 'all 0.2s' }}><input type="radio" name="interesInvestigacion" value="Si" onChange={manejarCambio} checked={datos.interesInvestigacion === 'Si'} style={{ width: '18px', height: '18px', accentColor: '#E00000' }} /> Sí</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#334155', fontWeight: 600, padding: '10px 20px', background: datos.interesInvestigacion === 'No' ? '#fff1f2' : '#f8fafc', borderRadius: '30px', border: `1px solid ${datos.interesInvestigacion === 'No' ? '#fda4af' : '#e2e8f0'}`, transition: 'all 0.2s' }}><input type="radio" name="interesInvestigacion" value="No" onChange={manejarCambio} checked={datos.interesInvestigacion === 'No'} style={{ width: '18px', height: '18px', accentColor: '#E00000' }} /> No</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="form-footer">
            <button className="btn-cancelar-ref" onClick={manejarAnterior}>{paso === 1 ? 'Cancelar' : 'Paso Anterior'}</button>
            <div className="footer-actions">
              {paso < 4 ? <button className="btn-siguiente-ref" onClick={manejarSiguiente}>Siguiente Paso</button> : <button className="btn-siguiente-ref" onClick={finalizarInscripcion}>Finalizar Registro</button>}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default FormAtleta;
