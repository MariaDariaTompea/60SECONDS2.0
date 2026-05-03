import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Settings, Users, HelpCircle, ChevronRight, Lock, Volume2, Sun } from 'lucide-react';
import { supabase } from './lib/supabase';

const App = () => {
  const [currentPage, setCurrentPage] = useState('intro');
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(80);
  const [characters, setCharacters] = useState([]);
  const [selectedChar, setSelectedChar] = useState(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    const { data, error } = await supabase
      .from('neighborhood_roster')
      .select('*');
    if (!error) setCharacters(data);
  };

  const menuItems = [
    { id: 'play', label: 'PLAY', icon: <Play size={20} />, color: '#ff3e3e' },
    { id: 'options', label: 'OPTIONS', icon: <Settings size={20} />, color: '#ff9d00' },
    { id: 'candidates', label: 'CANDIDATES', icon: <Users size={20} />, color: '#00e5ff' },
    { id: 'support', label: 'SUPPORT', icon: <HelpCircle size={20} />, color: '#a0a0a0' },
  ];

  const handleSupport = () => {
    window.open('https://github.com/MariaDariaTompea/60SECONDS2.0', '_blank');
  };

  return (
    <div className="game-container" style={{ filter: `brightness(${brightness}%)` }}>
      {/* Sidebar Navigation */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="glass-panel"
        style={{ width: '300px', height: '90vh', margin: 'auto 20px', padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <h1 style={{ fontFamily: 'Outfit', fontSize: '2.5rem', fontWeight: 800, marginBottom: '40px', background: 'linear-gradient(45deg, #ff3e3e, #ff9d00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          60S 2.0
        </h1>
        
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05, x: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => item.id === 'support' ? handleSupport() : setCurrentPage(item.id)}
            className="glass-panel"
            style={{ 
              width: '100%', 
              padding: '15px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px', 
              cursor: 'pointer',
              color: currentPage === item.id ? item.color : 'white',
              border: currentPage === item.id ? `1px solid ${item.color}` : '1px solid var(--glass-border)',
              transition: 'all 0.3s ease'
            }}
          >
            {item.icon}
            <span style={{ fontWeight: 600, letterSpacing: '2px' }}>{item.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          {currentPage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              style={{ textAlign: 'center' }}
            >
              <h2 style={{ fontSize: '4rem', opacity: 0.2 }}>SELECT A SYSTEM</h2>
            </motion.div>
          )}

          {currentPage === 'play' && (
            <motion.div
              key="play"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel"
              style={{ width: '600px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
            >
              {['TUTORIAL', 'MEDIUM', 'HARD', 'NIGHTMARE'].map((mode, i) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    padding: '30px', 
                    background: 'rgba(255, 62, 62, 0.1)', 
                    border: '1px solid var(--accent-primary)',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {mode}
                </motion.button>
              ))}
            </motion.div>
          )}

          {currentPage === 'options' && (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel"
              style={{ width: '500px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '40px' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Volume2 size={18} /> SOUND</div>
                  <span>{volume}%</span>
                </div>
                <input type="range" value={volume} onChange={(e) => setVolume(e.target.value)} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Sun size={18} /> BRIGHTNESS</div>
                  <span>{brightness}%</span>
                </div>
                <input type="range" value={brightness} onChange={(e) => setBrightness(e.target.value)} />
              </div>
            </motion.div>
          )}

          {currentPage === 'candidates' && (
            <motion.div
              key="candidates"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              style={{ width: '100%', height: '100%', display: 'flex', gap: '20px' }}
            >
              <div className="glass-panel" style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', alignContent: 'start' }}>
                {characters.map((char) => (
                  <motion.div
                    key={char.char_id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedChar(char)}
                    style={{ 
                      aspectRatio: '1', 
                      background: char.unlocked_by_default ? 'rgba(0, 229, 255, 0.1)' : 'rgba(0,0,0,0.5)',
                      border: char.unlocked_by_default ? '1px solid #00e5ff' : '1px solid #333',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    {!char.unlocked_by_default && <Lock style={{ position: 'absolute', top: '10px', right: '10px' }} size={16} />}
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{char.name}</div>
                  </motion.div>
                ))}
              </div>

              {selectedChar && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '400px' }}
                  className="glass-panel" 
                  style={{ padding: '30px' }}
                >
                  <h3 style={{ fontSize: '1.5rem', color: '#00e5ff', marginBottom: '20px' }}>{selectedChar.name}</h3>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>IQ</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedChar.base_iq}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>STRENGTH</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedChar.base_strength}</div>
                    </div>
                  </div>
                  <p style={{ lineHeight: '1.6', color: 'var(--text-dim)' }}>
                    {selectedChar.perk_id || 'Character description and unique survival traits will be loaded from the narrative database.'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
