  // Configuración del tablero (54 casillas + centro)
 export const boardCells = [
    // Casillas del perímetro exterior (0-53)
    // Lado superior (0-8)
    { type: 'normal', category: 'history' }, { type: 'normal', category: 'sports' },
    { type: 'normal', category: 'entertainment' }, { type: 'normal', category: 'science' },
    { type: 'cheese', category: 'geography' }, // Casilla de quesito
    { type: 'normal', category: 'art' }, { type: 'normal', category: 'history' },
    { type: 'normal', category: 'sports' }, { type: 'normal', category: 'entertainment' },
    
    // Lado derecho (9-17)
    { type: 'normal', category: 'science' }, { type: 'normal', category: 'geography' },
    { type: 'normal', category: 'art' }, { type: 'normal', category: 'history' },
    { type: 'cheese', category: 'sports' }, // Casilla de quesito
    { type: 'normal', category: 'entertainment' }, { type: 'normal', category: 'science' },
    { type: 'normal', category: 'geography' }, { type: 'normal', category: 'art' },
    
    // Lado inferior (18-26)
    { type: 'normal', category: 'history' }, { type: 'normal', category: 'sports' },
    { type: 'normal', category: 'entertainment' }, { type: 'normal', category: 'science' },
    { type: 'cheese', category: 'geography' }, // Casilla de quesito
    { type: 'normal', category: 'art' }, { type: 'normal', category: 'history' },
    { type: 'normal', category: 'sports' }, { type: 'normal', category: 'entertainment' },
    
    // Lado izquierdo (27-35)
    { type: 'normal', category: 'science' }, { type: 'normal', category: 'geography' },
    { type: 'normal', category: 'art' }, { type: 'normal', category: 'history' },
    { type: 'cheese', category: 'sports' }, // Casilla de quesito
    { type: 'normal', category: 'entertainment' }, { type: 'normal', category: 'science' },
    { type: 'normal', category: 'geography' }, { type: 'normal', category: 'art' },
    
    // Casillas adicionales para completar el círculo (36-53)
    { type: 'normal', category: 'history' }, { type: 'normal', category: 'sports' },
    { type: 'normal', category: 'entertainment' }, { type: 'normal', category: 'science' },
    { type: 'normal', category: 'geography' }, { type: 'normal', category: 'art' },
    { type: 'normal', category: 'history' }, { type: 'normal', category: 'sports' },
    { type: 'normal', category: 'entertainment' }, { type: 'cheese', category: 'science' },
    { type: 'normal', category: 'geography' }, { type: 'normal', category: 'art' },
    { type: 'normal', category: 'history' }, { type: 'normal', category: 'sports' },
    { type: 'normal', category: 'entertainment' }, { type: 'normal', category: 'science' },
    { type: 'cheese', category: 'art' }, { type: 'normal', category: 'geography' },
  ];