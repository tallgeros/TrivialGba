import React, { useState, useEffect } from 'react';
import './DiceComponent.css';

const DiceComponent = ({ onRollComplete, autoRoll = false, size = 150 }) => {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [rotationState, setRotationState] = useState({ x: 0, y: 0, z: 0 });

  // Configuración de las caras del dado con puntos
  const diceConfig = {
    1: [{ row: 1, col: 1 }], // Centro
    2: [{ row: 0, col: 0 }, { row: 2, col: 2 }], // Diagonal
    3: [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }], // Diagonal con centro
    4: [{ row: 0, col: 0 }, { row: 0, col: 2 }, { row: 2, col: 0 }, { row: 2, col: 2 }], // Esquinas
    5: [{ row: 0, col: 0 }, { row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }, { row: 2, col: 2 }], // Esquinas + centro
    6: [{ row: 0, col: 0 }, { row: 0, col: 2 }, { row: 1, col: 0 }, { row: 1, col: 2 }, { row: 2, col: 0 }, { row: 2, col: 2 }] // Dos columnas
  };

  // Rotaciones para cada número del dado
  const getFinalRotation = (number) => {
    const rotations = {
      1: { x: 0, y: 0, z: 0 },      // Frontal
      2: { x: -90, y: 0, z: 0 },    // Superior
      3: { x: 0, y: -90, z: 0 },    // Derecha
      4: { x: 0, y: 90, z: 0 },     // Izquierda
      5: { x: 90, y: 0, z: 0 },     // Inferior
      6: { x: 180, y: 0, z: 0 },    // Trasera
    };
    return rotations[number];
  };

  // Componente para renderizar los puntos del dado
  const DiceFace = ({ number, className }) => {
    const dots = diceConfig[number] || [];
    const dotSize = size * 0.13; // Proporcional al tamaño del dado
    
    return (
      <div className={`cube-face ${className}`}>
        <div className="inside">
          {Array.from({ length: 9 }, (_, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const shouldShow = dots.some(dot => dot.row === row && dot.col === col);
            
            return (
              <span 
                key={index} 
                className={shouldShow ? "dot" : "dot-empty"}
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  // Función para lanzar el dado
  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    const finalNumber = Math.floor(Math.random() * 6) + 1;
    const finalRotation = getFinalRotation(finalNumber);
    
    // Rotaciones múltiples para el efecto de giro
    const newRotation = {
      x: rotationState.x + 1800 + finalRotation.x, // 5 vueltas completas + posición final
      y: rotationState.y + 1440 + finalRotation.y, // 4 vueltas completas + posición final
      z: rotationState.z + 1080 + finalRotation.z  // 3 vueltas completas + posición final
    };
    
    setRotationState(newRotation);

    // Actualizar estado al finalizar la animación
    setTimeout(() => {
      setCurrentNumber(finalNumber);
      setIsRolling(false);
      if (onRollComplete) {
        onRollComplete(finalNumber);
      }
    }, 2000);
  };

  // Auto-roll cuando se monta el componente
  useEffect(() => {
    if (autoRoll) {
      const timer = setTimeout(() => {
        rollDice();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoRoll]);

  const cubeSize = size;
  const faceOffset = size / 2;

  // Variables CSS dinámicas
  const cssVariables = {
    '--cube-size': `${cubeSize}px`,
    '--face-offset': `${faceOffset}px`,
    '--grid-size': `${cubeSize * 0.2}px`,
    '--gap-size': `${cubeSize * 0.05}px`,
    '--padding-size': `${cubeSize * 0.13}px`,
    '--perspective': `${cubeSize * 6}px`,
    '--border-radius': `${cubeSize * 0.1}px`,
    '--shadow-offset-1': `${cubeSize * 0.05}px`,
    '--shadow-blur-1': `${cubeSize * 0.15}px`,
    '--shadow-offset-2': `${cubeSize * 0.08}px`,
    '--shadow-blur-2': `${cubeSize * 0.25}px`,
    '--glow-offset-1': `${cubeSize * 0.08}px`,
    '--glow-blur-1': `${cubeSize * 0.25}px`,
    '--glow-spread-1': `${cubeSize * 0.3}px`,
    '--glow-offset-2': `${cubeSize * 0.12}px`,
    '--glow-blur-2': `${cubeSize * 0.35}px`,
    '--glow-spread-2': `${cubeSize * 0.5}px`,
  };

  return (
    <div 
      className="dice-container"
      style={{ 
        ...cssVariables,
        minHeight: size + 50,
      }}
    >
      <div 
        className={`cube-container ${isRolling ? 'rolling rolling-glow' : 'floating'}`}
        onClick={rollDice}
        style={{
          width: cubeSize,
          height: cubeSize,
          perspective: cubeSize * 6,
          cursor: isRolling ? 'wait' : 'pointer',
        }}
      >
        <div 
          className={`cube ${isRolling ? 'rolling' : ''}`}
          style={{
            transform: `rotateX(${rotationState.x}deg) rotateY(${rotationState.y}deg) rotateZ(${rotationState.z}deg)`,
          }}
          onMouseEnter={(e) => {
            if (!isRolling) {
              e.currentTarget.style.transform = 
                `rotateX(${rotationState.x - 5}deg) rotateY(${rotationState.y + 10}deg) rotateZ(${rotationState.z}deg)`;
            }
          }}
          onMouseLeave={(e) => {
            if (!isRolling) {
              e.currentTarget.style.transform = 
                `rotateX(${rotationState.x}deg) rotateY(${rotationState.y}deg) rotateZ(${rotationState.z}deg)`;
            }
          }}
        >
          <DiceFace number={1} className="front" />
          <DiceFace number={6} className="back" />
          <DiceFace number={4} className="left" />
          <DiceFace number={3} className="right" />
          <DiceFace number={2} className="top" />
          <DiceFace number={5} className="bottom" />
        </div>
      </div>

      {/* Indicador sutil del resultado */}
      {!isRolling && (
        <div className="result-indicator">
          {currentNumber}
        </div>
      )}

      {/* Estilos dinámicos inline para cada cara */}
      <style>{`
        .cube-face {
          width: ${cubeSize}px;
          height: ${cubeSize}px;
          border-radius: ${cubeSize * 0.1}px;
          box-shadow: 
            0 ${cubeSize * 0.05}px ${cubeSize * 0.15}px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .cube-container:hover .cube-face {
          box-shadow: 
            0 ${cubeSize * 0.08}px ${cubeSize * 0.25}px rgba(0,212,255,0.4),
            inset 0 1px 0 rgba(255,255,255,0.9);
        }
      `}</style>
    </div>
  );
};

export default DiceComponent;