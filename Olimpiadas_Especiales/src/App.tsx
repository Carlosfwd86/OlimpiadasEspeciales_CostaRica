import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Routing from './routes/Routing';
import ChatWidget from './components/Chat/ChatWidget';
import DonationButton from './components/DonationButton/DonationButton';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';
import AccessibilityWidget from './components/AccessibilityWidget/AccessibilityWidget';
import './styles/a11y.css';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <div id="main-content-wrapper">
          <Routing />
        </div>
        <ChatWidget />
        <DonationButton />
        <ScrollToTopButton />
        <AccessibilityWidget />
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;
