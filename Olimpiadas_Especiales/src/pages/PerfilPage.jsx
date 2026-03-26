import React, { useState, useEffect } from 'react';
import FormPerfil from '../components/FormPerfil';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PerfilPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('usuarioSesion');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div style={{minHeight: '100vh', background: '#f8fafc'}}>
            <Navbar />
            {user ? (
                <FormPerfil user={user} setRefreshUser={setUser} />
            ) : (
                <div style={{padding: '100px', textAlign: 'center', fontFamily: 'Outfit'}}>
                    <h2>No has iniciado sesión</h2>
                    <p>Por favor vuelve a la página principal para iniciar sesión o registrarte.</p>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default PerfilPage;