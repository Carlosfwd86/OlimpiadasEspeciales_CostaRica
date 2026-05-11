import React from 'react';
import Navbar from '../components/Navbar';
import Voluntarios from '../components/Voluntarios';
import Footer from '../components/Footer';

const VoluntariosPages: React.FC = () => {
    return (
        <div className="pagina-inicio-completa">
            <header>
                <Navbar />
            </header>
            <main>
                <Voluntarios />
            </main>
            <Footer />
        </div>
    );
};

export default VoluntariosPages;
