import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Routing from './routes/Routing';
import ChatWidget from './components/Chat/ChatWidget';
import DonationButton from './components/DonationButton/DonationButton';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <Routing />
      <ChatWidget />
      <DonationButton />
    </AuthProvider>
  );
}

export default App;
