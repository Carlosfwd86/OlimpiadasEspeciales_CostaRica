import React from 'react';
import Navbar from '../components/Navbar';
import ForgotPassword from '../components/ForgotPassword';
import Footer from '../components/Footer';

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="pagina-login-completa">
      <header>
        <Navbar />
      </header>
      <main>
        <ForgotPassword />
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;