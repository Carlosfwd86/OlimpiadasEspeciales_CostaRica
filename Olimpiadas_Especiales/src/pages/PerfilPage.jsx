import React, { useState, useEffect } from 'react';
import FormPerfil from '../components/FormPerfil';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getUsuarioById } from '../services/ServicesUsuarios';

function PerfilPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const refreshSession = async () => {
            const storedUser = localStorage.getItem('usuarioSesion');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                
                // Refrescar desde el servidor para obtener el rol más reciente
                try {
                    const latestData = await getUsuarioById(parsedUser.id);
                    if (latestData && JSON.stringify(latestData) !== JSON.stringify(parsedUser)) {
                        console.log("Sesión sincronizada con el servidor.");
                        localStorage.setItem('usuarioSesion', JSON.stringify(latestData));
                        setUser(latestData);
                        // Emitir evento para que otros componentes (Navbar) se enteren
                        window.dispatchEvent(new Event('sesionActualizada'));
                    }
                } catch (e) {
                    console.warn("No se pudo refrescar la sesión:", e);
                }
            }
        };
        refreshSession();
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