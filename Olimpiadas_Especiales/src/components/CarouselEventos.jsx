import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CarouselEventos.css';

const CarouselEventos = () => {
    const navigate = useNavigate();
    const [eventos, setEventos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const handleVerEventos = () => {
        navigate('/eventos');
    };

    useEffect(() => {
        fetch('http://localhost:3001/competiciones')
            .then(res => res.json())
            .then(data => {
                // Tomar los últimos 3 eventos o todos
                setEventos(data.slice(-3));
                setCargando(false);
            })
            .catch(err => {
                console.error("Error cargando eventos carrusel:", err);
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
                            if (evento.enlace) {
                                window.open(evento.enlace, '_blank');
                            } else {
                                handleVerEventos();
                            }
                        }}
                    >
                        <div className="evento-imagen-wrapper">
                            <img src={evento.img} alt={evento.nombre} />
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
