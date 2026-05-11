import React from 'react';
import Navbar from '../components/Navbar';
import Home from '../components/Home';
import Footer from '../components/Footer';

const HomePages: React.FC = () => {
    return (
        <div className="pagina-inicio-completa">
            <header>
                <Navbar />
            </header>
            <main>
                <Home />
            </main>
            <Footer />
        </div>
    );
};

export default HomePages;
