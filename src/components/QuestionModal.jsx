;import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParticleEffects from "./ParticleEffects";
import { questionsDatabase } from "../data/questions/index";
import "./questionModal.css";

const modalVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "100%" },
};

const THEME_CATEGORIES = {
  normal: {
    history: { name: "Historia", emoji: "📚", color: "#8B4513" },
    sports: { name: "Deportes", emoji: "⚽", color: "#FF8C00" },
    entertainment: { name: "Entretenimiento", emoji: "🎬", color: "#FFD700" },
    science: { name: "Ciencias", emoji: "🔬", color: "#32CD32" },
    geography: { name: "Geografía", emoji: "🌍", color: "#4169E1" },
    art: { name: "Arte", emoji: "🎨", color: "#FF69B4" },
  },
  lotr: {
    history: { name: "Historia", emoji: "📚", color: "#8B4513" },
    sports: { name: "Combates", emoji: "⚔️", color: "#FF8C00" },
    entertainment: { name: "Películas", emoji: "🎬", color: "#FFD700" },
    science: { name: "Magia", emoji: "🔮", color: "#32CD32" },
    geography: { name: "Lugares", emoji: "🏔️", color: "#4169E1" },
    art: { name: "Cultura", emoji: "🎭", color: "#FF69B4" },
  },
};

export default function QuestionModal({
  visible,
  category,
  selectedTheme = "normal",
  onAnswer,
  onClose,
  isCheeseCell = false,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (visible) {
      if (window.innerWidth <= 600) {
        document.body.style.overflow = "hidden";
      }
    } else {
      document.body.style.overflow = "";
    }
  }, [visible]);

  const getCategoryInfo = () => {
    const themeCategories =
      THEME_CATEGORIES[selectedTheme] || THEME_CATEGORIES.normal;
    return themeCategories[category] || themeCategories.history;
  };
  const categoryInfo = getCategoryInfo();

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

  useEffect(() => {
    if (!visible || showResult) return;
    if (timeLeft === 0) {
      handleTimeout();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [visible, timeLeft, showResult]);

  function loadRandomQuestion() {
    const questions = questionsDatabase[selectedTheme]?.[category] || [];
    if (questions.length > 0) {
      const qIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestion(questions[qIndex]);
    } else {
      const tempQuestion = {
        question: `¿Pregunta de ${
          categoryInfo.name
        } - ${selectedTheme.toUpperCase()}?`,
        options: ["Opción A", "Opción B", "Opción C", "Opción D"],
        correctAnswer: 1,
        explanation: `Esta es una pregunta de prueba para la categoría ${categoryInfo.name} del tema ${selectedTheme}.`,
        image: `https://via.placeholder.com/400x200/${categoryInfo.color.replace(
          "#",
          ""
        )}/FFFFFF?text=${categoryInfo.emoji}+${categoryInfo.name}`,
      };
      setCurrentQuestion(tempQuestion);
    }

    setSelectedAnswer(null);
    setShowResult(false);
    setShowParticles(false);
    setTimeLeft(30);
  }
const handleParticlesComplete = () => {
    setShowParticles(false);
  }
  function handleTimeout() {
    setShowResult(true);
    setIsCorrect(false);

    // setTimeout(() => setShowParticles(true), 5000); // 5 segundos

    setTimeout(() => {
      onAnswer && onAnswer(false, isCheeseCell);
      onClose && onClose();
    }, 10000); // 5s resultado + 5s partículas
  }

  function handleAnswerSelect(index) {
    if (showResult) return;
    setSelectedAnswer(index);
    const correct = index === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    setTimeout(() => setShowParticles(true), 6000); // 5 segundos

    setTimeout(() => {
      onAnswer && onAnswer(correct, isCheeseCell);
      onClose && onClose();
    }, 10000); // 5s resultado + 5s partículas
  }

  const renderOptions = () => {
    if (!currentQuestion || !currentQuestion.options) return null;

    const buttons = [];
    for (let i = 0; i < currentQuestion.options.length; i++) {
      const option = currentQuestion.options[i];

      let buttonClass = "option-button";

      if (showResult) {
        if (i === selectedAnswer && isCorrect) {
          buttonClass += " option-correct-selected";
        } else if (i === selectedAnswer && !isCorrect) {
          buttonClass += " option-wrong-selected";
        } else if (i === currentQuestion.correctAnswer) {
          buttonClass += " option-correct-answer";
        }
      }

      buttons.push(
        <button
          key={i}
          onClick={() => handleAnswerSelect(i)}
          disabled={showResult}
          className={buttonClass}
          style={{
            borderColor: !showResult ? "#00d4ff" : undefined,
          }}
          onMouseEnter={(e) => {
            if (!showResult) {
              e.target.style.borderColor = categoryInfo.color;
            }
          }}
          onMouseLeave={(e) => {
            if (!showResult) {
              e.target.style.borderColor = "#00d4ff";
            }
          }}
        >
          <strong style={{ color: categoryInfo.color }}>
            {String.fromCharCode(65 + i)}.
          </strong>{" "}
          {option}
        </button>
      );
    }
    return buttons;
  };

  if (!visible || !currentQuestion || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <div className="question-modal-overlay">
          <motion.div
            className="question-modal-container"
            style={{ borderColor: categoryInfo.color }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {showParticles && (
              <ParticleEffects
                type={isCorrect ? "fireworks" : "bomb"}
                isVisible={showParticles}
                onComplete={handleParticlesComplete}
              />
            )}
            <div
              className="modal-content"
              style={{
                opacity: showParticles ? 0 : 1,
                visibility: showParticles ? "hidden" : "visible",
                transition: "opacity 0.3s ease, visibility 0.3s ease",
              }}
            >
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
                  <span className="cheese-badge">🧀 QUESITO</span>
                )}
                <span
                  className={`timer ${timeLeft <= 10 ? "timer-warning" : ""}`}
                >
                  ⏱️ {timeLeft}s
                </span>
              </div>

              <div className="question-content-area">
                {!showResult ? (
                  <img
                    src={
                      currentQuestion.image ||
                      `https://via.placeholder.com/400x200/${categoryInfo.color.replace(
                        "#",
                        ""
                      )}/FFFFFF?text=${categoryInfo.emoji}+${categoryInfo.name}`
                    }
                    alt="Pregunta"
                    className="question-image"
                  />
                ) : (
                  <div
                    className={`result-container ${
                      isCorrect ? "result-success" : "result-error"
                    }`}
                  >
                    <div
                      className={`result-title ${
                        isCorrect ? "title-success" : "title-error"
                      }`}
                    >
                      {isCorrect ? "🎉 ¡CORRECTO! 🎉" : "💥 ¡INCORRECTO! 💥"}
                    </div>
                    <div className="result-explanation">
                      {currentQuestion.explanation}
                    </div>
                    {isCorrect && (
                      <div className="points-earned">
                        ✨ {isCheeseCell ? "+1 QUESITO 🧀" : "sigue jugando ⭐"}{" "}
                        ✨
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="question-text">{currentQuestion.question}</div>
              <div className="options-container">{renderOptions()}</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

