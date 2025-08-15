// src/components/QuestionModal.jsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ParticleEffects from './ParticleEffects';
import { questionsDatabase } from '../data/questions/index';
import './questionModal.css';

// Categorías dinámicas por tema (igual que en CategoriesExplanation)
const THEME_CATEGORIES = {
  normal: {
    history: {
      name: 'Historia',
      emoji: '📚',
      color: '#8B4513',
    },
    sports: {
      name: 'Deportes',
      emoji: '⚽',
      color: '#FF8C00',
    },
    entertainment: {
      name: 'Entretenimiento',
      emoji: '🎬',
      color: '#FFD700',
    },
    science: {
      name: 'Ciencias',
      emoji: '🔬',
      color: '#32CD32',
    },
    geography: {
      name: 'Geografía',
      emoji: '🌍',
      color: '#4169E1',
    },
    art: {
      name: 'Arte',
      emoji: '🎨',
      color: '#FF69B4',
    }
  },
  lotr: {
    history: {
      name: 'Historia',
      emoji: '📚',
      color: '#8B4513',
    },
    sports: {
      name: 'Combates',
      emoji: '⚔️',
      color: '#FF8C00',
    },
    entertainment: {
      name: 'Películas',
      emoji: '🎬',
      color: '#FFD700',
    },
    science: {
      name: 'Magia',
      emoji: '🔮',
      color: '#32CD32',
    },
    geography: {
      name: 'Lugares',
      emoji: '🏔️',
      color: '#4169E1',
    },
    art: {
      name: 'Cultura',
      emoji: '🎭',
      color: '#FF69B4',
    }
  },
  batman: {
    history: {
      name: 'Historia',
      emoji: '📚',
      color: '#8B4513',
    },
    sports: {
      name: 'Combates',
      emoji: '👊',
      color: '#FF8C00',
    },
    entertainment: {
      name: 'Medios',
      emoji: '🎬',
      color: '#FFD700',
    },
    science: {
      name: 'Tecnología',
      emoji: '🦾',
      color: '#32CD32',
    },
    geography: {
      name: 'Lugares',
      emoji: '🏙️',
      color: '#4169E1',
    },
    art: {
      name: 'Creadores',
      emoji: '✏️',
      color: '#FF69B4',
    }
  },
  marvel: {
    history: {
      name: 'Historia',
      emoji: '📚',
      color: '#8B4513',
    },
    sports: {
      name: 'Poderes',
      emoji: '💪',
      color: '#FF8C00',
    },
    entertainment: {
      name: 'MCU',
      emoji: '🎬',
      color: '#FFD700',
    },
    science: {
      name: 'Ciencia',
      emoji: '🧪',
      color: '#32CD32',
    },
    geography: {
      name: 'Universo',
      emoji: '🌌',
      color: '#4169E1',
    },
    art: {
      name: 'Creadores',
      emoji: '✏️',
      color: '#FF69B4',
    }
  },
  harryPotter: {
    history: {
      name: 'Historia',
      emoji: '📚',
      color: '#8B4513',
    },
    sports: {
      name: 'Quidditch',
      emoji: '🏆',
      color: '#FF8C00',
    },
    entertainment: {
      name: 'Películas',
      emoji: '🎬',
      color: '#FFD700',
    },
    science: {
      name: 'Magia',
      emoji: '🔮',
      color: '#32CD32',
    },
    geography: {
      name: 'Lugares',
      emoji: '🏰',
      color: '#4169E1',
    },
    art: {
      name: 'Cultura',
      emoji: '📖',
      color: '#FF69B4',
    }
  },
  starWars: {
    history: {
      name: 'Historia',
      emoji: '📚',
      color: '#8B4513',
    },
    sports: {
      name: 'Combates',
      emoji: '⚔️',
      color: '#FF8C00',
    },
    entertainment: {
      name: 'Películas/Series',
      emoji: '🎬',
      color: '#FFD700',
    },
    science: {
      name: 'La Fuerza',
      emoji: '🌌',
      color: '#32CD32',
    },
    geography: {
      name: 'Galaxia',
      emoji: '🪐',
      color: '#4169E1',
    },
    art: {
      name: 'Universo',
      emoji: '🚀',
      color: '#FF69B4',
    }
  }
};

