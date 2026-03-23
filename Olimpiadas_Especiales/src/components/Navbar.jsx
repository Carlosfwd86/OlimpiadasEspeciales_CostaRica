/* --- COMPONENTE NAVBAR ESTÉTICO --- */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Navbar.css"

const Navbar = () => {
    const navigate = useNavigate();

    /* --- Funciones de Manejo de Rutas --- */
    
    const irAInicio = () => {
        navigate("/");
    };

    const irARegistro = () => {
        console.log("Clic en Registro de Atletas");
        // Lógica para mostrar registro
    };

    const irAListaAtletas = () => {
        console.log("Clic en Lista de Atletas");
    };

    const irAPanelAdmin = () => {
        navigate("/admin");
    };

    const manejarEntrar = () => {
        console.log("Clic en Entrar");
    };

    return (
        <nav className="navbar-principal">
            
            {/* Sección del Logo */}
            <div className="navbar-logo-seccion">
                {/* Asumimos que tenés un SVG o PNG para el logo */}
                {/* <img src="/ruta/al/logo.svg" alt="Olimpiadas Especiales Logo" /> */}
                <div className="navbar-logo-placehold">Olimpiadas Especiales</div>
                <span className="navbar-pais">Costa Rica</span>
            </div>

            {/* Sección de Navegación de Texto */}
            <ul className="navbar-enlaces">
                <li><button onClick={irAInicio}>Inicio</button></li>
                <li><button onClick={irARegistro}>Registro de Atletas</button></li>
                <li><button onClick={irAListaAtletas}>Lista de Atletas</button></li>
                <li><button onClick={irAPanelAdmin}>Panel de Administración</button></li>
            </ul>

            {/* Sección del Botón de Acción */}
            <div className="navbar-accion">
                <button className="boton-entrar" onClick={manejarEntrar}>
                    Entrar
                </button>
            </div>

        </nav>
    );
};

export default Navbar;