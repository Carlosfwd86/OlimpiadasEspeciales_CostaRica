import React, { useState, useEffect } from 'react';
import '../styles/Programas.css';

interface Programa {
    id: string;
    nombre: string;
    img?: string;
    imagen?: string;
    categoria?: string;
    deporte?: string;
    resumen?: string;
    descripcion?: string;
    fecha: string;
    status?: string;
    [key: string]: unknown;
}

const programasMock: Programa[] = [
    {
        id: '1',
        nombre: 'Atletismo Adaptado Costa Rica',
        categoria: 'Atletismo',
        resumen: 'Programa de entrenamiento en pista y campo para atletas con discapacidad intelectual. Incluye carreras de velocidad, salto de longitud y lanzamiento de jabalina adaptado.',
        fecha: 'Enero – Diciembre 2025',
        status: 'ACTIVO',
        img: '/img/Hero_contenedor_01.jpeg',
    },
    {
        id: '2',
        nombre: 'Natación para Campeones',
        categoria: 'Natación',
        resumen: 'Entrenamiento acuático integral en piscinas olímpicas con metodología inclusiva. Desarrolla técnica, resistencia y confianza en nuestros deportistas.',
        fecha: 'Febrero – Noviembre 2025',
        status: 'ACTIVO',
        img: '/img/Hero_contenedor_02.jpeg',
    },
    {
        id: '3',
        nombre: 'Baloncesto Unificado',
        categoria: 'Baloncesto',
        resumen: 'Equipos mixtos donde atletas con y sin discapacidad intelectual juegan juntos. Promueve la inclusión social y el compañerismo en la cancha.',
        fecha: 'Marzo – Octubre 2025',
        status: 'ACTIVO',
        img: '/img/Hero_contenedor_03.jpeg',
    },
    {
        id: '4',
        nombre: 'Juegos Mundiales Berlín 2023 – Legado',
        categoria: 'Internacional',
        resumen: 'Programa de seguimiento y reintegración para los atletas que representaron a Costa Rica en los Juegos Mundiales de Olimpiadas Especiales, Berlín 2023.',
        fecha: 'Continuo 2025',
        status: 'LEGADO',
        img: '/img/Hero_contenedor_04.jpeg',
    },
    {
        id: '5',
        nombre: 'Fútbol Inclusivo',
        categoria: 'Fútbol',
        resumen: 'Liga de fútbol adaptado con categorías juvenil y adulto. Partidos semanales, torneos regionales y participación en eventos nacionales de Olimpiadas Especiales.',
        fecha: 'Enero – Diciembre 2025',
        status: 'ACTIVO',
        img: '/img/Hero_contenedor_01.jpeg',
    },
    {
        id: '6',
        nombre: 'Gimnasia Rítmica Especial',
        categoria: 'Gimnasia',
        resumen: 'Programa artístico-deportivo enfocado en coordinación, expresión corporal y desarrollo psicomotriz. Presentaciones en eventos culturales y competencias nacionales.',
        fecha: 'Abril – Noviembre 2025',
        status: 'PRÓXIMO',
        img: '/img/Hero_contenedor_02.jpeg',
    },
    {
        id: '7',
        nombre: 'Bochas Unificadas',
        categoria: 'Atletismo',
        resumen: 'Desarrolla habilidades de precisión táctica e integración grupal en la disciplina de bochas. Práctica semanal abierta para todas las edades.',
        fecha: 'Mayo – Diciembre 2025',
        status: 'ACTIVO',
        img: '/img/Hero_contenedor_03.jpeg',
    },
    {
        id: '8',
        nombre: 'Tenis de Mesa Inclusivo',
        categoria: 'Internacional',
        resumen: 'Desarrolla agilidad mental, reflejos rápidos y una gran concentración a través de competencias y entrenamientos constantes de tenis de mesa.',
        fecha: 'Julio – Diciembre 2025',
        status: 'PRÓXIMO',
        img: '/img/Hero_contenedor_04.jpeg',
    },
    {
        id: '9',
        nombre: 'Ciclismo de Ruta Especial',
        categoria: 'Fútbol',
        resumen: 'Programa enfocado en ciclismo de ruta y entrenamientos al aire libre, fomentando la resistencia y la superación en pistas controladas.',
        fecha: 'Enero – Diciembre 2025',
        status: 'ACTIVO',
        img: '/img/Hero_contenedor_01.jpeg',
    },
    {
        id: '10',
        nombre: 'Juegos Mundiales Abu Dabi 2019 – Legado',
        categoria: 'Internacional',
        resumen: 'Reconocimiento y actividades en honor a la delegación costarricense que triunfó en los Juegos Mundiales de Olimpiadas Especiales en Abu Dabi 2019.',
        fecha: 'Continuo 2025',
        status: 'LEGADO',
        img: '/img/Hero_contenedor_02.jpeg',
    },
    {
        id: '11',
        nombre: 'Liderazgo de Atletas',
        categoria: 'Gimnasia',
        resumen: 'Talleres de capacitación para que nuestros atletas se conviertan en portavoces del cambio social y embajadores activos de Olimpiadas Especiales.',
        fecha: 'Febrero – Noviembre 2025',
        status: 'ACTIVO',
        img: '/img/Hero_contenedor_03.jpeg',
    },
    {
        id: '12',
        nombre: 'Atletas Jóvenes (Young Athletes)',
        categoria: 'Natación',
        resumen: 'Programa de juego y actividades físicas tempranas enfocado en el desarrollo psicomotriz de niños de entre 2 y 7 años con discapacidad intelectual.',
        fecha: 'Agosto – Diciembre 2025',
        status: 'PRÓXIMO',
        img: '/img/Hero_contenedor_04.jpeg',
    },
];

