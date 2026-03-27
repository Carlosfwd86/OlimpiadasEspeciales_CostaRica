import React from 'react'
import PlataformaRegistro from '../components/PlataformaRegistro'

function PlataformaRegistroPage() {
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
            fontWeight: '700',
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
            e.currentTarget.querySelector('svg').style.stroke = '#1e293b';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#FF0000';
            e.currentTarget.style.borderColor = '#FF0000';
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.querySelector('svg').style.stroke = '#FF0000';
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
          fontSize: '0.8rem', fontWeight: '700', color: '#FF0000', letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#FF0000', display:'inline-block', animation:'pulse 1.5s infinite' }} />
          Inscripciones Abiertas 2026
        </div>

        <h1 style={{
          fontSize: 'clamp(2.8rem, 6vw, 5rem)',
          fontWeight: '950',
          color: '#0f172a',
          margin: '0 auto',
          letterSpacing: '-3px',
          lineHeight: '1',
          maxWidth: '800px',
        }}>
          Plataforma de<br />
          <span style={{ color: '#FF0000' }}>Registro Oficial</span>
        </h1>

        <p style={{
          color: '#64748b', marginTop: '28px', fontSize: '1.2rem',
          maxWidth: '620px', margin: '24px auto 0', lineHeight: '1.8', fontWeight: '500',
        }}>
          Completa tu inscripción de forma segura. Elige tu rol y sigue el proceso guiado.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '44px', flexWrap: 'wrap' }}>
          <button
            onClick={() => document.getElementById('roles-section').scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '16px 40px', background: '#FF0000', color: '#fff',
              border: 'none', borderRadius: '16px', fontSize: '1rem', fontWeight: '800',
              cursor: 'pointer', boxShadow: '0 12px 24px rgba(255,0,0,0.25)',
              transition: 'all 0.2s ease', letterSpacing: '0.02em',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(255,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(255,0,0,0.25)'; }}
          >
            Comenzar Registro
          </button>
          <button
            onClick={handleVerRequisitos}
            style={{
              padding: '16px 40px', background: '#fff', color: '#1e293b',
              border: '2px solid #e2e8f0', borderRadius: '16px', fontSize: '1rem', fontWeight: '800',
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
      <section style={{ padding: '90px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ color: '#FF0000', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', marginBottom: '12px' }}>Proceso de Inscripción</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-1.5px' }}>Pasos para el Registro</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '28px' }}>
            {pasos.map((paso, i) => (
              <div key={i} style={{
                background: '#f8fafc', borderRadius: '24px', padding: '32px 28px',
                border: '1px solid #f1f5f9', position: 'relative', overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(255,0,0,0.08)'; e.currentTarget.style.borderColor = '#fecaca'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
              >
                <div style={{
                  position: 'absolute', top: '16px', right: '20px',
                  fontSize: '3.5rem', fontWeight: '900', color: '#fee2e2', lineHeight: 1,
                }}>{paso.num}</div>
                <div style={{
                  width: '52px', height: '52px', background: '#fff1f2', borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#FF0000',
                }}>{paso.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>{paso.titulo}</h3>
                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>{paso.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ROLES - SELECTOR */}
      <section id="roles-section" style={{ padding: '90px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ color: '#FF0000', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', marginBottom: '12px' }}>Selecciona tu Rol</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-1.5px' }}>¿Cómo participas?</h2>
            <p style={{ color: '#64748b', marginTop: '16px', fontSize: '1.05rem', maxWidth: '520px', margin: '16px auto 0', lineHeight: '1.7' }}>
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
                  fontSize: '1.35rem', fontWeight: '800',
                  color: hoveredRole === rol.id ? rol.color : '#0f172a',
                  marginBottom: '12px', transition: 'color 0.3s ease',
                }}>{rol.titulo}</h3>
                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>{rol.descripcion}</p>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px', marginTop: '24px',
                  color: rol.color, fontWeight: '700', fontSize: '0.9rem',
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
  )
}


export default PlataformaRegistroPage