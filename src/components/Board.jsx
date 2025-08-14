import React, { useState } from "react";
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
const CENTER_INDEX = Math.floor(boardCells.length / 2); // Ajusta según tu boardCells

function Board({ selectedTheme, onBackToCategories }) {
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerPositions, setPlayerPositions] = useState({ 1: 0, 2: 0 });
  const [playerCategories, setPlayerCategories] = useState({ 1: [], 2: [] });
  const [isMoving, setIsMoving] = useState(false);
  const [showDice, setShowDice] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionCategory, setQuestionCategory] = useState(null);
  const [isCheeseCell, setIsCheeseCell] = useState(false);

  // Estado de la ronda final (centro)
  const [atCenter, setAtCenter] = useState({ 1: false, 2: false });
  const [centerQuestions, setCenterQuestions] = useState({ 1: [], 2: [] });
  const [centerCategoryQueue, setCenterCategoryQueue] = useState([]);
  const [showFinalChallenge, setShowFinalChallenge] = useState(false);

  // Definir las variables CSS
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--board-size",
      `${BOARD_SIZE}px`
    );
    document.documentElement.style.setProperty(
      "--center-size",
      `${CENTER_SIZE}px`
    );
  }, []);

  // ===================== MOVIMIENTO ===================

  function movePlayer(steps) {
    setIsMoving(true);
    let pos = playerPositions[currentPlayer];
    let count = 0;
    function moveStep() {
      pos = (pos + 1) % boardCells.length;
      setPlayerPositions((prev) => ({ ...prev, [currentPlayer]: pos }));
      count++;
      if (count < steps) setTimeout(moveStep, 180);
      else {
        setIsMoving(false);
        // ¿Está entrando en centro y tiene todos los quesitos?
        const hasAllQuesitos =
          playerCategories[currentPlayer].length === NUM_CATEGORIES;
        if (hasAllQuesitos && boardCells[pos].type === "center") {
          // Entra en modo challenge final
          iniciarRondaCentro();
        } else {
          checkCell(pos);
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
    setShowQuestion(true);
  }

  // ===================== RESPUESTA PREGUNTA NORMAL ===================
  function handleAnswered(isCorrect, isCheese) {
    setShowQuestion(false);

    if (showFinalChallenge) {
      handleCenterAnswer(isCorrect);
      return;
    }

    // Si está en centro pero no todos los quesitos, solo notifica y cambia turno
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
      // Si ganó todos los quesitos tras esta tirada, notificar y forzar moverse sólo a centro
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

      // Turno sigue (el jugador puede volver a lanzar dado)
    } else {
      // Falla, pasa turno
      nextTurn();
    }
  }

  function nextTurn() {
    setCurrentPlayer((p) => (p === 1 ? 2 : 1));
  }

  // ===================== DADO ===================
  function handleRollComplete(number) {
    setShowDice(false);
    // Si el jugador ya tiene todos los quesitos, sólo puede moverse al centro
    if (playerCategories[currentPlayer].length === NUM_CATEGORIES) {
      // Busca la posición del centro (primera casilla center, o por tu lógica)
      movePlayerAlCentro(number);
    } else {
      movePlayer(number);
    }
  }

  function movePlayerAlCentro(steps) {
    // Busca el índice del centro
    const centerIdx = boardCells.findIndex((cell) => cell.type === "center");
    if (centerIdx === -1) {
      alert('El tablero no tiene centro definido "type:center"');
      return;
    }
    // Calcula movimientos mínimos hasta el centro (puede ajustar lógica según reglas)
    let pos = playerPositions[currentPlayer];
    let count = 0;
    function step() {
      pos = (pos + 1) % boardCells.length;
      setPlayerPositions((prev) => ({ ...prev, [currentPlayer]: pos }));
      count++;
      if (pos !== centerIdx && count < steps) setTimeout(step, 180);
      else {
        setIsMoving(false);
        if (pos === centerIdx) {
          iniciarRondaCentro();
        } else {
          checkCell(pos);
        }
      }
    }
    setIsMoving(true);
    step();
  }

  // =========== RONDA FINAL (CENTRO, 6 preguntas aleatorias de categorías) ============

  function iniciarRondaCentro() {
    // Prepara las categorías aleatorias para preguntas (sin repeticiones)
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
    // Acumula si acertó o no
    setCenterQuestions((prev) => {
      const playerList = [...(prev[currentPlayer] || []), isCorrect];
      // Siguiente categoría
      const idx = playerList.length;
      if (idx < centerCategoryQueue.length) {
        // Siguiente pregunta
        setTimeout(() => {
          setShowQuestion(true);
          setQuestionCategory(centerCategoryQueue[idx]);
          setIsCheeseCell(false);
        }, 650);
      } else {
        // Fin de ronda final: ¿ha acertado al menos 5?
        setShowFinalChallenge(false);
        const aciertos = playerList.filter(Boolean).length;
        if (aciertos >= 5) {
          setTimeout(() => {
            alert(
              `¡Jugador ${currentPlayer} ha acertado ${aciertos}/6 y GANA la partida!`
            );
            // Aquí podrías reiniciar juego o mostrar modal de final de partida
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

  // Util para ronda final
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
      <h1 className="board-title">🎯 Trivial Pursuit</h1>

      <div className="turn-indicator">
        <b>Turno del Jugador {currentPlayer}</b>
        {showFinalChallenge && atCenter[currentPlayer] && (
          <span className="final-phase-indicator">🏆 Fase Final</span>
        )}
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
          />
        ))}

        <Player
          player={1}
          position={getCellPosition(playerPositions[1], boardCells)}
          color={PLAYER_COLORS[1]}
          offset={-8}
        />
        <Player
          player={2}
          position={getCellPosition(playerPositions[2], boardCells)}
          color={PLAYER_COLORS[2]}
          offset={8}
        />

        {/* Modal dado */}
        {showDice && (
          <div className="dice-modal">
            <DiceComponent
              onRollComplete={handleRollComplete}
              autoRoll={true}
              size={140}
            />
          </div>
        )}

        {/* Modal PREGUNTA */}
        {showQuestion && (
          <QuestionModal
            visible={true}
            onClose={() => setShowQuestion(false)}
            category={questionCategory}
              selectedTheme={selectedTheme}
            onAnswer={handleAnswered}
            isCheeseCell={isCheeseCell}
          />
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