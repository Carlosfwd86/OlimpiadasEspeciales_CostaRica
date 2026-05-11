import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Swal from 'sweetalert2';

interface RoleOption {
  id: string;
  icon: React.ReactNode;
  titulo: string;
  descripcion: string;
  color: string;
  bgColor: string;
}

const roles: RoleOption[] = [
  {
    id: 'atleta',
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
        <path d="M17 4l2 2-2 2"/>
      </svg>
    ),
    titulo: 'Atleta',
    descripcion: 'Inscríbete como atleta participante en los Juegos Olímpicos Especiales de Costa Rica.',
    color: '#FF0000',
    bgColor: '#FFF5F5',
  },
  {
    id: 'entrenador',
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    titulo: 'Entrenador',
    descripcion: 'Registrate para gestionar y orientar a los atletas en sus disciplinas deportivas.',
    color: '#1e40af',
    bgColor: '#eff6ff',
  },
  {
    id: 'tutor',
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    titulo: 'Tutor / Familiar',
    descripcion: 'Regístrate para acompañar y representar a un atleta bajo tu cuidado.',
    color: '#059669',
    bgColor: '#ecfdf5',
  },
  {
    id: 'voluntario',
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2"/>
        <path d="M12 2v12M9 5l3-3 3 3"/>
      </svg>
    ),
    titulo: 'Voluntario',
    descripcion: 'Únete a nuestro equipo de voluntarios y apoya la misión de Olimpiadas Especiales.',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
  }
];

interface StepOption {
  num: string;
  titulo: string;
  desc: string;
  icon: React.ReactNode;
}

const pasos: StepOption[] = [
  {
    num: '01',
    titulo: 'Escoge tu formulario',
    desc: 'Selecciona el formulario que corresponde a tu perfil: Atleta, Entrenador, Tutor o Voluntario.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    num: '02',
    titulo: 'Completa el formulario',
    desc: 'Llena la información personal, médica y deportiva de forma segura y detallada.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    num: '03',
    titulo: 'Adjunta documentos',
    desc: 'Sube los requisitos legales, certificaciones médicas y consentimientos necesarios.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
      </svg>
    ),
  },
];

