import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Routing from './routes/Routing';
import ChatWidget from './components/Chat/ChatWidget';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <Routing />
      <ChatWidget />
    </AuthProvider>
  );
}

export default App;
