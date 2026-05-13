import React, { useState, useEffect } from 'react';
import FormPerfil from '../components/FormPerfil';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { getUsuarioById } from '../services/ServicesUsuarios';
import type { Usuario } from '../types';

const PerfilPage: React.FC = () => {
    const { user: authUser, isAuthenticated, isLoading } = useAuth();
    const [fullUserData, setFullUserData] = useState<Usuario | null>(null);

    useEffect(() => {
        const fetchFullData = async () => {
            if (authUser?.id) {
                try {
                    const data = await getUsuarioById(authUser.id);
                    setFullUserData(data);
                } catch (e) {
                    console.error("Error cargando perfil extendido:", e);
                }
            }
        };
        fetchFullData();
    }, [authUser]);

    if (isLoading) return <div style={{ padding: '100px', textAlign: 'center' }}>Cargando sesión...</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar />
            {isAuthenticated && (fullUserData || authUser) ? (
                <FormPerfil user={(fullUserData || authUser) as Usuario} setRefreshUser={(u) => setFullUserData(u as Usuario)} />
            ) : (
                <div style={{ padding: '100px', textAlign: 'center', fontFamily: 'Outfit' }}>
                    <h2>No has iniciado sesión</h2>
                    <p>Por favor vuelve a la página principal para iniciar sesión o registrarte.</p>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default PerfilPage;

