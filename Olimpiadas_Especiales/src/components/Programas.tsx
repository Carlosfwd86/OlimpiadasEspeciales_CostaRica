import React, { useState, useEffect } from 'react';
import '../styles/Programas.css';
import { s3Url } from '../utils/s3';

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
        img: s3Url('img/Hero_contenedor_01.jpeg'),
    },
    {
        id: '2',
        nombre: 'Natación para Campeones',
        categoria: 'Natación',
        resumen: 'Entrenamiento acuático integral en piscinas olímpicas con metodología inclusiva. Desarrolla técnica, resistencia y confianza en nuestros deportistas.',
        fecha: 'Febrero – Noviembre 2025',
        status: 'ACTIVO',
        img: s3Url('img/Hero_contenedor_02.jpeg'),
    },
    {
        id: '3',
        nombre: 'Baloncesto Unificado',
        categoria: 'Baloncesto',
        resumen: 'Equipos mixtos donde atletas con y sin discapacidad intelectual juegan juntos. Promueve la inclusión social y el compañerismo en la cancha.',
        fecha: 'Marzo – Octubre 2025',
        status: 'ACTIVO',
        img: s3Url('img/Hero_contenedor_03.jpeg'),
    },
    {
        id: '4',
        nombre: 'Juegos Mundiales Berlín 2023 – Legado',
        categoria: 'Internacional',
        resumen: 'Programa de seguimiento y reintegración para los atletas que representaron a Costa Rica en los Juegos Mundiales de Olimpiadas Especiales, Berlín 2023.',
        fecha: 'Continuo 2025',
        status: 'LEGADO',
        img: s3Url('img/Hero_contenedor_04.jpeg'),
    },
    {
        id: '5',
        nombre: 'Fútbol Inclusivo',
        categoria: 'Fútbol',
        resumen: 'Liga de fútbol adaptado con categorías juvenil y adulto. Partidos semanales, torneos regionales y participación en eventos nacionales de Olimpiadas Especiales.',
        fecha: 'Enero – Diciembre 2025',
        status: 'ACTIVO',
        img: s3Url('img/Hero_contenedor_01.jpeg'),
    },
    {
        id: '6',
        nombre: 'Gimnasia Rítmica Especial',
        categoria: 'Gimnasia',
        resumen: 'Programa artístico-deportivo enfocado en coordinación, expresión corporal y desarrollo psicomotriz. Presentaciones en eventos culturales y competencias nacionales.',
        fecha: 'Abril – Noviembre 2025',
        status: 'PRÓXIMO',
        img: s3Url('img/Hero_contenedor_02.jpeg'),
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
    const [filtroActivo, setFiltroActivo] = useState<string>('TODOS');
    const [animVisible, setAnimVisible] = useState<boolean>(false);

    useEffect(() => {
        const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
        fetch(`${BACKEND_URL}/competiciones`)
            .then(res => res.json())
            .then((json: unknown) => {
                const raw = (json && typeof json === 'object' && 'data' in (json as object))
                    ? (json as { data: Programa[] }).data
                    : json as Programa[];
                if (Array.isArray(raw) && raw.length > 0) {
                    setProgramas(raw);
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

    const filtros = ['TODOS', 'ACTIVO', 'PRÓXIMO', 'LEGADO'];
    const programasFiltrados = filtroActivo === 'TODOS'
        ? programas
        : programas.filter(p => (p.status || 'ACTIVO').toUpperCase() === filtroActivo);

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
                    <source src={s3Url('img/berlin-film-2025-for-website.mp4')} type="video/mp4" />
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

                {/* Header + Filtros */}
                <header className="programas-section-header">
                    <div className="programas-section-label">Temporada 2025</div>
                    <h2>Programas Deportivos</h2>
                    <p>Cada programa está diseñado para desarrollar habilidades, fomentar la amistad y celebrar el potencial ilimitado de cada atleta.</p>

                    <div className="programas-filtros" role="tablist" aria-label="Filtrar programas">
                        {filtros.map(f => (
                            <button
                                key={f}
                                role="tab"
                                aria-selected={filtroActivo === f}
                                className={`filtro-btn ${filtroActivo === f ? 'activo' : ''}`}
                                onClick={() => setFiltroActivo(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Grid de programas */}
                <div className="programas-grid">
                    {programasFiltrados.length === 0 ? (
                        <div className="programas-empty">
                            <span>🔍</span>
                            <p>No hay programas en esta categoría por ahora.</p>
                        </div>
                    ) : (
                        programasFiltrados.map((programa, idx) => (
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
                                    <span className={`programa-status-badge status-${(programa.status || 'activo').toLowerCase().replace(/\s+/g, '-').replace(/ó/g, 'o').replace(/é/g, 'e')}`}>
                                        {programa.status || 'ACTIVO'}
                                    </span>
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
                        ))
                    )}
                </div>
            </div>

            {/* ── CTA BOTTOM ── */}
            <div className="programas-cta-section">
                <div className="programas-cta-inner">
                    <span className="programas-cta-icon">🤝</span>
                    <h2>¿Querés ser parte del cambio?</h2>
                    <p>Únete como atleta, voluntario, entrenador o patrocinador y ayudá a transformar más vidas a través del deporte.</p>
                    <div className="programas-cta-btns">
                        <a href="/plataforma-registro" className="cta-btn-primary">Inscribirse ahora</a>
                        <a href="/contacto" className="cta-btn-secondary">Contáctanos</a>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Programas;
