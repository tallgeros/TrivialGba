import React, { useState } from 'react';
import Board from './components/Board';
import ThemeSelector from './components/ThemeSelector';
import CategoriesExplanation from './components/CategoriesEXplanation';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('theme-selection'); // 'theme-selection', 'categories-explanation', 'game'
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleThemeSelected = (theme) => {
    setSelectedTheme(theme);
    setCurrentScreen('categories-explanation');
  };

  const handleStartGame = () => {
    setCurrentScreen('game');
  };

  const handleBackToThemes = () => {
    setCurrentScreen('theme-selection');
    setSelectedTheme(null);
  };

  const handleBackToCategories = () => {
    setCurrentScreen('categories-explanation');
  };

  const renderCurrentScreen = () => {
    switch(currentScreen) {
      case 'theme-selection':
        return <ThemeSelector onThemeSelected={handleThemeSelected} />;
      
      case 'categories-explanation':
        return (
          <CategoriesExplanation 
            selectedTheme={selectedTheme}
            onStartGame={handleStartGame}
            onBackToThemes={handleBackToThemes}
          />
        );
      
      case 'game':
        return (
          <div style={{background:'#0f0f23', minHeight:'100vh', padding:'8px', height: '100%'}}>
            <Board 
              selectedTheme={selectedTheme}
              onBackToCategories={handleBackToCategories}
            />
          </div>
        );
      
      default:
        return <ThemeSelector onThemeSelected={handleThemeSelected} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;

