export const BOARD_SIZE = 600;
export const CENTER_SIZE = 80;
export const PLAYER_COLORS = { 1: '#FF4444', 2: '#4444FF' };

export function getCellPosition(index, boardCells) {
  if (!boardCells || !boardCells[index]) {
    // Fallback en caso índice no válido
    return { x: 0, y: 0 };
  }

  const totalCells = boardCells.length;
  const angle = (index / totalCells) * 2 * Math.PI - Math.PI / 2;

  const isMobile = window.innerWidth <= 600;

  let centerX, centerY, x, y;
  if (isMobile) {
    // Ajustes para tablero ovalado móvil vertical (más estrecho y alto)
const boardWidth = window.innerWidth * 0.95;  // un poco más ancho
const boardHeight = window.innerWidth * 1.20; // un poco menos alto


    centerX = boardWidth / 2;
    centerY = boardHeight / 2;

    const a = boardWidth / 2.3;  // radio horizontal (más pequeño)
    const b = boardHeight / 2.3; // radio vertical (más grande)

    x = centerX + a * Math.cos(angle);
    y = centerY + b * Math.sin(angle);
  } else {
    // Desktop tablero circular
    const radius = (BOARD_SIZE / 2) - 50;
    centerX = BOARD_SIZE / 2;
    centerY = BOARD_SIZE / 2;
    x = centerX + radius * Math.cos(angle);
    y = centerY + radius * Math.sin(angle);
  }

  const offset = boardCells[index].type === 'cheese' ? 24 : 18;

  return {
    x: x - offset,
    y: y - offset,
  };
}

