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