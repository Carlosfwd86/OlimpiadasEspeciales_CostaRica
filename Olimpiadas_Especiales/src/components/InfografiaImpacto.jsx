import React from 'react';
import '../styles/InfografiaImpacto.css';

const InfografiaImpacto = ({ stats }) => {
    // Calcular porcentajes
    const totalSexo = stats.porSexo.masc + stats.porSexo.fem || 1;
    const porcMasc = Math.round((stats.porSexo.masc / totalSexo) * 100);
    const porcFem = Math.round((stats.porSexo.fem / totalSexo) * 100);

    const totalEdad = stats.porEdad.ninos + stats.porEdad.jovenes + stats.porEdad.adultos || 1;
    const porcNinos = Math.round((stats.porEdad.ninos / totalEdad) * 100);
    const porcJovenes = Math.round((stats.porEdad.jovenes / totalEdad) * 100);
    const porcAdultos = Math.round((stats.porEdad.adultos / totalEdad) * 100);

    return (
        <section className="infografia_contenedor">
            <div className="infografia_grid">
                
                {/* 1. Demografía de Deportistas */}
                <div className="info_card demografia">
                    <h3>PERFIL DE DEPORTISTAS</h3>
                    
                    <div className="donut_container">
                        <div className="donut_item">
                            <svg viewBox="0 0 36 36" className="donut_svg">
                                <circle className="donut_base" cx="18" cy="18" r="16" />
                                <circle className="donut_value masc" cx="18" cy="18" r="16" strokeDasharray={`${porcMasc} 100`} />
                            </svg>
                            <div className="donut_texto">
                                <strong>{porcMasc}%</strong>
                                <span>Masculino</span>
                            </div>
                        </div>
                        <div className="donut_item">
                            <svg viewBox="0 0 36 36" className="donut_svg">
                                <circle className="donut_base" cx="18" cy="18" r="16" />
                                <circle className="donut_value fem" cx="18" cy="18" r="16" strokeDasharray={`${porcFem} 100`} />
                            </svg>
                            <div className="donut_texto">
                                <strong>{porcFem}%</strong>
                                <span>Femenino</span>
                            </div>
                        </div>
                    </div>

                    <div className="edad_list">
                        <div className="edad_item">
                            <span>Niños (v - 15)</span>
                            <div className="progress_bar"><div className="fill" style={{width: `${porcNinos}%`}}></div></div>
                            <span className="perc">{porcNinos}%</span>
                        </div>
                        <div className="edad_item">
                            <span>Jóvenes (15 - 25)</span>
                            <div className="progress_bar"><div className="fill" style={{width: `${porcJovenes}%`}}></div></div>
                            <span className="perc">{porcJovenes}%</span>
                        </div>
                        <div className="edad_item">
                            <span>Adultos (25+)</span>
                            <div className="progress_bar"><div className="fill" style={{width: `${porcAdultos}%`}}></div></div>
                            <span className="perc">{porcAdultos}%</span>
                        </div>
                    </div>
                </div>

                {/* 2. Deportes Unificados */}
                <div className="info_card unificados">
                    <div className="card_header_blue">
                        <h4>DEPORTES UNIFICADOS</h4>
                    </div>
                    <div className="card_body">
                        <div className="main_stat">
                            <span className="number">{stats.atletas.toLocaleString()}</span>
                            <span className="label">TOTAL DEPORTISTAS</span>
                        </div>
                        <div className="sub_stats">
                            <div className="sub_item">
                                <strong>{Math.round(stats.atletas * 0.45).toLocaleString()}</strong>
                                <span>UNIFICADOS</span>
                            </div>
                            <div className="sub_item">
                                <strong className="green">+49.5%</strong>
                                <span>CAMBIO ANUAL</span>
                            </div>
                        </div>
                        <div className="unificados_icon">
                             <svg viewBox="0 0 24 24" width="80" height="80" fill="#2d5da1">
                                <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"/>
                             </svg>
                        </div>
                    </div>
                </div>

                {/* 3. Healthy Athletes */}
                <div className="info_card healthy">
                    <div className="card_header_green">
                        <h4>HEALTHY ATHLETES</h4>
                    </div>
                    <div className="card_body">
                        <div className="stat_line">
                            <span className="number">899</span>
                            <span className="label">CLÍNICAS</span>
                        </div>
                        <div className="stat_line">
                            <span className="number">133,593</span>
                            <span className="label">REVISIONES</span>
                        </div>
                        <div className="stat_line">
                            <span className="number">19,119</span>
                            <span className="label">VOLUNTARIOS CLÍNICOS</span>
                        </div>
                        <div className="healthy_icon">
                            <svg viewBox="0 0 24 24" width="80" height="80" fill="#009688">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
                            </svg>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default InfografiaImpacto;