export default function QuestionModal({
  visible,
  category,
  selectedTheme = 'normal',
  onAnswer,
  onClose,
  isCheeseCell = false
}) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Obtener información de la categoría según el tema seleccionado
  const getCategoryInfo = () => {
    const themeCategories = THEME_CATEGORIES[selectedTheme] || THEME_CATEGORIES.normal;
    return themeCategories[category] || themeCategories.history;
  };

  const categoryInfo = getCategoryInfo();

  // Cargar y mostrar pregunta al abrir
  useEffect(() => {
    if (visible && category) {
      loadRandomQuestion();
      setShowResult(false);
      setTimeLeft(30);
      setShowParticles(false);
    }
    if (!visible) {
      setSelectedAnswer(null);
      setShowResult(false);
      setCurrentQuestion(null);
      setShowParticles(false);
    }
  }, [visible, category, selectedTheme]);

  // Timer
  useEffect(() => {
    if (!visible || showResult) return;
    if (timeLeft === 0) {
      handleTimeout();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [visible, timeLeft, showResult]);

  function loadRandomQuestion() {
    const questions = questionsDatabase[selectedTheme]?.[category] || [];
    if (questions.length > 0) {
      const qIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestion(questions[qIndex]);
    } else {
      // Pregunta temporal si no hay base de datos para este tema/categoría
      const tempQuestion = {
        question: `¿Pregunta de ${categoryInfo.name} - ${selectedTheme.toUpperCase()}?`,
        options: ["Opción A", "Opción B", "Opción C", "Opción D"],
        correctAnswer: 1,
        explanation: `Esta es una pregunta de prueba para la categoría ${categoryInfo.name} del tema ${selectedTheme}.`,
        image: `https://via.placeholder.com/400x200/${categoryInfo.color.replace('#', '')}/FFFFFF?text=${categoryInfo.emoji}+${categoryInfo.name}`
      };
      setCurrentQuestion(tempQuestion);
    }
    
    setSelectedAnswer(null);
    setShowResult(false);
    setShowParticles(false);
    setTimeLeft(30);
  }

  function handleTimeout() {
    setShowResult(true);
    setIsCorrect(false);
    
    setTimeout(() => {
      setShowParticles(true);
    }, 3000);
    
    setTimeout(() => {
      onAnswer && onAnswer(false, isCheeseCell);
      onClose && onClose();
    }, 2000);
  }

  function handleAnswerSelect(index) {
    if (showResult) return;
    setSelectedAnswer(index);
    const correct = index === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Secuencia: 1. Mostrar resultado por 2 segundos, 2. Mostrar partículas por 3 segundos, 3. Cerrar
    setTimeout(() => {
      setShowParticles(true);
    }, 2000);
    
    setTimeout(() => {
      onAnswer && onAnswer(correct, isCheeseCell);
      onClose && onClose();
    }, 7000);
  }

  const handleParticlesComplete = () => {
    setShowParticles(false);
  };

  // RENDERIZAR OPCIONES CON FOR LOOP (FIX PARA OPERA/EDGE)
  const renderOptions = () => {
    if (!currentQuestion || !currentQuestion.options) return null;
    
    const buttons = [];
    for (let i = 0; i < currentQuestion.options.length; i++) {
      const option = currentQuestion.options[i];
      
      let buttonClass = 'option-button';
      
      if (showResult) {
        if (i === selectedAnswer && isCorrect) {
          buttonClass += ' option-correct-selected';
        } else if (i === selectedAnswer && !isCorrect) {
          buttonClass += ' option-wrong-selected';
        } else if (i === currentQuestion.correctAnswer) {
          buttonClass += ' option-correct-answer';
        }
      }

      buttons.push(
        <button
          key={i}
          onClick={() => handleAnswerSelect(i)}
          disabled={showResult}
          className={buttonClass}
          style={{
            borderColor: !showResult ? '#00d4ff' : undefined
          }}
          onMouseEnter={(e) => {
            if (!showResult) {
              e.target.style.borderColor = categoryInfo.color;
            }
          }}
          onMouseLeave={(e) => {
            if (!showResult) {
              e.target.style.borderColor = '#00d4ff';
            }
          }}
        >
          <strong style={{ color: categoryInfo.color }}>
            {String.fromCharCode(65+i)}.
          </strong> {option}
        </button>
      );
    }
    
    return buttons;
  };

  if (!visible || !currentQuestion) return null;
  if (!mounted) return null;

  const modalContent = (
    <div 
      className="question-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="question-modal-container" 
        style={{ 
          borderColor: categoryInfo.color
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Efectos de partículas - El componente se encarga de TODO */}
        {showParticles && (
          <ParticleEffects 
            type={isCorrect ? 'fireworks' : 'bomb'} 
            isVisible={showParticles}
            onComplete={handleParticlesComplete}
          />
        )}

        {/* TODO EL CONTENIDO DEL MODAL - Se oculta completamente durante las partículas */}
        <div 
          className="modal-content"
          style={{ 
            opacity: showParticles ? 0 : 1,
            visibility: showParticles ? 'hidden' : 'visible',
            transition: 'opacity 0.3s ease, visibility 0.3s ease'
          }}
        >
          {/* Header */}
          <div 
            className="question-modal-header"
            style={{
              background: `linear-gradient(135deg, ${categoryInfo.color}, ${categoryInfo.color}dd)`,
            }}
          >
            <span className="category-label">
              {categoryInfo.emoji} {categoryInfo.name}
            </span>
            {isCheeseCell && (
              <span className="cheese-badge">
                🧀 QUESITO
              </span>
            )}
            <span 
              className={`timer ${timeLeft <= 10 ? 'timer-warning' : ''}`}
            >
              ⏱️ {timeLeft}s
            </span>
            <button 
              className="close-button"
              onClick={onClose}
            >
              ✖
            </button>
          </div>

          {/* Área de imagen/resultado */}
          <div className="question-content-area">
            {!showResult ? (
              // Estado inicial - MOSTRAR IMAGEN
              <img 
                src={currentQuestion.image || `https://via.placeholder.com/400x200/${categoryInfo.color.replace('#', '')}/FFFFFF?text=${categoryInfo.emoji}+${categoryInfo.name}`}
                alt="Pregunta" 
                className="question-image"
              />
            ) : (
              // Mostrar resultado - MENSAJE BRILLANTE
              <div className={`result-container ${isCorrect ? 'result-success' : 'result-error'}`}>
                <div className={`result-title ${isCorrect ? 'title-success' : 'title-error'}`}>
                  {isCorrect ? '🎉 ¡CORRECTO! 🎉' : '💥 ¡INCORRECTO! 💥'}
                </div>
                
                <div className="result-explanation">
                  {currentQuestion.explanation}
                </div>
                
                {isCorrect && (
                  <div className="points-earned">
                    ✨ {isCheeseCell ? '+1 QUESITO 🧀' : 'sigue jugando ⭐'} ✨
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pregunta */}
          <div className="question-text">
            {currentQuestion.question}
          </div>

          {/* Opciones - AHORA CON FOR LOOP */}
          <div className="options-container">
            {renderOptions()}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

