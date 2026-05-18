import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CarouselEventos.css';

interface Evento {
    id: string | number;
    nombre: string;
    resumen: string;
    categoria: string;
    img: string;
    [key: string]: unknown;
}

const CarouselEventos = (): React.JSX.Element => {
    const navigate = useNavigate();
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);

    const handleVerEventos = (): void => {
        navigate('/eventos');
    };

    useEffect(() => {
        const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
        fetch(`${BACKEND_URL}/competiciones`)
            .then(res => res.json())
            .then((json: unknown) => {
                // Soporta { data: [...] } o array directo
                const raw = (json && typeof json === 'object' && 'data' in (json as object))
                    ? (json as { data: Evento[] }).data
                    : json as Evento[];
                // Normalizar campos: el backend puede usar descripcion/imagen en lugar de resumen/img
                const normalized = raw.map(e => ({
                    ...e,
                    resumen: e.resumen ?? (e as Record<string, unknown>).descripcion as string ?? '',
                    img:     e.img    ?? (e as Record<string, unknown>).imagen as string ?? '',
                    categoria: e.categoria ?? (e as Record<string, unknown>).deporte as string ?? '',
                }));
                setEventos(normalized.slice(-3));
                setCargando(false);
            })
            .catch(err => {
                console.error('Error cargando eventos carrusel:', err);
                setCargando(false);
            });
    }, []);

    if (cargando) return <div className="carrusel-loading">Cargando eventos...</div>;

    return (
        <section className="carrusel-eventos-section">
            <div className="carrusel-eventos-header">
                <h2>Próximos Eventos</h2>
                <p className="subtitulo">Sigue de cerca el impacto y las alegrías de nuestra comunidad</p>
            </div>

            <div className="carrusel-contenedor" role="list">
                {eventos.map((evento) => (
                    <article 
                        key={evento.id} 
                        className="evento-card" 
                        onClick={() => {
                            if (typeof evento.enlace === 'string' && evento.enlace) {
                                window.open(evento.enlace, '_blank');
                            } else {
                                handleVerEventos();
                            }
                        }}
                    >
                        <div className="evento-imagen-wrapper">
                            <img src={evento.img || undefined} alt={evento.nombre} />
                            <span className="evento-badge">{evento.categoria}</span>
                        </div>
                        <div className="evento-contenido">
                            <h3>{evento.nombre}</h3>
                            <p>{evento.resumen}</p>
                            <div className="evento-link">
                                Ver detalles &rarr;
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default CarouselEventos;
