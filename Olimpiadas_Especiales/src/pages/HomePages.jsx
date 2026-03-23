import React from 'react';
import Navbar from '../components/Shared/Navbar';
import Home from '../components/Home';
import Footer from '../components/Footer';


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

            <Footer/>
        </div>
    );
};

export default HomePages;