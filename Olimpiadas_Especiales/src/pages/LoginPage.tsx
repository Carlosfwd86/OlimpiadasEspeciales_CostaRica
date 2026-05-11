import React from 'react';
import Navbar from '../components/Navbar';
import Login from '../components/Login';
import Footer from '../components/Footer';

const LoginPage: React.FC = () => {
  return (
    <div className="pagina-login-completa">
      <header>
        <Navbar />
      </header>
      <main>
        <Login />
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
