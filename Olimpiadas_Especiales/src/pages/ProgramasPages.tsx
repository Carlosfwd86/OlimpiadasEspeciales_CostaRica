import React from 'react';
import Navbar from '../components/Navbar';
import Programas from '../components/Programas';
import Footer from '../components/Footer';

const ProgramasPages: React.FC = () => {
    return (
        <div className="pagina-inicio-completa">
            <header>
                <Navbar />
            </header>
            <main>
                <Programas />
            </main>
            <Footer />
        </div>
    );
};

export default ProgramasPages;