const categoryIcons: Record<string, string> = {
    'Atletismo': '🏃',
    'Natación': '🏊',
    'Baloncesto': '🏀',
    'Internacional': '🌍',
    'Fútbol': '⚽',
    'Gimnasia': '🤸',
};

const Programas = (): React.JSX.Element => {
    const [programas, setProgramas] = useState<Programa[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [animVisible, setAnimVisible] = useState<boolean>(false);

    // Carrusel states
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [visibleCards, setVisibleCards] = useState<number>(3);
    const [isPaused, setIsPaused] = useState<boolean>(false);

    useEffect(() => {
        const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
        fetch(`${BACKEND_URL}/competiciones`)
            .then(res => res.json())
            .then((json: unknown) => {
                const raw = (json && typeof json === 'object' && 'data' in (json as object))
                    ? (json as { data: Programa[] }).data
                    : json as Programa[];
                if (Array.isArray(raw) && raw.length > 0) {
                    // Normalizar estados (p. ej., PROGRAMADO -> PRÓXIMO)
                    const normalized = raw.map(p => {
                        let normalizedStatus = (p.status || 'ACTIVO').toUpperCase();
                        if (normalizedStatus === 'PROGRAMADO') {
                            normalizedStatus = 'PRÓXIMO';
                        }
                        return {
                            ...p,
                            status: normalizedStatus
                        };
                    });
                    
                    // Combinar elementos de la base de datos con los mocks para asegurar volumen y ver el carrusel en acción
                    const dbNames = new Set(normalized.map(p => p.nombre.toLowerCase().trim()));
                    const filteredMock = programasMock.filter(m => !dbNames.has(m.nombre.toLowerCase().trim()));
                    setProgramas([...normalized, ...filteredMock]);
                } else {
                    setProgramas(programasMock);
                }
                setCargando(false);
            })
            .catch(() => {
                setProgramas(programasMock);
                setCargando(false);
            });

        const timer = setTimeout(() => setAnimVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Resize listener to adjust visible cards dynamically
    useEffect(() => {
        const updateVisibleCards = () => {
            if (window.innerWidth <= 768) {
                setVisibleCards(1);
            } else if (window.innerWidth <= 1024) {
                setVisibleCards(2);
            } else {
                setVisibleCards(3);
            }
        };
        updateVisibleCards();
        window.addEventListener('resize', updateVisibleCards);
        return () => window.removeEventListener('resize', updateVisibleCards);
    }, []);

    const showNavigation = programas.length > visibleCards;

    const handlePrev = () => {
        setCurrentIndex(prev => {
            if (prev === 0) {
                return Math.max(0, programas.length - visibleCards);
            }
            return prev - 1;
        });
    };

    const handleNext = () => {
        setCurrentIndex(prev => {
            if (prev >= programas.length - visibleCards) {
                return 0;
            }
            return prev + 1;
        });
    };

    // Autoplay effect
    useEffect(() => {
        if (isPaused || !showNavigation) return;
        
        const interval = setInterval(() => {
            handleNext();
        }, 3500);
        
        return () => clearInterval(interval);
    }, [isPaused, showNavigation, programas.length, visibleCards]);

    if (cargando) {
        return (
            <div className="programas-loading-screen">
                <div className="programas-spinner"></div>
                <p>Cargando programas...</p>
            </div>
        );
    }

    return (
        <section className="seccion-programas-completa">

            {/* ── HERO ── */}
            <div className="programas-hero">
                <video autoPlay loop muted playsInline className="programas-hero-video">
                    <source src="/img/berlin-film-2025-for-website.mp4" type="video/mp4" />
                </video>
                <div className="programas-hero-overlay">
                    <div className={`programas-hero-content ${animVisible ? 'visible' : ''}`}>
                        <span className="programas-hero-badge">🏅 Olimpiadas Especiales Costa Rica</span>
                        <h1>Nuestros Programas</h1>
                        <p>Transformamos vidas a través del deporte. Descubre los programas que dan esperanza, dignidad e inclusión a nuestra comunidad.</p>
                        <div className="programas-hero-stats">
                            <div className="hero-stat">
                                <strong>6+</strong>
                                <span>Disciplinas</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <strong>12</strong>
                                <span>Provincias</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <strong>2025</strong>
                                <span>Temporada</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="programas-hero-scroll">
                    <div className="scroll-indicator">
                        <div className="scroll-dot"></div>
                    </div>
                </div>
            </div>

            {/* ── INTRO STRIP ── */}
            <div className="programas-intro-strip">
                <div className="intro-strip-inner">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    <span>Programas activos en todo el país — <strong>únete al movimiento inclusivo más grande de Costa Rica</strong></span>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="programas-main-container">

                {/* Header */}
                <header className="programas-section-header">
                    <div className="programas-section-label">Temporada 2025</div>
                    <h2>Programas Deportivos</h2>
                    <p>Cada programa está diseñado para desarrollar habilidades, fomentar la amistad y celebrar el potencial ilimitado de cada atleta.</p>
                </header>

                {/* Carrusel de programas */}
                {programas.length === 0 ? (
                    <div className="programas-empty" style={{ margin: '0 auto', textAlign: 'center' }}>
                        <span>🔍</span>
                        <p>No hay programas por ahora.</p>
                    </div>
                ) : (
                    <div className="programas-carousel-wrapper">
                        {showNavigation && (
                            <button className="carousel-nav-btn prev" onClick={handlePrev} aria-label="Anterior">
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                        )}
                        
                        <div 
                            className="programas-carousel-viewport"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            <div 
                                className="programas-carousel-track"
                                style={{ 
                                    transform: `translateX(calc(-${currentIndex} * (100% + 24px) / ${visibleCards}))`
                                }}
                            >
                                {programas.map((programa, idx) => (
                                    <article
                                        key={programa.id}
                                        className="programa-card"
                                        style={{ animationDelay: `${idx * 0.08}s` }}
                                    >
                                        <div className="programa-card-imagen">
                                            {(programa.img || programa.imagen) ? (
                                                <img
                                                    src={programa.img || programa.imagen}
                                                    alt={programa.nombre}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="programa-card-placeholder">
                                                    <span>{categoryIcons[programa.categoria || programa.deporte || ''] || '🏆'}</span>
                                                </div>
                                            )}
                                            <div className="programa-card-imagen-overlay"></div>
                                        </div>

                                        <div className="programa-card-body">
                                            <span className="programa-categoria">
                                                {categoryIcons[programa.categoria || programa.deporte || ''] || '🏆'} {programa.categoria || programa.deporte || 'Deporte'}
                                            </span>
                                            <h3>{programa.nombre}</h3>
                                            <p>{programa.resumen || programa.descripcion}</p>

                                            <div className="programa-card-footer">
                                                <div className="programa-fecha">
                                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                                                        <path d="M19,4H17V3a1,1,0,0,0-2,0V4H9V3A1,1,0,0,0,7,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V10H20ZM20,8H4V7A1,1,0,0,1,5,6H7V7A1,1,0,0,0,9,7V6h6V7a1,1,0,0,0,2,0V6h2a1,1,0,0,1,1,1Z"/>
                                                    </svg>
                                                    {programa.fecha}
                                                </div>
                                                <button className="programa-card-btn" aria-label={`Ver detalles de ${programa.nombre}`}>
                                                    Saber más <span aria-hidden="true">→</span>
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                        
                        {showNavigation && (
                            <button className="carousel-nav-btn next" onClick={handleNext} aria-label="Siguiente">
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ── SECCIÓN DE VIDEO YOUTUBE ── */}
            <div className="programas-video-section">
                <div className="programas-video-container">
                    <div className="programas-video-text-col">
                        <span className="video-badge">🎬 Inspiración en Acción</span>
                        <h2>Descubre el Poder de la Inclusión</h2>
                        <p>
                            Cada entrenamiento, cada sonrisa y cada logro es el resultado de un esfuerzo colectivo. 
                            A través de Olimpiadas Especiales, nuestros atletas demuestran al mundo que la determinación y la pasión no conocen límites.
                        </p>
                        <p className="video-highlight-text">
                            Acompáñanos a revivir los momentos más emotivos y a conocer el impacto real de nuestros programas deportivos en Costa Rica.
                        </p>
                    </div>
                    <div className="programas-video-embed-col">
                        <div className="video-iframe-wrapper">
                            <iframe 
                                src="https://www.youtube.com/embed/yAlbCaav9cI" 
                                title="Olimpiadas Especiales Costa Rica" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SECCIÓN DE TESTIMONIOS ── */}
            <div className="programas-testimonios-section">
                <div className="testimonios-container">
                    <header className="testimonios-header">
                        <span className="testimonios-badge">💬 Voces de Nuestra Comunidad</span>
                        <h2>Historias que nos Inspiran</h2>
                        <p>
                            El impacto de Olimpiadas Especiales Costa Rica se refleja en el testimonio de quienes viven de cerca la transformación.
                        </p>
                    </header>
                    
                    <div className="testimonios-grid">
                        <div className="testimonio-card">
                            <div className="testimonio-quote-icon">“</div>
                            <p className="testimonio-text">
                                Olimpiadas Especiales me enseñó que no hay límites en la pista de atletismo. Aquí he encontrado amigos, apoyo y he aprendido a luchar siempre por mis metas con orgullo.
                            </p>
                            <div className="testimonio-divider"></div>
                            <div className="testimonio-autor">
                                <div className="testimonio-avatar avatar-1">AD</div>
                                <div className="testimonio-info">
                                    <h4>Adrián de la Ossa</h4>
                                    <span>Atleta de Atletismo</span>
                                </div>
                            </div>
                        </div>

                        <div className="testimonio-card">
                            <div className="testimonio-quote-icon">“</div>
                            <p className="testimonio-text">
                                Ver a mi hijo ganar confianza, hacer amigos entrañables y sentirse verdaderamente valorado por sus habilidades ha sido la mayor bendición para toda nuestra familia.
                            </p>
                            <div className="testimonio-divider"></div>
                            <div className="testimonio-autor">
                                <div className="testimonio-avatar avatar-2">MC</div>
                                <div className="testimonio-info">
                                    <h4>Mariela Castro</h4>
                                    <span>Madre de un Atleta</span>
                                </div>
                            </div>
                        </div>

                        <div className="testimonio-card">
                            <div className="testimonio-quote-icon">“</div>
                            <p className="testimonio-text">
                                Ser voluntario y entrenador me ha cambiado la vida por completo. En cada entrenamiento aprendo mucho más de la valentía y el entusiasmo de los atletas de lo que yo les puedo enseñar.
                            </p>
                            <div className="testimonio-divider"></div>
                            <div className="testimonio-autor">
                                <div className="testimonio-avatar avatar-3">JV</div>
                                <div className="testimonio-info">
                                    <h4>José Pablo Vargas</h4>
                                    <span>Entrenador Voluntario</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </section>
    );
};

export default Programas;
