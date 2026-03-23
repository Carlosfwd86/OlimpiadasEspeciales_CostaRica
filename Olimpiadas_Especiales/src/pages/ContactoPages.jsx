import React from 'react';
import Navbar from '../components/Navbar';
import Contacto from '../components/Contacto';
import Footer from '../components/Footer';

const ContactoPages = () => {
    return (
        <div className="pagina-inicio-completa">
            <header>
                <Navbar />
            </header>

            <main>
                <Contacto />
            </main>

            <Footer />
        </div>
    );
};

export default ContactoPages;
