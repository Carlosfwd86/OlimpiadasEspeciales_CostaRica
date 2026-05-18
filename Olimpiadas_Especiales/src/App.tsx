import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Routing from './routes/Routing';
import ChatWidget from './components/Chat/ChatWidget';
import DonationButton from './components/DonationButton/DonationButton';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <Routing />
      <ChatWidget />
      <DonationButton />
      <ScrollToTopButton />
    </AuthProvider>
  );
}

export default App;
