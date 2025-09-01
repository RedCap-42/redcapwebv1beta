import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SessionGeneratorButton from '../../components/features/session-generator/SessionGeneratorButton';

const HubPage = () => {
  return (
    <div>
      <Header />
      <main>
        <h1>Welcome to the Session Hub</h1>
        <p>Click the button below to generate a session with a casino roulette animation!</p>
        <SessionGeneratorButton />
      </main>
      <Footer />
    </div>
  );
};

export default HubPage;