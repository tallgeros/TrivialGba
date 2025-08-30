import React, { useState, useEffect } from "react";
import { boardCells } from "../data/boardCells";
import { categories } from "../data/categories";
import {
  getCellPosition,
  BOARD_SIZE,
  CENTER_SIZE,
  PLAYER_COLORS,
} from "../data/boardUtils";
import { Cell } from "./Cell";
import { Player } from "./Player";
import { CategoryStatus } from "./CategoryStatus";
import DiceComponent from "./DiceComponent";
import QuestionModal from "./QuestionModal";
import "./board.css";

const NUM_CATEGORIES = Object.keys(categories).length;

function Board({ selectedTheme }) {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerPositions, setPlayerPositions] = useState({ 1: 0, 2: 0 });
  const [playerCategories, setPlayerCategories] = useState({ 1: [], 2: [] });
  const [isMoving, setIsMoving] = useState(false);
  const [showDice, setShowDice] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionCategory, setQuestionCategory] = useState(null);
  const [isCheeseCell, setIsCheeseCell] = useState(false);

  // Estado de animación: casillas por las que pasa y casilla final
  const [passedCells, setPassedCells] = useState([]);

  // Estado de la ronda final (centro)
  const [atCenter, setAtCenter] = useState({ 1: false, 2: false });
  const [centerQuestions, setCenterQuestions] = useState({ 1: [], 2: [] });
  const [centerCategoryQueue, setCenterCategoryQueue] = useState([]);
  const [showFinalChallenge, setShowFinalChallenge] = useState(false);
  const [currentCenterQuestionIndex, setCurrentCenterQuestionIndex] = useState(0);

  // Ajustar variables CSS dinámicamente según tamaño (desktop vs móvil)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        document.documentElement.style.setProperty("--board-size", "95vw");
        document.documentElement.style.setProperty("--center-size", "18vw");
      } else {
        document.documentElement.style.setProperty("--board-size", `${BOARD_SIZE}px`);
        document.documentElement.style.setProperty("--center-size", `${CENTER_SIZE}px`);
      }
    };
    handleResize(); // inicial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Control de scroll para móvil cuando aparece/desaparece el modal
  useEffect(() => {
    if (showQuestion) {
      // Cuando se abre el modal: bloquear scroll del body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Cuando se cierra el modal: restaurar scroll del body
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // Cleanup: restaurar scroll al desmontar componente
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showQuestion]);

  // ===================== MOVIMIENTO ===================
  function movePlayer(steps) {
    setIsMoving(true);
    let pos = playerPositions[currentPlayer];
    let count = 0;
    let passed = [];
    function moveStep() {
      pos = (pos + 1) % boardCells.length;
      setPlayerPositions((prev) => ({ ...prev, [currentPlayer]: pos }));
      passed.push(pos);
      setPassedCells([...passed]);
      count++;
      if (count < steps) setTimeout(moveStep, 180);
      else {
        setIsMoving(false);
        setPassedCells([]);
        const hasAllQuesitos = playerCategories[currentPlayer].length === NUM_CATEGORIES;
        if (hasAllQuesitos && boardCells[pos].type === "center") {
          // RETRASO: Esperar 1 segundo antes de iniciar ronda centro
          setTimeout(() => {
            iniciarRondaCentro();
          }, 1000);
        } else {
          // RETRASO: Esperar 1 segundo antes de mostrar pregunta
          setTimeout(() => {
            checkCell(pos);
          }, 1000);
        }
      }
    }
    moveStep();
  }

  // ===================== CHEQUEAR CASILLA ===================
  function checkCell(position) {
    const cell = boardCells[position];
    const category = cell.category;
    
    // Si está en el centro pero no tiene todos los quesitos
    if (cell.type === "center" && playerCategories[currentPlayer].length < NUM_CATEGORIES) {
      window.alert(
        `¡Necesitas un quesito de cada categoría antes de disputar la final! Te faltan ${NUM_CATEGORIES - playerCategories[currentPlayer].length} quesitos.`
      );
      nextTurn();
      return;
    }
    
    setQuestionCategory(category);
    setIsCheeseCell(cell.type === "cheese");
    setShowQuestion(true);
  }

  // ===================== RESPUESTA PREGUNTA NORMAL ===================
  function handleAnswered(isCorrect, isCheese) {
    setShowQuestion(false);

    if (showFinalChallenge) {
      handleCenterAnswer(isCorrect);
      return;
    }

    if (isCorrect) {
      if (isCheese) {
        setPlayerCategories((prev) => {
          const already = prev[currentPlayer].includes(questionCategory);
          if (already) {
            // Ya tiene quesito de esta categoría, no hacer nada especial
            return prev;
          }
          // Agregar nuevo quesito
          const newCategories = [...prev[currentPlayer], questionCategory];
          
          // Verificar si ya tiene todos los quesitos
          setTimeout(() => {
            if (newCategories.length === NUM_CATEGORIES) {
              window.alert(
                "¡Has conseguido un quesito de cada categoría! Ahora puedes ir al centro y disputar la final."
              );
            }
          }, 100);
          
          return {
            ...prev,
            [currentPlayer]: newCategories,
          };
        });
      }
      // Si acierta, continúa jugando (no pasa el turno)
    } else {
      // Si falla, pasa el turno
      nextTurn();
    }
  }

  function nextTurn() {
    setCurrentPlayer((p) => (p === 1 ? 2 : 1));
  }

  // ===================== DADO ===================
  function handleRollComplete(number) {
    setShowDice(false);
    if (playerCategories[currentPlayer].length === NUM_CATEGORIES) {
      movePlayerAlCentro(number);
    } else {
      movePlayer(number);
    }
  }

  function movePlayerAlCentro(steps) {
    const centerIdx = boardCells.findIndex((cell) => cell.type === "center");
    if (centerIdx === -1) {
      alert('El tablero no tiene centro definido "type:center"');
      return;
    }
    let pos = playerPositions[currentPlayer];
    let count = 0;
    let passed = [];
    function step() {
      pos = (pos + 1) % boardCells.length;
      setPlayerPositions((prev) => ({ ...prev, [currentPlayer]: pos }));
      passed.push(pos);
      setPassedCells([...passed]);
      count++;
      if (pos !== centerIdx && count < steps) setTimeout(step, 180);
      else {
        setIsMoving(false);
        setPassedCells([]);
        if (pos === centerIdx) {
          // RETRASO: Esperar 1 segundo antes de iniciar ronda centro
          setTimeout(() => {
            iniciarRondaCentro();
          }, 1000);
        } else {
          // RETRASO: Esperar 1 segundo antes de mostrar pregunta
          setTimeout(() => {
            checkCell(pos);
          }, 1000);
        }
      }
    }
    setIsMoving(true);
    step();
  }

  // =========== RONDA FINAL (CENTRO, una pregunta de cada categoría) ============
  function iniciarRondaCentro() {
    // Crear orden aleatorio de las categorías para la ronda final
    const catOrder = shuffle(Object.keys(categories));
    setCenterCategoryQueue(catOrder);
    setCenterQuestions((prev) => ({ ...prev, [currentPlayer]: [] }));
    setAtCenter((prev) => ({ ...prev, [currentPlayer]: true }));
    setShowFinalChallenge(true);
    setCurrentCenterQuestionIndex(0);
    setShowQuestion(true);
    setQuestionCategory(catOrder[0]);
    setIsCheeseCell(false);
  }

  function handleCenterAnswer(isCorrect) {
    // Guardar la respuesta
    setCenterQuestions((prev) => {
      const newQuestions = [...(prev[currentPlayer] || []), isCorrect];
      return { ...prev, [currentPlayer]: newQuestions };
    });

    const nextIndex = currentCenterQuestionIndex + 1;
    
    if (nextIndex < centerCategoryQueue.length) {
      // Hay más preguntas, continuar
      setCurrentCenterQuestionIndex(nextIndex);
      setTimeout(() => {
        setShowQuestion(true);
        setQuestionCategory(centerCategoryQueue[nextIndex]);
        setIsCheeseCell(false);
      }, 650);
    } else {
      // Se acabaron las preguntas, evaluar resultado
      setShowFinalChallenge(false);
      
      // Contar aciertos (incluyendo la respuesta actual)
      const allAnswers = [...(centerQuestions[currentPlayer] || []), isCorrect];
      const aciertos = allAnswers.filter(Boolean).length;
      
      if (aciertos >= 4) {
        setTimeout(() => {
          alert(
            `¡Jugador ${currentPlayer} ha acertado ${aciertos}/${NUM_CATEGORIES} preguntas y GANA la partida! 🎉`
          );
        }, 400);
      } else {
        setTimeout(() => {
          alert(
            `Jugador ${currentPlayer} acertó ${aciertos}/${NUM_CATEGORIES} preguntas. Necesitas al menos 4 aciertos. ¡Te quedas en el centro para el próximo turno!`
          );
          // El jugador se queda en el centro, solo cambia el turno
          nextTurn();
        }, 400);
      }
    }
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ===================== RENDER UI ===================
  const isDisabled = isMoving || showDice || showQuestion;

  return (
    <div className="board-container">
      <div className="header">
        <h1 className="board-title">🎯 Trivial</h1>

        <div className="turn-indicator">
          <b>Turno del Jugador {currentPlayer}</b>
          {showFinalChallenge && atCenter[currentPlayer] && (
            <span className="final-phase-indicator">
              🏆 Fase Final ({currentCenterQuestionIndex + 1}/{NUM_CATEGORIES})
            </span>
          )}
          {atCenter[currentPlayer] && !showFinalChallenge && (
            <span className="center-waiting-indicator">
              🎯 En el centro - Esperando turno
            </span>
          )}
        </div>
      </div>
      <div className="board-game">
        <div className="board-center">
          <div className="board-center-icon">🏆</div>
          <span className="board-center-text">META</span>
        </div>

        {boardCells.map((cell, i) => (
          <Cell
            key={i}
            cell={cell}
            index={i}
            position={getCellPosition(i, boardCells)}
            category={categories[cell.category]}
            isCheese={cell.type === "cheese"}
            isPassed={passedCells.includes(i)}
            isCurrent={playerPositions[currentPlayer] === i}
          />
        ))}

        <Player
          player={1}
          position={getCellPosition(playerPositions[1], boardCells)}
          color={PLAYER_COLORS}
          offset={-8}
        />
        <Player
          player={2}
          position={getCellPosition(playerPositions[2], boardCells)}
          color={PLAYER_COLORS}
          offset={8}
        />

        {showDice && (
          <div className="dice-modal">
            <DiceComponent
              onRollComplete={handleRollComplete}
              autoRoll={true}
              size={140}
            />
          </div>
        )}

        {showQuestion && (
          <div className="question-modal-overlay">
            <QuestionModal
              visible={true}
              onClose={() => setShowQuestion(false)}
              category={questionCategory}
              selectedTheme={selectedTheme}
              onAnswer={handleAnswered}
              isCheeseCell={isCheeseCell}
            />
          </div>
        )}
      </div>

      <CategoryStatus
        categories={categories}
        playerCategories={playerCategories}
      />

      <button
        onClick={() => setShowDice(true)}
        disabled={isDisabled}
        className={`dice-button ${isDisabled ? "disabled" : ""}`}
      >
        {showDice ? "🎲 Lanzando..." : "🎲 Lanzar Dado"}
      </button>
    </div>
  );
}

export default Board;

