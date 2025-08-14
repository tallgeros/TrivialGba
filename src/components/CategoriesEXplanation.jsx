import React, { useState } from 'react';
import './categoriesExplanation.css';

const CategoriesExplanation = ({ selectedTheme, onStartGame, onBackToThemes }) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const themeInfo = {
    normal: {
      name: 'Trivial Clásico',
      icon: '🎲',
      color: '#4A90E2',
      description: 'Conocimiento general tradicional'
    },
    lotr: {
      name: 'El Señor de los Anillos',
      icon: '💍',
      color: '#B8860B',
      description: 'Aventuras en la Tierra Media'
    },
    batman: {
      name: 'DC / Batman',
      icon: '🦇',
      color: '#2C3E50',
      description: 'El Universo DC Comics'
    },
    marvel: {
      name: 'Marvel',
      icon: '🕷️',
      color: '#E53935',
      description: 'Universo Cinematográfico Marvel'
    },
    harryPotter: {
      name: 'Harry Potter',
      icon: '⚡',
      color: '#722F37',
      description: 'Mundo Mágico de Hogwarts'
    },
    starWars: {
      name: 'Star Wars',
      icon: '⭐',
      color: '#FFD700',
      description: 'Una galaxia muy, muy lejana'
    }
  };

  const categoriesData = {
    normal: {
      history: {
        name: 'Historia',
        emoji: '📚',
        color: '#8B4513',
        description: 'Eventos históricos, personajes importantes, fechas clave y civilizaciones antiguas'
      },
      sports: {
        name: 'Deportes',
        emoji: '⚽',
        color: '#FF8C00',
        description: 'Deportes de todo el mundo, récords, atletas famosos y competiciones internacionales'
      },
      entertainment: {
        name: 'Entretenimiento',
        emoji: '🎬',
        color: '#FFD700',
        description: 'Películas, música, televisión, celebridades y cultura popular'
      },
      science: {
        name: 'Ciencias',
        emoji: '🔬',
        color: '#32CD32',
        description: 'Biología, química, física, astronomía y descubrimientos científicos'
      },
      geography: {
        name: 'Geografía',
        emoji: '🌍',
        color: '#4169E1',
        description: 'Países, capitales, ríos, montañas y características geográficas mundiales'
      },
      art: {
        name: 'Arte',
        emoji: '🎨',
        color: '#FF69B4',
        description: 'Pintura, escultura, literatura, arquitectura y movimientos artísticos'
      }
    },
    lotr: {
      history: {
        name: 'Historia',
        emoji: '📚',
        color: '#8B4513',
        description: 'Cronología de la Tierra Media, Edades, batallas épicas y eventos históricos'
      },
      sports: {
        name: 'Combates',
        emoji: '⚔️',
        color: '#FF8C00',
        description: 'Batallas, armas, estrategias militares, duelos y hazañas guerreras'
      },
      entertainment: {
        name: 'Películas',
        emoji: '🎬',
        color: '#FFD700',
        description: 'Trilogías de Jackson, actores, banda sonora, efectos especiales y producción'
      },
      science: {
        name: 'Magia',
        emoji: '🔮',
        color: '#32CD32',
        description: 'Poderes mágicos, Istari, Anillos de Poder, criaturas mágicas y hechizos'
      },
      geography: {
        name: 'Lugares',
        emoji: '🏔️',
        color: '#4169E1',
        description: 'Regiones, ciudades, fortalezas, montañas, ríos y reinos de la Tierra Media'
      },
      art: {
        name: 'Cultura',
        emoji: '🎭',
        color: '#FF69B4',
        description: 'Razas, idiomas, tradiciones, canciones, poemas y cultura de los pueblos'
      }
    },
    batman: {
      history: {
        name: 'Historia',
        emoji: '📚',
        color: '#8B4513',
        description: 'Cronología DC, Crisis multiversales, eventos importantes y líneas temporales'
      },
      sports: {
        name: 'Combates',
        emoji: '👊',
        color: '#FF8C00',
        description: 'Peleas épicas, técnicas de combate, enfrentamientos y batallas heroicas'
      },
      entertainment: {
        name: 'Medios',
        emoji: '🎬',
        color: '#FFD700',
        description: 'Películas, series, animated series, videojuegos y adaptaciones'
      },
      science: {
        name: 'Tecnología',
        emoji: '🦾',
        color: '#32CD32',
        description: 'Gadgets, tecnología avanzada, inventos científicos y laboratorios'
      },
      geography: {
        name: 'Lugares',
        emoji: '🏙️',
        color: '#4169E1',
        description: 'Gotham, Metrópolis, Central City, dimensiones y ubicaciones DC'
      },
      art: {
        name: 'Creadores',
        emoji: '✏️',
        color: '#FF69B4',
        description: 'Artistas, escritores, creadores de personajes y evolución del arte'
      }
    },
    marvel: {
      history: {
        name: 'Historia',
        emoji: '📚',
        color: '#8B4513',
        description: 'Cronología Marvel, eventos cósmicos, guerras secretas y líneas temporales'
      },
      sports: {
        name: 'Poderes',
        emoji: '💪',
        color: '#FF8C00',
        description: 'Superpoderes, habilidades especiales, mutantes y transformaciones'
      },
      entertainment: {
        name: 'MCU',
        emoji: '🎬',
        color: '#FFD700',
        description: 'Películas MCU, series, actores, cameos de Stan Lee y conexiones'
      },
      science: {
        name: 'Ciencia',
        emoji: '🧪',
        color: '#32CD32',
        description: 'Experimentos, tecnología, científicos locos, mutaciones y laboratorios'
      },
      geography: {
        name: 'Universo',
        emoji: '🌌',
        color: '#4169E1',
        description: 'Planetas, dimensiones, Wakanda, Asgard y ubicaciones cósmicas'
      },
      art: {
        name: 'Creadores',
        emoji: '✏️',
        color: '#FF69B4',
        description: 'Stan Lee, Jack Kirby, Steve Ditko y otros artistas legendarios'
      }
    },
    harryPotter: {
      history: {
        name: 'Historia',
        emoji: '📚',
        color: '#8B4513',
        description: 'Historia del mundo mágico, fundadores de Hogwarts, guerras mágicas y cronología'
      },
      sports: {
        name: 'Quidditch',
        emoji: '🏆',
        color: '#FF8C00',
        description: 'Deporte mágico, equipos, reglas, Copa del Mundo y partidos épicos'
      },
      entertainment: {
        name: 'Películas',
        emoji: '🎬',
        color: '#FFD700',
        description: 'Saga cinematográfica, actores, escenas memorables y banda sonora'
      },
      science: {
        name: 'Magia',
        emoji: '🔮',
        color: '#32CD32',
        description: 'Hechizos, pociones, criaturas mágicas, varitas y artes oscuras'
      },
      geography: {
        name: 'Lugares',
        emoji: '🏰',
        color: '#4169E1',
        description: 'Hogwarts, Callejón Diagón, lugares mágicos y geografía del mundo mágico'
      },
      art: {
        name: 'Cultura',
        emoji: '📖',
        color: '#FF69B4',
        description: 'Casas de Hogwarts, tradiciones mágicas, símbolos y cultura wizarding'
      }
    },
    starWars: {
      history: {
        name: 'Historia',
        emoji: '📚',
        color: '#8B4513',
        description: 'Cronología galáctica, guerras, eras, República, Imperio y Primera Orden'
      },
      sports: {
        name: 'Combates',
        emoji: '⚔️',
        color: '#FF8C00',
        description: 'Duelos de sables de luz, batallas espaciales, combates épicos y estrategias'
      },
      entertainment: {
        name: 'Películas/Series',
        emoji: '🎬',
        color: '#FFD700',
        description: 'Saga cinematográfica, series, spin-offs, actores y producción'
      },
      science: {
        name: 'La Fuerza',
        emoji: '🌌',
        color: '#32CD32',
        description: 'Jedis, Siths, poderes de la Fuerza, profecías y lado oscuro'
      },
      geography: {
        name: 'Galaxia',
        emoji: '🪐',
        color: '#4169E1',
        description: 'Planetas, sistemas estelares, estaciones espaciales y ubicaciones icónicas'
      },
      art: {
        name: 'Universo',
        emoji: '🚀',
        color: '#FF69B4',
        description: 'Razas alienígenas, tecnología, naves, droides y cultura galáctica'
      }
    }
  };

  const currentTheme = themeInfo[selectedTheme];
  const categories = Object.values(categoriesData[selectedTheme]);
  const currentCategory = categories[currentCategoryIndex];

  const nextCategory = () => {
    setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
  };

  const prevCategory = () => {
    setCurrentCategoryIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  return (
    <div className="categories-container">
      <div className="header">
        <button className="back-button" onClick={onBackToThemes}>
          ← Cambiar Tema
        </button>
        
        <div className="theme-header">
          <div className="theme-icon">{currentTheme.icon}</div>
          <div className="theme-info">
            <h1>{currentTheme.name}</h1>
            <p>{currentTheme.description}</p>
          </div>
        </div>
      </div>

      <div className="explanation-section">
        <h2>Conoce las Categorías</h2>
        <p>Cada color representa un tipo de pregunta diferente:</p>
      </div>

      <div className="categories-showcase">
        <div className="categories-overview">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`category-dot ${index === currentCategoryIndex ? 'active' : ''}`}
              style={{ backgroundColor: category.color }}
              onClick={() => setCurrentCategoryIndex(index)}
            >
              <span className="category-emoji">{category.emoji}</span>
            </div>
          ))}
        </div>

        <div className="category-detail">
          <div className="category-navigation">
            <button className="nav-button" onClick={prevCategory}>
              ‹
            </button>
            
            <div 
              className="category-card"
              style={{ 
                backgroundColor: currentCategory.color,
                boxShadow: `0 20px 60px ${currentCategory.color}40`
              }}
            >
              <div className="category-icon">
                {currentCategory.emoji}
              </div>
              <h3>{currentCategory.name}</h3>
              <p>{currentCategory.description}</p>
            </div>
            
            <button className="nav-button" onClick={nextCategory}>
              ›
            </button>
          </div>
        </div>

        <div className="progress-indicator">
          {currentCategoryIndex + 1} / {categories.length}
        </div>
      </div>

      <div className="start-section">
        <div className="game-info">
          <h3>¿Listo para el desafío?</h3>
          <p>Responde preguntas de las 6 categorías y demuestra tu dominio del tema</p>
        </div>
        
        <button 
          className="start-game-button"
          onClick={onStartGame}
          style={{ backgroundColor: currentTheme.color }}
        >
          <span>¡Comenzar Partida!</span>
          <div className="button-glow"></div>
        </button>
      </div>
    </div>
  );
};

export default CategoriesExplanation;


