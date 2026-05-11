import React from 'react';
import '../styles/Nosotros.css';

const Nosotros = (): React.JSX.Element => {
  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif", background: '#f8fafc', overflow: 'hidden' }}>
      {/* HERO SECTION */}
      <section style={{
        height: '350px',
        backgroundImage: "url('/src/img/fotoNosotros.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly darker overlay for better text readability
        }}></div>

        <h1 style={{
          position: 'relative',
          zIndex: 1,
          color: '#ffffff',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textShadow: '2px 2px 15px rgba(0,0,0,0.8)',
          margin: 0,
          textAlign: 'center'
        }}>
          ¿Quiénes Somos?
        </h1>
      </section>

      {/* HIGHLIGHT & INTRO */}
      <section style={{ padding: '80px 24px', background: '#ffffff', position: 'relative' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{
            background: '#fff1f2',
            borderLeft: '6px solid #FF0000',
            padding: '40px',
            borderRadius: '0 24px 24px 0',
            boxShadow: '0 12px 30px rgba(255,0,0,0.05)',
            marginBottom: '60px',
            position: 'relative',
            overflow: 'hidden'
          }} className="hover-card">
            <svg style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.05, width: '120px', height: '120px', color: '#FF0000' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.714 4.026-6.695 4.993-6.799V3c-2.823-.001-5.64 1.251-6.86 4.148C10.963 4.251 8.147 3 5.324 3v3.81c.966.104 4.993 1.085 4.993 6.799V21h3.7z"/>
            </svg>
            <p style={{ fontSize: '1.4rem', color: '#FF0000', fontWeight: '700', fontStyle: 'italic', lineHeight: '1.6', margin: 0, position: 'relative', zIndex: 1 }}>
              "Es a nivel local, aquí mismo, donde los voluntarios interesados se reúnen con los atletas. Ahí es donde las 
              percepciones empiezan a cambiar y donde se produce el milagro de la transformación."
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: '1.8', margin: 0 }}>
              Desde su fundación en 1968, el número de personas con y sin discapacidad intelectual que participan en la organización 
              ha ido en aumento. Sin embargo, sabemos que la necesidad insatisfecha de llegar a más personas es abrumadora y 
              nuestro compromiso crece día con día.
            </p>
            <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: '1.8', margin: 0 }}>
              Ofrecemos entrenamiento deportivo y competencia atlética durante todo el año en diversas 
              disciplinas olímpicas. Brindamos oportunidades continuas para desarrollar aptitudes, demostrar valentía, experimentar la 
              alegría y compartir dones y habilidades.
            </p>
          </div>
        </div>
      </section>

      {/* MISION & VISION CARDS */}
      <section style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          
          {/* MISION */}
          <div className="hover-card" style={{
            background: '#ffffff', borderRadius: '30px', padding: '50px 40px',
            border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <div style={{
              width: '70px', height: '70px', background: '#fff1f2', borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FF0000', marginBottom: '30px', transform: 'rotate(-5deg)'
            }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', marginBottom: '20px', letterSpacing: '-1px' }}>
              Nuestra Misión
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.7', margin: 0 }}>
              Proporcionar entrenamiento deportivo y competición atlética durante todo el año en una variedad 
              de deportes olímpicos, ofreciéndoles oportunidades para desarrollar su condición física, demostrar 
              valentía y compartir sus talentos.
            </p>
          </div>

          {/* VISION */}
          <div className="hover-card" style={{
            background: '#ffffff', borderRadius: '30px', padding: '50px 40px',
            border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <div style={{
              width: '70px', height: '70px', background: '#eff6ff', borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#3b82f6', marginBottom: '30px', transform: 'rotate(5deg)'
            }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', marginBottom: '20px', letterSpacing: '-1px' }}>
              Nuestra Visión
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.7', margin: 0 }}>
              Transformar comunidades a través del deporte, fomentando un mundo donde cada persona sea 
              aceptada y acogida como un miembro valioso de la sociedad, eliminando barreras y promoviendo 
              la inclusión radical.
            </p>
          </div>

        </div>
      </section>

      {/* DIGITAL PLATFORM */}
      <section style={{ padding: '80px 24px', background: '#ffffff' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg, #FF0000 0%, #cc0000 100%)',
          borderRadius: '40px', padding: '70px 40px', color: '#fff', textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(255,0,0,0.3)', position: 'relative', overflow: 'hidden'
        }} className="scale-up-card">
          <svg style={{ position: 'absolute', top: '-10%', left: '-5%', opacity: 0.1, width: '400px', height: '400px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
          <svg style={{ position: 'absolute', bottom: '-10%', right: '-5%', opacity: 0.1, width: '300px', height: '300px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', marginBottom: '24px', letterSpacing: '-1px', position: 'relative', zIndex: 1 }}>
            Nuestra Plataforma Digital
          </h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.7', opacity: 0.95, maxWidth: '750px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            Este portal oficial ha sido desarrollado con el firme propósito de fortalecer la conectividad entre nuestra 
            fundación y la comunidad. Buscamos optimizar la gestión de atletas, entrenadores, tutores y voluntarios, 
            garantizando que cada evento sea una oportunidad de inclusión y éxito para todos.
          </p>
        </div>
      </section>



      <style>{`
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06) !important;
          border-color: #fca5a5 !important;
        }
        .scale-up-card {
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .scale-up-card:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default Nosotros;
