import React, { useState, useEffect } from 'react';
import '../styles/Eventos.css';

interface Evento {
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

const Eventos = (): React.JSX.Element => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        fetch('http://localhost:3001/competiciones')
            .then(res => res.json())
            .then(data => {
                setEventos(data as Evento[]);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error cargando eventos:", err);
                setCargando(false);
            });
    }, []);

    if (cargando) return <div className="eventos-loading">Cargando eventos...</div>;

    return (
        <section className="seccion-eventos-completa">
            {/* Hero Video Section */}
            <div className="eventos-hero-video">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="video-presentacion-berlin"
                >
                    <source src="/img/berlin-film-2025-for-website.mp4" type="video/mp4" />
                    Tu navegador no soporta el tag de video.
                </video>
            </div>

            <div className="eventos-container">
                <header className="eventos-header">
                    <h1>Calendario de Actividades</h1>
                    <p>Encuentra aquí el próximo gran paso para nuestros campeones.</p>
                </header>

                <div className="lista-eventos-grid">
                    {eventos.map((evento) => (
                        <div key={evento.id} className="evento-item-row">
                            <div className="evento-item-imagen">
                                <img 
                                    src={evento.img || evento.imagen} 
                                    alt={evento.nombre} 
                                />
                                <span className={`status-badge ${(evento.status || 'proximo').toLowerCase().replace(' ', '-')}`}>
                                    {evento.status || 'PRÓXIMO'}
                                </span>
                            </div>
                            <div className="evento-item-info">
                                <span className="evento-item-categoria">{evento.categoria || evento.deporte}</span>
                                <h2>{evento.nombre}</h2>
                                <p>{evento.resumen || evento.descripcion}</p>
                                <div className="evento-item-meta">
                                    <span className="fecha-evento">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                            <path d="M19,4H17V3a1,1,0,0,0-2,0V4H9V3A1,1,0,0,0,7,0V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V10H20ZM20,8H4V7A1,1,0,0,1,5,6H7V7A1,1,0,0,0,9,7V6h6V7a1,1,0,0,0,2,0V6h2a1,1,0,0,1,1,1Z"/>
                                        </svg>
                                        {evento.fecha}
                                    </span>
                                    <button className="boton-detalle-evento">Saber más</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Eventos;
