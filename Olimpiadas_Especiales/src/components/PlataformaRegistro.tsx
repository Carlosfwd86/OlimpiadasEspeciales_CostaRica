import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Swal from 'sweetalert2';

function PlataformaRegistro(): React.JSX.Element {
  const navigate = useNavigate();
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
              navigate('/registro');
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
            Comenzar Registro
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
