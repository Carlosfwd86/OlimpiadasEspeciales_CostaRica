import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Routing from './routes/Routing';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <Routing />
    </AuthProvider>
  );
}

export default App;
