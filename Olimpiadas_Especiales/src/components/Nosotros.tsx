import React, { useState, useEffect } from 'react';
import '../styles/Nosotros.css';

const Nosotros = (): React.JSX.Element => {
  const [historiaIndex, setHistoriaIndex] = useState(0);
  
  const historiaItems = [
    {
      img: '/img/Hero_contenedor_01.jpeg',
      title: 'El Milagro de la Transformación',
      text: '"Es a nivel local, aquí mismo, donde los voluntarios se reúnen con los atletas. Ahí es donde las percepciones empiezan a cambiar y se produce el milagro de la transformación."'
    },
    {
      img: '/img/Hero_contenedor_02.jpeg',
      title: 'Desde 1968',
      text: 'El número de personas con y sin discapacidad que participan ha ido en aumento. Nuestro compromiso de llegar a más personas crece día con día.'
    },
    {
      img: '/img/Hero_contenedor_03.jpeg',
      title: 'Entrenamiento Olímpico',
      text: 'Ofrecemos preparación deportiva constante en diversas disciplinas, brindando oportunidades para desarrollar aptitudes y demostrar valentía.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHistoriaIndex(prev => (prev + 1) % historiaItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [historiaItems.length]);

  return (
    <div className="nosotros_container">
      {/* HERO SECTION */}
      <section className="nosotros_hero">
        <div className="nosotros_hero_overlay"></div>
        <h1 className="nosotros_hero_title">¿Quiénes Somos?</h1>
      </section>

      {/* HISTORIA E IMPACTO */}
      <section className="section_historia">
        <div className="section_header">
            <span className="section_badge animate-fade-in-up">
              El Milagro de la Transformación
            </span>
            <h2 className="section_title animate-fade-in-up delay-100">
              Nuestra Historia y Compromiso
            </h2>
        </div>

        <div className="historia_carousel_container">
          {/* CAROUSEL HISTORIA */}
          <div className="tarjeta_info historia_carousel animate-fade-in-up delay-100">
            {historiaItems.map((item, idx) => (
                <div 
                    key={idx} 
                    className="carousel_item"
                    style={{
                        opacity: historiaIndex === idx ? 1 : 0,
                        backgroundImage: `url(${item.img})`,
                        pointerEvents: historiaIndex === idx ? 'auto' : 'none'
                    }}
                >
                    <div className="carousel_gradient" />
                    <div className="carousel_content">
                        <h3 className="carousel_title">{item.title}</h3>
                        <p className={`carousel_text ${idx === 0 ? 'italic' : ''}`}>
                            {item.text}
                        </p>
                    </div>
                </div>
            ))}
            
            {/* Controles del Carousel */}
            <div className="carousel_indicators">
                {historiaItems.map((_, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setHistoriaIndex(idx)}
                        className="carousel_dot"
                        style={{ 
                            width: historiaIndex === idx ? '40px' : '12px', 
                            background: historiaIndex === idx ? '#FF0000' : 'rgba(255,255,255,0.5)', 
                        }} 
                        aria-label={`Ir a la diapositiva ${idx + 1}`}
                    />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISION & VISION */}
      <section className="section_mision clase-culpable">
        <div className="mision_vision_grid">
          
          {/* MISION */}
          <div className="tarjeta_info info_card animate-fade-in-left delay-200">
            <div className="card_image" style={{ backgroundImage: "url('/img/atleta_down_1.png')" }} />
            
            <div className="card_body">
                <div className="card_icon_container icono-rotado" style={{ color: '#FF0000', background: '#fff0f0', transform: 'rotate(-5deg)' }}>
                    <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                    </svg>
                </div>
                <h4 className="card_title">Nuestra Misión</h4>
                <p className="card_text">
                Proporcionar entrenamiento deportivo y competición atlética durante todo el año en una variedad 
                de deportes olímpicos, ofreciendo oportunidades para desarrollar la condición física, demostrar 
                valentía y compartir talentos.
                </p>
            </div>
          </div>

          {/* VISION */}
          <div className="tarjeta_info info_card animate-fade-in-right delay-300">
            <div className="card_image" style={{ backgroundImage: "url('/img/evento_ceremonia.png')" }} />
            
            <div className="card_body">
                <div className="card_icon_container icono-rotado" style={{ color: '#3b82f6', background: '#eff6ff', transform: 'rotate(5deg)' }}>
                    <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </div>
                <h4 className="card_title">Nuestra Visión</h4>
                <p className="card_text">
                Transformar comunidades a través del deporte, fomentando un mundo donde cada persona sea 
                aceptada y acogida como un miembro valioso de la sociedad, eliminando barreras y promoviendo 
                la inclusión radical.
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* NUESTROS VALORES */}
      <section className="section_valores">
        <div className="section_header">
          <span className="section_badge animate-fade-in-up">Lo que nos define</span>
          <h2 className="section_title animate-fade-in-up delay-100">Nuestros Valores</h2>
        </div>
        <div className="valores_grid">

          <div className="valor_card animate-fade-in-up delay-100">
            <div className="valor_icon" style={{ background: '#fff0f0', color: '#FF0000' }}>
              <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h4 className="valor_title">Inclusión</h4>
            <p className="valor_text">Creemos que cada persona merece la oportunidad de participar, sin importar sus capacidades. La inclusión no es un privilegio, es un derecho.</p>
          </div>

          <div className="valor_card animate-fade-in-up delay-200">
            <div className="valor_icon" style={{ background: '#f0f9ff', color: '#0ea5e9' }}>
              <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
              </svg>
            </div>
            <h4 className="valor_title">Excelencia</h4>
            <p className="valor_text">Fomentamos el esfuerzo constante y la superación personal. Cada atleta es un campeón que da lo mejor de sí mismo cada día.</p>
          </div>

          <div className="valor_card animate-fade-in-up delay-300">
            <div className="valor_icon" style={{ background: '#f0fdf4', color: '#22c55e' }}>
              <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h4 className="valor_title">Comunidad</h4>
            <p className="valor_text">El deporte une. Construimos redes de apoyo entre atletas, familias, voluntarios y entrenadores que comparten el mismo sueño.</p>
          </div>

          <div className="valor_card animate-fade-in-up delay-400">
            <div className="valor_icon" style={{ background: '#fdf4ff', color: '#a855f7' }}>
              <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h4 className="valor_title">Respeto</h4>
            <p className="valor_text">Valoramos la dignidad de cada persona. Promovemos un ambiente de respeto mutuo donde todos se sientan bienvenidos y valorados.</p>
          </div>

        </div>
      </section>

      {/* DIGITAL PLATFORM */}
      <section className="section_plataforma">
        <div className="pulse-rojo platform_card">
          <svg className="platform_svg_bg" style={{ top: '-10%', left: '-5%', width: '400px', height: '400px' }} viewBox="0 0 24 24">
             <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          <svg className="platform_svg_bg" style={{ bottom: '-10%', right: '-5%', width: '300px', height: '300px' }} viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          
          <h2 className="platform_title">Nuestra Plataforma Digital</h2>
          <p className="platform_description">
            Este portal ha sido desarrollado con el propósito de fortalecer la conectividad entre nuestra 
            fundación y la comunidad. Buscamos optimizar la gestión de atletas, entrenadores, tutores y voluntarios, 
            garantizando que cada evento sea un éxito de inclusión y oportunidad para todos.
          </p>
        </div>
        </section>
    </div>
  );
};

export default Nosotros;