function PlataformaRegistro(): React.JSX.Element {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [highlightFirstStep, setHighlightFirstStep] = useState<boolean>(false);
  const [usuarioSesion, setUsuarioSesion] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const sesion = localStorage.getItem('usuarioSesion');
    if (sesion) setUsuarioSesion(JSON.parse(sesion));
  }, []);

  const handleVerRequisitos = () => {
    Swal.fire({
      title: '<h4 style="color: #FF0000; font-weight: 900; margin: 0; letter-spacing: -1px;">REQUISITOS DE INSCRIPCIÓN</h4>',
      html: `
        <div style="text-align: left; padding: 10px 20px; font-family: 'Inter', sans-serif;">
          <p style="color: #64748b; margin-bottom: 20px; line-height: 1.7;">Asegúrese de tener listos los siguientes documentos antes de iniciar:</p>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${[
              ['Identificación Oficial','Cédula de identidad, DIMEX o partida de nacimiento.'],
              ['Edad Mínima','Atletas a partir de los 8 años de edad.'],
              ['Certificación Médica','Diagnóstico formal de discapacidad intelectual.'],
              ['Historial de Salud','Información sobre alergias o medicación actual.'],
              ['Fotografía','Imagen del rostro tipo carné, clara y reciente.'],
              ['Representación Legal','Firma de padre o tutor para menores de 18 años.'],
            ].map(([titulo, desc], i) => `
              <div style="display:flex; align-items:flex-start; gap:12px;">
                <div style="background:#FFF5F5; color:#FF0000; min-width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:13px; flex-shrink:0;">${i+1}</div>
                <div style="line-height:1.5;"><strong style="color:#1e293b;">${titulo}:</strong> <span style="color:#475569;">${desc}</span></div>
              </div>`).join('')}
          </div>
          <div style="margin-top: 24px; padding: 14px 16px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #FF0000;">
            <p style="margin:0; font-size:0.85rem; color:#64748b;"><strong>Nota:</strong> El formulario le solicitará adjuntar los documentos conforme avance.</p>
          </div>
        </div>`,
      confirmButtonText: 'ENTENDIDO',
      confirmButtonColor: '#FF0000',
      width: '560px',
      borderRadius: '20px',
      showCloseButton: true,
    } as any);
  };

  const handleRoleClick = (rolId: string) => {
    navigate(`/formulario?rol=${rolId}`);
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif", background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 60%, #ffe4e4 100%)',
        padding: '120px 24px 80px',
        textAlign: 'center',
        borderBottom: '1px solid #fee2e2',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', top: '-80px', right: '-80px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(255,0,0,0.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom: '-60px', left: '-60px', width:'220px', height:'220px', borderRadius:'50%', background:'rgba(255,0,0,0.05)', pointerEvents:'none' }} />

        {/* Botón Regresar */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '30px',
            left: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 20px',
            background: '#ffffff',
            border: '1px solid #FF0000',
            borderRadius: '12px',
            color: '#FF0000',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 10,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.color = '#1e293b';
            e.currentTarget.style.borderColor = '#1e293b';
            e.currentTarget.style.transform = 'translateX(-5px)';
            e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
            const svg = e.currentTarget.querySelector('svg');
            if (svg) svg.style.stroke = '#1e293b';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#FF0000';
            e.currentTarget.style.borderColor = '#FF0000';
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = 'none';
            const svg = e.currentTarget.querySelector('svg');
            if (svg) svg.style.stroke = '#FF0000';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ stroke: '#FF0000', transition: 'stroke 0.3s ease' }}>
            <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Regresar
        </button>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#fff', border: '1.5px solid #fee2e2', borderRadius: '50px',
          padding: '8px 20px', marginBottom: '28px',
          fontSize: '0.8rem', fontWeight: 700, color: '#FF0000', letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#FF0000', display:'inline-block', animation:'pulse 1.5s infinite' }} />
          Inscripciones Abiertas 2026
        </div>

        <h1 style={{
          fontSize: 'clamp(2.8rem, 6vw, 5rem)',
          fontWeight: 950,
          color: '#0f172a',
          margin: '0 auto',
          letterSpacing: '-3px',
          lineHeight: 1,
          maxWidth: '800px',
        }}>
          Plataforma de<br />
          <span style={{ color: '#FF0000' }}>Registro Oficial</span>
        </h1>

        <p style={{
          color: '#64748b', marginTop: '28px', fontSize: '1.2rem',
          maxWidth: '620px', margin: '24px auto 0', lineHeight: 1.8, fontWeight: 500,
        }}>
          Completa tu inscripción de forma segura. Elige tu rol y sigue el proceso guiado.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '44px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              if (usuarioSesion) {
                document.getElementById('roles-section')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                document.getElementById('pasos-section')?.scrollIntoView({ behavior: 'smooth' });
                setHighlightFirstStep(true);
              }
            }}
            style={{
              padding: '16px 40px', background: '#FF0000', color: '#fff',
              border: 'none', borderRadius: '16px', fontSize: '1rem', fontWeight: 800,
              cursor: 'pointer', boxShadow: '0 12px 24px rgba(255,0,0,0.25)',
              transition: 'all 0.2s ease', letterSpacing: '0.02em',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(255,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(255,0,0,0.25)'; }}
          >
            {usuarioSesion ? 'Explorar Roles' : 'Comenzar Registro'}
          </button>

          {!usuarioSesion && (
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '16px 40px', background: '#ffffff', color: '#0f172a',
                border: '1.5px solid #e2e8f0', borderRadius: '16px', fontSize: '1rem', fontWeight: 800,
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              Ya tengo cuenta
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
          <button
            onClick={handleVerRequisitos}
            style={{
              padding: '16px 40px', background: '#fff', color: '#1e293b',
              border: '2px solid #e2e8f0', borderRadius: '16px', fontSize: '1rem', fontWeight: 800,
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF0000'; e.currentTarget.style.color = '#FF0000'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#1e293b'; }}
          >
            Ver Requisitos
          </button>
        </div>
      </section>


      {/* PASOS */}
      <section id="pasos-section" style={{ padding: '90px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ color: '#FF0000', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', marginBottom: '12px' }}>Proceso de Inscripción</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1.5px' }}>Pasos para el Registro</h2>
          </div>
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '28px' }}
          >
            {pasos.map((paso, i) => {
              const isTarget = highlightFirstStep && i === 0;
              const isDimmed = highlightFirstStep && i !== 0;
              const isStep1Done = i === 0 && usuarioSesion;

              return (
              <div key={i} style={{
                background: '#f8fafc', borderRadius: '24px', padding: '32px 28px',
                border: `1px solid ${isTarget ? '#FF0000' : (isStep1Done ? '#22c55e' : '#f1f5f9')}`, position: 'relative', overflow: 'hidden',
                transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1.1)',
                cursor: (i === 0 && !usuarioSesion) ? 'pointer' : 'default',
                transform: isTarget ? 'translateY(-15px) translateX(-10px) scale(1.06)' : (isDimmed ? 'translateX(120px) translateY(20px) scale(0.85)' : 'none'),
                boxShadow: isTarget ? '0 35px 70px rgba(255,0,0,0.25)' : 'none',
                opacity: isDimmed ? 0.15 : 1,
                zIndex: isTarget ? 10 : 1,
                pointerEvents: isDimmed ? 'none' : 'auto'
              }}
                onClick={() => { if (i === 0 && !usuarioSesion) navigate('/registro'); }}
                onMouseEnter={e => {
                  if (highlightFirstStep || isStep1Done) return;
                  e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(255,0,0,0.08)'; e.currentTarget.style.borderColor = '#fecaca';
                }}
                onMouseLeave={e => {
                  if (highlightFirstStep || isStep1Done) return;
                  e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f1f5f9';
                }}
              >
                <div style={{
                  position: 'absolute', top: '16px', right: '20px',
                  fontSize: isStep1Done ? '2.5rem' : '3.5rem',
                  fontWeight: 900,
                  color: isStep1Done ? '#dcfce7' : '#fee2e2',
                  lineHeight: 1,
                }}>
                  {isStep1Done ? <i className="fa-solid fa-check"></i> : paso.num}
                </div>
                <div style={{
                  width: '52px', height: '52px', background: isStep1Done ? '#f0fdf4' : '#fff1f2', borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isStep1Done ? '#22c55e' : '#FF0000', marginBottom: '24px',
                  boxShadow: isStep1Done ? '0 8px 16px rgba(34,197,94,0.1)' : '0 8px 16px rgba(255,0,0,0.06)',
                }}>
                  {paso.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                  {isStep1Done ? 'Sesión Iniciada' : paso.titulo}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                  {isStep1Done ? 'Ya tienes una cuenta activa. Continúa eligiendo tu rol abajo.' : paso.desc}
                </p>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      {/* ROLES - SELECTOR */}
      <section id="roles-section" style={{ padding: '90px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ color: '#FF0000', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', marginBottom: '12px' }}>Selecciona tu Rol</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1.5px' }}>¿Cómo participas?</h2>
            <p style={{ color: '#64748b', marginTop: '16px', fontSize: '1.05rem', maxWidth: '520px', margin: '16px auto 0', lineHeight: 1.7 }}>
              Elige el formulario que corresponde a tu tipo de participación en el programa.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {roles.map((rol) => (
              <button
                key={rol.id}
                onClick={() => handleRoleClick(rol.id)}
                onMouseEnter={() => setHoveredRole(rol.id)}
                onMouseLeave={() => setHoveredRole(null)}
                style={{
                  background: hoveredRole === rol.id ? '#ffffff' : '#ffffff',
                  border: `2px solid ${hoveredRole === rol.id ? rol.color : '#f1f5f9'}`,
                  borderRadius: '24px', padding: '40px 28px', cursor: 'pointer',
                  textAlign: 'left', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transform: hoveredRole === rol.id ? 'translateY(-10px)' : 'none',
                  boxShadow: hoveredRole === rol.id ? `0 24px 48px -12px ${rol.color}30` : '0 4px 12px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{
                  width: '68px', height: '68px', borderRadius: '20px',
                  background: hoveredRole === rol.id ? rol.color : rol.bgColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '24px', color: hoveredRole === rol.id ? '#fff' : rol.color,
                  transition: 'all 0.3s ease',
                  transform: hoveredRole === rol.id ? 'rotate(8deg) scale(1.08)' : 'none',
                }}>
                  {rol.icon}
                </div>
                <h3 style={{
                  fontSize: '1.35rem', fontWeight: 800,
                  color: hoveredRole === rol.id ? rol.color : '#0f172a',
                  marginBottom: '12px', transition: 'color 0.3s ease',
                }}>{rol.titulo}</h3>
                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>{rol.descripcion}</p>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px', marginTop: '24px',
                  color: rol.color, fontWeight: 700, fontSize: '0.9rem',
                  opacity: hoveredRole === rol.id ? 1 : 0.6, transition: 'opacity 0.3s ease',
                }}>
                  Iniciar Formulario
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>


      <Footer />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

export default PlataformaRegistro;
