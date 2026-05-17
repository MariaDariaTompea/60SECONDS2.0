import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Settings, Users, HelpCircle, ChevronRight, Lock, Volume2, Sun, Anchor, Droplets, Coffee, Skull, BookOpen, Map as MapIcon, Wind } from 'lucide-react';
import { supabase } from './lib/supabase';

const ShipView = ({ difficulty, onExit }) => {
  const [day, setDay] = useState(1);
  const [supplies, setSupplies] = useState({ food: 5, water: 8, rum: 3, wood: 4 });
  const [seaCurse, setSeaCurse] = useState(0);
  const [log, setLog] = useState(["Day 1: The crew is anxious, but the ship holds steady. The Royal Guard is far behind us... for now."]);
  const [activeView, setActiveView] = useState(null); // 'map', 'notebook', 'occult'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayDay, setDisplayDay] = useState(1);

  const handleNextDay = () => {
    const next = day + 1;
    setDisplayDay(day); // Show current day first
    setActiveView(null);
    setIsTransitioning(true);
    
    // Sequence: Show current -> Change to next -> Fade out
    setTimeout(() => {
      setDisplayDay(next); // Transform to next day
      setDay(next); // Update background state
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    }, 1200);
  };

  const stats = [
    { label: 'FOOD', value: supplies.food, icon: <Coffee size={18} />, color: '#ff9d00' },
    { label: 'WATER', value: supplies.water, icon: <Droplets size={18} />, color: '#00e5ff' },
    { label: 'RUM', value: supplies.rum, icon: <Wind size={18} />, color: '#a060ff' },
    { label: 'WOOD', value: supplies.wood, icon: <Anchor size={18} />, color: '#704010' },
  ];

  const crew = [
    { role: 'CAPTAIN', status: 'HEALTHY', health: 100 },
    { role: 'NAVIGATOR', status: 'HEALTHY', health: 100 },
    { role: 'GUNNER', status: 'HEALTHY', health: 100 },
    { role: 'COOK', status: 'HEALTHY', health: 100 },
  ];

  const getCurseColor = (val) => {
    if (val < 25) return '#4ade80';
    if (val < 50) return '#facc15';
    if (val < 75) return '#fb923c';
    return '#ff3e3e';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="ship-view-container"
      style={{ 
        width: '100vw', 
        height: '100vh', 
        background: `white url('/ship_sketch.png')`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 20px 0 20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Day Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'black', 
              zIndex: 1000, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ textAlign: 'center' }}
            >
              <motion.h2 
                initial={{ letterSpacing: '20px', opacity: 0 }}
                animate={{ letterSpacing: '5px', opacity: 0.5 }}
                style={{ fontSize: '1rem', color: 'var(--text-dim)', marginBottom: '10px' }}
              >
                SURVIVAL
              </motion.h2>
              <motion.h1 
                key={displayDay}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '15px', background: 'linear-gradient(to bottom, #fff, #666)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                DAY {displayDay}
              </motion.h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', zIndex: 10 }}>
        <div className="glass-panel" style={{ padding: '10px 30px', textAlign: 'center', minWidth: '120px' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '1px' }}>JOURNEY DAY</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{day}</div>
        </div>
      </div>



      {/* Interaction Zones (Hotspots) - Now Full Screen to match background */}
      <div className="ship-interaction-zones" style={{ 
        position: 'absolute', 
        inset: 0, 
        pointerEvents: 'none',
        zIndex: 4 
      }}>
        {/* Centered Line of Chairs (Matched to Sketch) */}
        <div style={{ 
          position: 'absolute', 
          bottom: '35%', 
          left: '50%', 
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '20px',
          pointerEvents: 'none'
        }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ 
              width: '90px', 
              height: '130px', 
              border: '1px dashed rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              fontSize: '0.45rem',
              color: 'rgba(0,0,0,0.4)',
              paddingTop: '15px'
            }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', marginBottom: '10px' }}></div>
              CHAIR {i}
            </div>
          ))}
        </div>

      </div>

      {/* Main Gameplay Area (Sidebars Only) */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr 320px', gap: '20px', marginTop: '20px', zIndex: 10, pointerEvents: 'none' }}>
        {/* Left: Crew Status */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', pointerEvents: 'auto' }}>
          <h3 style={{ fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dim)' }}>
            <Users size={16} /> THE CREW
          </h3>
          {crew.map(member => (
            <div key={member.role} className="glass-panel" style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: '5px' }}>{member.role}</div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '10px' }}>STATUS: {member.status}</div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${member.health}%` }}
                  style={{ height: '100%', background: '#4ade80' }} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Center Space */}
        <div style={{ pointerEvents: 'none' }}></div>

        {/* Right: Log & Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', pointerEvents: 'auto' }}>
          <motion.div 
            whileHover={{ x: -5 }}
            onClick={() => setActiveView('notebook')}
            className="glass-panel" 
            style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
          >
            <h3 style={{ fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={16} /> CAPTAIN'S LOG
            </h3>
            <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
              {log.map((entry, i) => <p key={i} style={{ marginBottom: '15px' }}>{entry}</p>)}
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ x: -5 }}
            onClick={() => setActiveView('map')}
            className="glass-panel" 
            style={{ height: '220px', padding: '20px', background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', cursor: 'pointer' }}
          >
            <h3 style={{ fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapIcon size={14} /> ARCHIPELAGO NAV
            </h3>
            <div style={{ width: '100%', height: '120px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(0, 229, 255, 0.2)' }}>
              <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>[ MAP CLICK TO EXPAND ]</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Occult Table Hotspot (Global Layer) */}
      <motion.div 
        initial={{ x: '-50%', y: 0 }}
        animate={{ x: '-50%', y: 0 }}
        whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.02)' }}
        onClick={() => setActiveView('occult')}
        style={{ 
          position: 'absolute', 
          bottom: '0px', 
          left: '50%', 
          width: '100%',
          height: '100px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 50,
          pointerEvents: 'auto',
          transition: 'all 0.3s'
        }}
      >
        <div style={{ 
          background: 'rgba(0,0,0,0.95)', 
          padding: '10px 40px', 
          borderRadius: '20px 20px 0 0', 
          border: '1px solid #000',
          borderBottom: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          boxShadow: '0 -5px 15px rgba(0,0,0,0.2)'
        }}>
          <Skull size={18} color="#fff" />
          <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '4px' }}>
            OPEN OCCULT TABLE
          </div>
        </div>
      </motion.div>

      {/* Diegetic View Overlays */}
      <AnimatePresence>
        {activeView === 'map' && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100, display: 'flex' }}
          >
            <div className="vignette-overlay" style={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 100%)', pointerEvents: 'none' }} />
            <div className="glass-panel" style={{ width: '80%', height: '90%', margin: 'auto', position: 'relative', padding: '40px' }}>
              <button onClick={() => setActiveView(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>CLOSE</button>
              <h2 style={{ letterSpacing: '5px', marginBottom: '30px' }}>ARCHIPELAGO MAP</h2>
              <div style={{ width: '100%', height: '80%', border: '1px solid rgba(0, 229, 255, 0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1rem', opacity: 0.3 }}>[ MAP RENDERER GOES HERE ]</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'notebook' && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100, display: 'flex', background: 'rgba(0,0,0,0.8)' }}
          >
            <div className="glass-panel" style={{ width: '850px', height: '600px', margin: 'auto', position: 'relative', display: 'flex', overflow: 'hidden', padding: '0' }}>
              {/* Left Page: Crew Stats & Ship Resources */}
              <div style={{ flex: 1, padding: '40px', borderRight: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '0.7rem', letterSpacing: '3px', opacity: 0.5, marginBottom: '30px' }}>CREW MANIFEST</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                  {crew.map(m => (
                    <div key={m.role} style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#4ade80' }}>{m.role}</div>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Coffee size={14} color="#ff9d00" />
                          <span style={{ fontSize: '0.8rem' }}>2</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Droplets size={14} color="#00e5ff" />
                          <span style={{ fontSize: '0.8rem' }}>3</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '30px' }}>
                  <h3 style={{ fontSize: '0.7rem', letterSpacing: '3px', opacity: 0.5, marginBottom: '20px' }}>SHIP RESOURCES</h3>
                  <div style={{ display: 'flex', gap: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Wind size={20} color="#a060ff" />
                      <div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>RUM</div>
                        <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{supplies.rum}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Anchor size={20} color="#704010" />
                      <div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>WOOD</div>
                        <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{supplies.wood}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Page: Journal */}
              <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '0.7rem', letterSpacing: '3px', opacity: 0.5 }}>CAPTAIN'S LOG: DAY {day}</h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <ChevronRight size={20} style={{ transform: 'rotate(180deg)', opacity: 0.3 }} />
                    <ChevronRight size={20} />
                  </div>
                </div>
                <div style={{ flex: 1, fontSize: '1rem', lineHeight: '1.8', fontStyle: 'italic', color: 'var(--text-main)' }}>
                  {log[log.length-1]}
                </div>
                <div style={{ display: 'flex', gap: '15px', alignSelf: 'flex-end' }}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    onClick={handleNextDay} 
                    style={{ padding: '12px 30px', background: 'rgba(255, 62, 62, 0.2)', border: '1px solid rgba(255, 62, 62, 0.4)', color: 'white', cursor: 'pointer', fontWeight: 800, letterSpacing: '2px' }}
                  >
                    NEXT DAY
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setActiveView(null)} 
                    style={{ padding: '12px 30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: 800, letterSpacing: '2px' }}
                  >
                    CLOSE JOURNAL
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'occult' && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100, display: 'flex', background: 'rgba(10, 0, 20, 0.9)' }}
          >
            <div className="vignette-overlay" style={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.9) 100%)', pointerEvents: 'none' }} />
            <div className="glass-panel" style={{ width: '90%', height: '85%', margin: 'auto', padding: '40px', border: '1px solid #a060ff', position: 'relative' }}>
              {/* Curse Status Bar */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#a060ff', fontWeight: 800, letterSpacing: '2px', fontSize: '0.8rem' }}>SEA CURSE POTENTIAL</span>
                  <span style={{ color: getCurseColor(seaCurse), fontWeight: 900 }}>{seaCurse}%</span>
                </div>
                <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${seaCurse}%` }}
                    style={{ height: '100%', background: getCurseColor(seaCurse), boxShadow: `0 0 15px ${getCurseColor(seaCurse)}` }}
                  />
                </div>
              </div>

              <button onClick={() => setActiveView(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '5px 15px', cursor: 'pointer' }}>CLOSE</button>
              <h2 style={{ color: '#a060ff', letterSpacing: '10px', fontSize: '2rem' }}>THE OCCULT TABLE</h2>
              
              <div style={{ marginTop: '50px', display: 'flex', gap: '60px' }}>
                <div style={{ flex: 1, height: '400px', border: '1px solid rgba(160, 96, 255, 0.2)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(160, 96, 255, 0.05)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Skull size={80} color="rgba(160, 96, 255, 0.4)" style={{ marginBottom: '20px' }} />
                    <BookOpen size={40} color="rgba(160, 96, 255, 0.3)" />
                  </div>
                </div>
                <div style={{ flex: 1.5 }}>
                  <h3 style={{ color: '#a060ff', marginBottom: '20px', letterSpacing: '3px' }}>DARK RITUALS</h3>
                  <div style={{ color: 'var(--text-dim)', lineHeight: '1.8', fontSize: '1.1rem' }}>
                    <p style={{ marginBottom: '20px' }}>The skull of the first navigator whispers secrets of the deep. Potions brewed from kraken ink and siren tears can stall the inevitable, but the Sea Curse never truly sleeps.</p>
                    <div style={{ padding: '20px', background: 'rgba(160, 96, 255, 0.1)', borderLeft: '4px solid #a060ff', fontStyle: 'italic' }}>
                      "Blood for wood, souls for rum. The archipelago demands a price for every league traveled."
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('intro');
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(80);
  const [characters, setCharacters] = useState([]);
  const [selectedChar, setSelectedChar] = useState(null);
  const [difficulty, setDifficulty] = useState('MEDIUM');

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

  if (currentPage === 'gameplay') {
    return <ShipView difficulty={difficulty} onExit={() => setCurrentPage('intro')} />;
  }

  return (
    <div className="game-container" style={{ filter: `brightness(${brightness}%)` }}>
      {/* Sidebar Navigation */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="glass-panel"
        style={{ width: '300px', height: '90vh', margin: 'auto 20px', padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <h1 style={{ fontFamily: 'Outfit', fontSize: '2.5rem', fontWeight: 800, marginBottom: '40px', background: 'linear-gradient(45deg, #ff3e3e, #ff9d00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '4px' }}>
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
              style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}
            >
              <div className="glass-panel" style={{ width: '600px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {['TUTORIAL', 'MEDIUM', 'HARD', 'DEMONIC'].map((mode) => (
                  <motion.button
                    key={mode}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDifficulty(mode)}
                    style={{ 
                      padding: '30px', 
                      background: difficulty === mode ? 'rgba(255, 62, 62, 0.3)' : 'rgba(255, 62, 62, 0.1)', 
                      border: difficulty === mode ? '2px solid #ff3e3e' : '1px solid var(--accent-primary)',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {mode}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(255, 62, 62, 0.4)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage('gameplay')}
                className="glass-panel"
                style={{ 
                  padding: '20px 60px', 
                  fontSize: '1.5rem', 
                  fontWeight: 900, 
                  color: 'white', 
                  background: 'linear-gradient(45deg, #ff3e3e, #ff9d00)',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '5px'
                }}
              >
                START EXPEDITION
              </motion.button>
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
