import React, { useState, useEffect } from 'react';

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
    const gridSize = size * 0.2;
    
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

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: size + 50,
      padding: '20px'
    }}>
      <style jsx>{`
        .cube-container {
          width: ${cubeSize}px;
          height: ${cubeSize}px;
          position: relative;
          perspective: ${cubeSize * 6}px;
          cursor: ${isRolling ? 'wait' : 'pointer'};
        }
        
        .cube {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform ${isRolling ? '2s' : '0.3s'} cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform: rotateX(${rotationState.x}deg) rotateY(${rotationState.y}deg) rotateZ(${rotationState.z}deg);
        }
        
        .cube-face {
          position: absolute;
          width: ${cubeSize}px;
          height: ${cubeSize}px;
          background: linear-gradient(145deg, #ffffff, #f0f0f0);
          border: 3px solid #333;
          border-radius: ${cubeSize * 0.1}px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 
            0 ${cubeSize * 0.05}px ${cubeSize * 0.15}px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.8);
          transition: all 0.3s ease;
        }
        
        .cube:hover .cube-face {
          box-shadow: 
            0 ${cubeSize * 0.08}px ${cubeSize * 0.25}px rgba(0,212,255,0.4),
            inset 0 1px 0 rgba(255,255,255,0.9);
        }
        
        .front { transform: translateZ(${faceOffset}px); }
        .back { transform: rotateY(180deg) translateZ(${faceOffset}px); }
        .left { transform: rotateY(-90deg) translateZ(${faceOffset}px); }
        .right { transform: rotateY(90deg) translateZ(${faceOffset}px); }
        .top { transform: rotateX(90deg) translateZ(${faceOffset}px); }
        .bottom { transform: rotateX(-90deg) translateZ(${faceOffset}px); }
        
        .inside {
          display: grid;
          grid-template-columns: repeat(3, ${cubeSize * 0.2}px);
          grid-template-rows: repeat(3, ${cubeSize * 0.2}px);
          gap: ${cubeSize * 0.05}px;
          padding: ${cubeSize * 0.13}px;
        }
        
        .dot {
          background: linear-gradient(145deg, #2c2c2c, #1a1a1a);
          justify-self: center;
          align-self: center;
          box-shadow: 
            inset 0 1px 2px rgba(0,0,0,0.5),
            0 1px 0 rgba(255,255,255,0.1);
        }
        
        .dot-empty {
          justify-self: center;
          align-self: center;
        }
        
        .cube-container:hover .cube {
          transform: rotateX(${rotationState.x - 5}deg) rotateY(${rotationState.y + 10}deg) rotateZ(${rotationState.z}deg);
        }

        .rolling-glow {
          animation: ${isRolling ? 'glow 0.5s ease-in-out infinite alternate' : 'none'};
        }

        @keyframes glow {
          from {
            box-shadow: 
              0 ${cubeSize * 0.08}px ${cubeSize * 0.25}px rgba(0,212,255,0.6),
              0 0 ${cubeSize * 0.3}px rgba(0,212,255,0.3);
          }
          to {
            box-shadow: 
              0 ${cubeSize * 0.12}px ${cubeSize * 0.35}px rgba(255,107,107,0.6),
              0 0 ${cubeSize * 0.5}px rgba(255,107,107,0.4);
          }
        }

        .floating {
          animation: ${!isRolling ? 'float 3s ease-in-out infinite' : 'none'};
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
      
      <div 
        className={`cube-container ${isRolling ? 'rolling-glow' : 'floating'}`}
        onClick={rollDice}
      >
        <div className="cube">
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
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 212, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: '20px',
          padding: '8px 16px',
          fontSize: '14px',
          color: '#00d4ff',
          fontWeight: 'bold',
          animation: 'fadeIn 0.5s ease-in'
        }}>
          {currentNumber}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
// Ejemplo de uso en un modal
const ModalExample = () => {
  const [showDice, setShowDice] = useState(false);
  const [diceResult, setDiceResult] = useState(null);

  const handleRollComplete = (result) => {
    setDiceResult(result);
    // Aquí puedes manejar el resultado en tu trivial
    setTimeout(() => {
      setShowDice(false);
    }, 1500); // Cierra el modal después de 1.5s
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ color: '#333', marginBottom: '30px' }}>🎲 Ejemplo de Uso en Modal</h2>
      
      <button 
        onClick={() => setShowDice(true)}
        style={{
          background: 'linear-gradient(145deg, #00d4ff, #0099cc)',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '25px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
        }}
      >
        🎲 Lanzar Dado
      </button>

      {diceResult && (
        <p style={{ 
          marginTop: '20px', 
          fontSize: '18px', 
          color: '#00d4ff',
          fontWeight: 'bold'
        }}>
          ¡Salió un {diceResult}!
        </p>
      )}

      {/* Modal */}
      {showDice && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          animation: 'modalFadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            animation: 'modalSlideIn 0.4s ease-out'
          }}>
            <DiceComponent 
              onRollComplete={handleRollComplete}
              autoRoll={true}
              size={180}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from { 
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ModalExample;