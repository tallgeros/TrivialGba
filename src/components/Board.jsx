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
    setQuestionCategory(category);
    setIsCheeseCell(cell.type === "cheese");
    setShowQuestion(true); // Ahora se dispara 1 segundo después
  }

  // ===================== RESPUESTA PREGUNTA NORMAL ===================
  function handleAnswered(isCorrect, isCheese) {
    setShowQuestion(false);

    if (showFinalChallenge) {
      handleCenterAnswer(isCorrect);
      return;
    }

    const pos = playerPositions[currentPlayer];
    if (
      boardCells[pos].type === "center" &&
      playerCategories[currentPlayer].length < NUM_CATEGORIES
    ) {
      window.alert(
        "¡Necesitas todos los quesitos antes de disputar la final en el centro!"
      );
      nextTurn();
      return;
    }

    if (isCorrect) {
      if (isCheese) {
        setPlayerCategories((prev) => {
          const already = prev[currentPlayer].includes(questionCategory);
          if (already) return prev;
          return {
            ...prev,
            [currentPlayer]: [...prev[currentPlayer], questionCategory],
          };
        });
      }
      setTimeout(() => {
        if (
          playerCategories[currentPlayer].length + (isCheese ? 1 : 0) ===
          NUM_CATEGORIES
        ) {
          window.alert(
            "¡Has conseguido todos los quesitos! Ahora solo puedes entrar en el centro y disputar la final."
          );
        }
      }, 100);
    } else {
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

  // =========== RONDA FINAL (CENTRO, 6 preguntas aleatorias) ============
  function iniciarRondaCentro() {
    const catOrder = shuffle(Object.keys(categories));
    setCenterCategoryQueue(catOrder);
    setCenterQuestions((prev) => ({ ...prev, [currentPlayer]: [] }));
    setAtCenter((prev) => ({ ...prev, [currentPlayer]: true }));
    setShowFinalChallenge(true);
    setShowQuestion(true);
    setQuestionCategory(catOrder[0]);
    setIsCheeseCell(false);
  }

  function handleCenterAnswer(isCorrect) {
    setCenterQuestions((prev) => {
      const playerList = [...(prev[currentPlayer] || []), isCorrect];
      const idx = playerList.length;
      if (idx < centerCategoryQueue.length) {
        setTimeout(() => {
          setShowQuestion(true);
          setQuestionCategory(centerCategoryQueue[idx]);
          setIsCheeseCell(false);
        }, 650);
      } else {
        setShowFinalChallenge(false);
        const aciertos = playerList.filter(Boolean).length;
        if (aciertos >= 5) {
          setTimeout(() => {
            alert(
              `¡Jugador ${currentPlayer} ha acertado ${aciertos}/6 y GANA la partida!`
            );
          }, 400);
        } else {
          setTimeout(() => {
            alert("No has conseguido 5 aciertos... ¡Turno para el adversario!");
            setAtCenter((p) => ({ ...p, [currentPlayer]: false }));
            nextTurn();
          }, 400);
        }
      }
      return { ...prev, [currentPlayer]: playerList };
    });
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
            <span className="final-phase-indicator">🏆 Fase Final</span>
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
            isPassed={passedCells.includes(i)}      // Zoom por donde pasa
            isCurrent={playerPositions[currentPlayer] === i} // Zoom casilla actual
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

        {/* MODAL CENTRADO EN BOARD-GAME - Se ve título y turno */}
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

