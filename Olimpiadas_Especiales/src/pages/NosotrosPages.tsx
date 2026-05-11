import React from 'react';
import Navbar from '../components/Navbar';
import Nosotros from '../components/Nosotros';
import Footer from '../components/Footer';

const NosotrosPages: React.FC = () => {
    return (
        <div className="pagina-inicio-completa">
            <header>
                <Navbar />
            </header>
            <main>
                <Nosotros />
            </main>
            <Footer />
        </div>
    );
};

export default NosotrosPages;
