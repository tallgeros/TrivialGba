// src/data/questions/index.js
// Archivo principal que maneja todos los componentes de preguntas

import { questionsNormal } from '../questionsNormal';
import { questionsHarryPotter } from '../questionsHarryPotter';
import { questionsLotr } from '../questionsLotr';
import { questionsBatman } from '../questionsBatman';
import { questionsMarvel } from '../questionsMarvel';
import { questionsStarWars } from '../questionsStarWars';

// Mapeo de temas a sus componentes de preguntas
export const questionsDatabase = {
  normal: questionsNormal,
  harryPotter: questionsHarryPotter,
  lotr: questionsLotr,
  batman: questionsBatman,
  marvel: questionsMarvel,
  starWars: questionsStarWars
};

// Arrays temporales para cada categoría del tema actual
let temporalArrays = {};
let currentTheme = null;

// Función para inicializar arrays temporales cuando se selecciona un tema
export function initializeThemeQuestions(themeName) {
  if (!questionsDatabase[themeName]) {
    console.error(`Tema ${themeName} no encontrado`);
    return;
  }

  currentTheme = themeName;
  temporalArrays = {};
  
  const themeQuestions = questionsDatabase[themeName];
  
  // Para cada categoría del tema, crear array temporal con todas sus preguntas
  Object.keys(themeQuestions).forEach(category => {
    if (themeQuestions[category] && Array.isArray(themeQuestions[category])) {
      // Crear una copia del array original para no modificar el original
      temporalArrays[category] = [...themeQuestions[category]];
    }
  });
  
  console.log(`Tema ${themeName} inicializado con preguntas:`, temporalArrays);
}

// Función para obtener una pregunta aleatoria de una categoría
export function getRandomQuestionFromCategory(theme, category) {
  // Si es un tema diferente al actual, inicializar el nuevo tema
  if (currentTheme !== theme) {
    initializeThemeQuestions(theme);
  }
  
  // Verificar que la categoría existe
  if (!temporalArrays[category]) {
    console.error(`Categoría ${category} no disponible en el tema ${theme}`);
    return null;
  }
  
  // Si el array temporal está vacío, regenerarlo
  if (temporalArrays[category].length === 0) {
    console.log(`Array de ${category} vacío, regenerando...`);
    const originalQuestions = questionsDatabase[currentTheme][category];
    temporalArrays[category] = [...originalQuestions];
  }
  
  // Seleccionar índice aleatorio
  const randomIndex = Math.floor(Math.random() * temporalArrays[category].length);
  
  // Extraer la pregunta (la quita del array)
  const selectedQuestion = temporalArrays[category].splice(randomIndex, 1)[0];
  
  console.log(`Pregunta seleccionada de ${category}. Quedan ${temporalArrays[category].length} preguntas`);
  
  return selectedQuestion;
}

// Función para obtener el tema actual
export function getCurrentTheme() {
  return currentTheme;
}

// Función para obtener cuántas preguntas quedan en una categoría
export function getRemainingQuestions(category) {
  if (!temporalArrays[category]) {
    return 0;
  }
  return temporalArrays[category].length;
}

// Función para resetear una categoría específica (opcional)
export function resetCategory(category) {
  if (currentTheme && questionsDatabase[currentTheme][category]) {
    temporalArrays[category] = [...questionsDatabase[currentTheme][category]];
    console.log(`Categoría ${category} reseteada`);
  }
}

// Función para obtener estadísticas de preguntas restantes
export function getQuestionsStats() {
  const stats = {};
  Object.keys(temporalArrays).forEach(category => {
    const total = questionsDatabase[currentTheme][category]?.length || 0;
    const remaining = temporalArrays[category]?.length || 0;
    stats[category] = {
      total,
      remaining,
      used: total - remaining
    };
  });
  return stats;
}