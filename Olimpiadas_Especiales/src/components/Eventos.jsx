import React from 'react';
import '../styles/Eventos.css';

// Importación de imágenes
import imgCompetencia from '../img/evento_competencia.png';
import imgNatacion from '../img/evento_natacion.png';
import imgCeremonia from '../img/evento_ceremonia.png';

const Eventos = () => {
    const todosLosEventos = [
        {
          id: 1,
          titulo: "Próxima Competencia Regional de Atletismo",
          resumen: "Nuestros atletas se preparan para la competencia regional. Ven a apoyarlos este fin de semana en el estadio nacional.",
          vencimiento: "15 de mayo de 2026",
          imagen: imgCompetencia,
          categoria: "Atletismo",
          estado: "Próximo"
        },
        {
          id: 2,
          titulo: "Encuentro Regional de Natación",
          resumen: "Un evento acuático increíble para todas las edades. Contaremos con la participación de delegaciones de todo el país.",
          vencimiento: "22 de junio de 2026",
          imagen: imgNatacion,
          categoria: "Natación",
          estado: "Abierto"
        },
        {
          id: 3,
          titulo: "Gala de Reconocimiento al Atleta",
          resumen: "Celebración especial para honrar el esfuerzo y la dedicación de nuestros deportistas durante el año.",
          vencimiento: "10 de julio de 2026",
          imagen: imgCeremonia,
          categoria: "Social",
          estado: "Por confirmar"
        }
    ];

    return (
        <section className="seccion-eventos-completa">
            <div className="eventos-container">
                <header className="eventos-header">
                    <h1>Calendario de Actividades</h1>
                    <p>Encuentra aquí el próximo gran paso para nuestros campeones.</p>
                </header>

                <div className="lista-eventos-grid">
                    {todosLosEventos.map((evento) => (
                        <div key={evento.id} className="evento-item-row">
                            <div className="evento-item-imagen">
                                <img src={evento.imagen} alt={evento.titulo} />
                                <span className={`status-badge ${evento.estado.toLowerCase().replace(' ', '-')}`}>
                                    {evento.estado}
                                </span>
                            </div>
                            <div className="evento-item-info">
                                <span className="evento-item-categoria">{evento.categoria}</span>
                                <h2>{evento.titulo}</h2>
                                <p>{evento.resumen}</p>
                                <div className="evento-item-meta">
                                    <span className="fecha-evento">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                            <path d="M19,4H17V3a1,1,0,0,0-2,0V4H9V3A1,1,0,0,0,7,0V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V10H20ZM20,8H4V7A1,1,0,0,1,5,6H7V7A1,1,0,0,0,9,7V6h6V7a1,1,0,0,0,2,0V6h2a1,1,0,0,1,1,1Z"/>
                                        </svg>
                                        {evento.vencimiento}
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
