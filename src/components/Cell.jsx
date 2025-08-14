import React from 'react';
import './cell.css';

const CELL_SIZE = 35;
const CHEESE_SIZE = 48; // tamaño extra para casilla quesito

export function Cell({ cell, index, position, isCheese, category }) {
  return (
    <div
      className="cell"
      style={{
        left: position.x,
        top: position.y,
        width: isCheese ? CHEESE_SIZE : CELL_SIZE,
        height: isCheese ? CHEESE_SIZE : CELL_SIZE,
        backgroundColor: category.color,
        border: isCheese ? '3px solid #FFD700' : '1px solid #333',
        borderRadius: 8,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isCheese && <span className="cheeseEmoji" style={{ fontSize: 18 }}>🧀</span>}
      <span className="cellNumber">{index}</span>
    </div>
  );
}

