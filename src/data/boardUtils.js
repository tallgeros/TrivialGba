export const BOARD_SIZE = 600;
export const CENTER_SIZE = 80;
export const PLAYER_COLORS = { 1: '#FF4444', 2: '#4444FF' };

export function getCellPosition(index, boardCells) {
  const totalCells = boardCells.length;
  const angle = (index / totalCells) * 2 * Math.PI - Math.PI / 2;
  const radius = (BOARD_SIZE / 2) - 50;
  const centerX = BOARD_SIZE / 2;
  const centerY = BOARD_SIZE / 2;
  return {
    x: centerX + radius * Math.cos(angle) - (boardCells[index].type === 'cheese' ? 24 : 18),
    y: centerY + radius * Math.sin(angle) - (boardCells[index].type === 'cheese' ? 24 : 18),
  };
}