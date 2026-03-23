import React from 'react';
import Navbar from '../components/Shared/Navbar';
import Home from '../components/Home';


const HomePages = () => {
    return (
        <div className="pagina-inicio-completa">
            {/* Llamamos al Navbar arriba */}
            <header>
                <Navbar />
            </header>

            {/* Contenido principal de la página */}
            <main>
                <Home />
            </main>
        </div>
    );
};

export default HomePages;