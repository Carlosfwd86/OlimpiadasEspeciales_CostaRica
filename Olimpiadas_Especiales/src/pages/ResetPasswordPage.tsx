import React from 'react';
import Navbar from '../components/Navbar';
import ResetPassword from '../components/ResetPassword';
import Footer from '../components/Footer';

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="pagina-login-completa">
      <header>
        <Navbar />
      </header>
      <main>
        <ResetPassword />
      </main>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
