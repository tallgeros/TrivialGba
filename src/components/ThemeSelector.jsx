import React, { useState } from 'react';
import './themeSelector.css';

const ThemeSelector = ({ onThemeSelected }) => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [hoveredTheme, setHoveredTheme] = useState(null);

  const themes = {
    normal: {
      id: 'normal',
      name: 'Trivial Clásico',
      subtitle: 'Conocimiento general tradicional',
      icon: '🎲',
      color: '#4A90E2',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: 'El trivial de toda la vida con preguntas de cultura general'
    },
    lotr: {
      id: 'lotr',
      name: 'El Señor de los Anillos',
      subtitle: 'Aventuras en la Tierra Media',
      icon: '💍',
      color: '#B8860B',
      gradient: 'linear-gradient(135deg, #DAA520 0%, #8B6914 100%)',
      description: 'Sumérgete en el mundo de Tolkien y demuestra tu conocimiento sobre la Tierra Media'
    },
    batman: {
      id: 'batman',
      name: 'DC / Batman',
      subtitle: 'El Universo DC Comics',
      icon: '🦇',
      color: '#2C3E50',
      gradient: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
      description: 'Gotham City te llama. Pon a prueba tus conocimientos del Universo DC'
    },
    marvel: {
      id: 'marvel',
      name: 'Marvel',
      subtitle: 'Universo Cinematográfico Marvel',
      icon: '🕷️',
      color: '#E53935',
      gradient: 'linear-gradient(135deg, #E53935 0%, #C62828 100%)',
      description: 'Con grandes conocimientos vienen grandes responsabilidades. ¿Estás listo?'
    },
    harryPotter: {
      id: 'harryPotter',
      name: 'Harry Potter',
      subtitle: 'Mundo Mágico de Hogwarts',
      icon: '⚡',
      color: '#722F37',
      gradient: 'linear-gradient(135deg, #722F37 0%, #8B3A3A 100%)',
      description: 'Demuestra tu conocimiento del mundo mágico de Harry Potter'
    },
    starWars: {
      id: 'starWars',
      name: 'Star Wars',
      subtitle: 'Una galaxia muy, muy lejana',
      icon: '⭐',
      color: '#FFD700',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      description: 'Que la Fuerza te acompañe en este desafío galáctico'
    }
  };

  const handleThemeClick = (themeId) => {
    setSelectedTheme(themeId);
  };

  const handleStartGame = () => {
    if (selectedTheme && onThemeSelected) {
      onThemeSelected(selectedTheme);
    }
  };

  return (
    <div className="theme-selector-container">
      <div className="header-section">
        <h1 className="main-title">
          <span className="title-icon">🎯</span>
          Trivial Pursuit
        </h1>
        <p className="main-subtitle">
          Elige tu universo favorito y demuestra tus conocimientos
        </p>
      </div>

      <div className="themes-grid">
        {Object.values(themes).map((theme) => (
          <div
            key={theme.id}
            className={`theme-card ${selectedTheme === theme.id ? 'selected' : ''} ${hoveredTheme === theme.id ? 'hovered' : ''}`}
            onClick={() => handleThemeClick(theme.id)}
            onMouseEnter={() => setHoveredTheme(theme.id)}
            onMouseLeave={() => setHoveredTheme(null)}
            style={{
              '--theme-color': theme.color,
              '--theme-gradient': theme.gradient
            }}
          >
            <div className="card-glow"></div>
            <div className="card-content">
              <div className="theme-icon">{theme.icon}</div>
              <h3 className="theme-name">{theme.name}</h3>
              <p className="theme-subtitle">{theme.subtitle}</p>
              <p className="theme-description">{theme.description}</p>
              
              <div className="selection-indicator">
                {selectedTheme === theme.id && (
                  <div className="checkmark">✓</div>
                )}
              </div>
            </div>
            
            <div className="card-border"></div>
          </div>
        ))}
      </div>

      {selectedTheme && (
        <div className="continue-section">
          <button
            className="continue-button"
            onClick={handleStartGame}
            style={{ '--selected-color': themes[selectedTheme].color }}
          >
            <span>Continuar con {themes[selectedTheme].name}</span>
            <div className="button-arrow">→</div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;