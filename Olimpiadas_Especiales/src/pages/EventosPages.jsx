import React from 'react';
import Navbar from '../components/Navbar';
import Eventos from '../components/Eventos';
import Footer from '../components/Footer';

const EventosPages = () => {
    return (
        <div className="pagina-inicio-completa">
            <header>
                <Navbar />
            </header>

            <main>
                <Eventos />
            </main>

            <Footer />
        </div>
    );
};

export default EventosPages;
