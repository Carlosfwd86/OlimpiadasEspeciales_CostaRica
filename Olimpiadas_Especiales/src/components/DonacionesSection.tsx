import React from 'react';
import '../styles/DonacionesSection.css';

const DonacionesSection: React.FC = () => {
    const handleDonarClick = () => {
        window.open('https://donaciones.olimpiadasespeciales.org/', '_blank');
    };

    return (
        <section className="donaciones_section_premium">
            <div className="donaciones_overlay">
                <div className="donaciones_container">
                    <div className="donaciones_info_column">
                        <span className="donaciones_badge">Tu ayuda es vital</span>
                        <h2 className="donaciones_titulo">Transforma una vida hoy</h2>
                        <p className="donaciones_texto">
                            Con tu donación, proporcionas entrenamiento, equipo deportivo y servicios de salud gratuitos a miles de atletas con discapacidad intelectual en Costa Rica.
                        </p>
                        <div className="donaciones_stats_mini">
                            <div className="stat_mini_item">
                                <span className="stat_mini_val">+4,000</span>
                                <span className="stat_mini_lab">Atletas</span>
                            </div>
                            <div className="stat_mini_item">
                                <span className="stat_mini_val">22</span>
                                <span className="stat_mini_lab">Disciplinas</span>
                            </div>
                        </div>
                    </div>

                    <div className="donaciones_card_column">
                        <div className="donaciones_card_flotante">
                            <div className="card_header_premium">
                                <i className="fa-solid fa-heart-pulse icono_card_donar"></i>
                                <h3>Haz tu Donación</h3>
                            </div>
                            
                            <div className="selector_frecuencia">
                                <button className="frecuencia_btn active">Mensual</button>
                                <button className="frecuencia_btn">Única</button>
                            </div>

                            <div className="grid_montos">
                                <button className="monto_btn">$10</button>
                                <button className="monto_btn active">$25</button>
                                <button className="monto_btn">$50</button>
                                <button className="monto_btn">$100</button>
                                <button className="monto_btn_otro">Otro monto</button>
                            </div>

                            <p className="impacto_monto_texto">
                                * Con **$25**, financias el transporte de un atleta a sus entrenamientos por un mes.
                            </p>

                            <button className="boton_donar_final" onClick={handleDonarClick}>
                                CONTINUAR A PAGAR SEGURO <i className="fa-solid fa-arrow-right"></i>
                            </button>
                            
                            <div className="seguridad_logos">
                                <i className="fa-solid fa-shield-halved"></i> Pago 100% Seguro
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DonacionesSection;
