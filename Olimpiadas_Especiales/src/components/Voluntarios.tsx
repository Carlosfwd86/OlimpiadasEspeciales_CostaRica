import React from 'react';
import '../styles/Voluntarios.css';

interface RolVoluntariado {
    titulo: string;
    descripcion: string;
    icono: string;
}

const Voluntarios = (): React.JSX.Element => {
    const rolesVoluntariado: RolVoluntariado[] = [
        {
            titulo: "Entrenador",
            descripcion: "Ayuda a nuestros atletas a desarrollar sus habilidades deportivas y fomenta la disciplina.",
            icono: "🏆"
        },
        {
            titulo: "Logística de Eventos",
            descripcion: "Colabora en la organización, hidratación y soporte durante los torneos y competencias.",
            icono: "📍"
        },
        {
            titulo: "Apoyo Médico",
            descripcion: "Brinda asistencia profesional o primeros auxilios en nuestras actividades deportivas.",
            icono: "🏥"
        },
        {
            titulo: "Fotografía y Redes",
            descripcion: "Captura los mejores momentos y comparte las historias de éxito de nuestros atletas.",
            icono: "📸"
        }
    ];

    return (
        <section className="seccion-voluntarios-completa">
            <div className="voluntarios-hero">
                <h1>Únete como Voluntario</h1>
                <p>Tu tiempo y talento pueden transformar vidas.</p>
            </div>

            <div className="voluntarios-contenido-cards">
                <h2>¿En qué te gustaría colaborar?</h2>
                <div className="grid-roles-voluntarios">
                    {rolesVoluntariado.map((rol, index) => (
                        <div key={index} className="rol-voluntario-card">
                            <span className="rol-icono">{rol.icono}</span>
                            <h3>{rol.titulo}</h3>
                            <p>{rol.descripcion}</p>
                            <button className="boton-postular">Postularme</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="info-registro-voluntarios">
                <h3>¿Cómo es el proceso?</h3>
                <ol>
                    <li>Selecciona tu área de interés.</li>
                    <li>Completa el formulario de registro.</li>
                    <li>Asiste a una de nuestras sesiones de inducción.</li>
                    <li>¡Empieza a dejar una huella positiva!</li>
                </ol>
            </div>
        </section>
    );
};

export default Voluntarios;
