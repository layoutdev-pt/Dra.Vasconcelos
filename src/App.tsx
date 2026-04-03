import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full bg-background-light font-display text-primary antialiased overflow-x-hidden">
        <Navbar />
        {/* pt-24 removido. O Hero agora vai encostar ao topo do ecrã e o Navbar flutuará por cima */}
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;