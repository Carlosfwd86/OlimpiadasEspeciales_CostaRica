import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CarouselProgramas.css';
import {
    API_BASE_URL,
    mapCompeticionFromApi,
    mapMockPrograma,
    programaListKey,
    type ProgramaDisplay,
} from '../utils/programaDisplay';

interface Programa extends ProgramaDisplay {
    nombre: string;
    resumen: string;
    categoria: string;
    img: string;
}

const programasMockCarousel: Programa[] = [
    {
        id: '1',
        nombre: 'Atletismo Adaptado Costa Rica',
        resumen: 'Entrenamiento en pista y campo para atletas con discapacidad intelectual a nivel nacional.',
        categoria: 'Atletismo',
        img: '/img/Hero_contenedor_01.jpeg',
    },
    {
        id: '2',
        nombre: 'Natación para Campeones',
        resumen: 'Programa acuático integral con metodología inclusiva en piscinas olímpicas.',
        categoria: 'Natación',
        img: '/img/Hero_contenedor_02.jpeg',
    },
    {
        id: '3',
        nombre: 'Baloncesto Unificado',
        resumen: 'Equipos mixtos donde atletas con y sin discapacidad juegan juntos por la inclusión.',
        categoria: 'Baloncesto',
        img: '/img/Hero_contenedor_03.jpeg',
    },
];

const CarouselProgramas = (): React.JSX.Element => {
    const navigate = useNavigate();
    const [programas, setProgramas] = useState<Programa[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);

    const handleVerProgramas = (): void => {
        navigate('/programas');
    };

    useEffect(() => {
        fetch(`${API_BASE_URL}/competiciones`)
            .then(res => res.json())
            .then((json: unknown) => {
                const raw = (json && typeof json === 'object' && 'data' in (json as object))
                    ? (json as { data: Programa[] }).data
                    : json as Programa[];
                const normalized = raw.map(e =>
                    mapCompeticionFromApi({
                        ...e,
                        resumen: e.resumen ?? (e.descripcion as string) ?? '',
                        categoria: e.categoria ?? (e.deporte as string) ?? '',
                    })
                );
                if (Array.isArray(normalized) && normalized.length > 0) {
                    setProgramas(normalized.slice(-3) as Programa[]);
                } else {
                    setProgramas(programasMockCarousel.map(mapMockPrograma) as Programa[]);
                }
                setCargando(false);
            })
            .catch(() => {
                setProgramas(programasMockCarousel.map(mapMockPrograma) as Programa[]);
                setCargando(false);
            });
    }, []);

    if (cargando) {
        return (
            <div className="carrusel-programas-loading">
                <div className="carrusel-spinner"></div>
            </div>
        );
    }

    return (
        <section className="carrusel-programas-section">
            <div className="carrusel-programas-header">
                <span className="carrusel-programas-label">Nuestras Disciplinas</span>
                <h2>Programas Destacados</h2>
                <p className="subtitulo">Conoce los programas que están transformando vidas en Costa Rica</p>
            </div>

            <div className="carrusel-programas-contenedor" role="list">
                {programas.map((programa, idx) => (
                    <article
                        key={programaListKey(programa, idx)}
                        className="programa-card-carousel"
                        role="listitem"
                        onClick={() => {
                            if (programa.enlace) {
                                window.open(programa.enlace as string, '_blank');
                            } else {
                                handleVerProgramas();
                            }
                        }}
                    >
                        <div className="programa-carousel-imagen">
                            {programa.img ? (
                                <img src={programa.img} alt={programa.nombre} loading="lazy" />
                            ) : (
                                <div className="programa-carousel-placeholder">🏆</div>
                            )}
                            <div className="programa-carousel-overlay"></div>
                            <span className="programa-carousel-badge">{programa.categoria}</span>
                        </div>
                        <div className="programa-carousel-contenido">
                            <h3>{programa.nombre}</h3>
                            <p>{programa.resumen}</p>
                            <div className="programa-carousel-link">
                                Ver programa <span aria-hidden="true">→</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="carrusel-programas-cta">
                <button className="ver-todos-programas-btn" onClick={handleVerProgramas}>
                    Ver todos los programas
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default CarouselProgramas;
