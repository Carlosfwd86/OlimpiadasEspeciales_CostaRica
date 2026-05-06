import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BannerVoluntarios.css';
import imgVoluntarios from '../img/fotoVoluntarios2.jpeg';

const BannerVoluntarios = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/voluntarios');
    };

    const [rolActual, setRolActual] = React.useState(0);
    const rolesDisponibles = ["un héroe", "un mentor", "un amigo", "un voluntario"];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setRolActual((prev) => (prev + 1) % rolesDisponibles.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="banner-voluntarios-section">
            <div className="decoracion-vol-1"></div>
            
            <div className="banner-voluntarios-contenido">
                <span className="badge-voluntarios">¡Únete a nuestra familia!</span>
                <h2>Sé parte del cambio, <br />sé <span key={rolActual} className="texto-cambiante">{rolesDisponibles[rolActual]}</span></h2>
                <p>
                    En Olimpiadas Especiales, el corazón de nuestro impacto son los voluntarios. 
                    No necesitas experiencia previa, solo las ganas de regalar alegría, 
                    ayudar a otros a superar sus límites y compartir momentos inolvidables.
                </p>
                <div className="banner-botones">
                    <button className="boton-unete-voluntario" onClick={handleRedirect}>
                        Quiero inscribirme &rarr;
                    </button>
                </div>
            </div>

            <div className="banner-voluntarios-imagen">
                <div className="imagen-wrapper-vol">
                    <img src={imgVoluntarios} alt="Voluntarios en acción ayudando a atletas" />
                </div>
            </div>
        </section>
    );
};

export default BannerVoluntarios;
