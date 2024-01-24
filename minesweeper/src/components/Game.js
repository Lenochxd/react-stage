import React, { useState, useEffect } from 'react';
import Board from './Board';

const generateEmptyBoard = (rows, cols, numBombs) => {
  const emptyBoard = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );

  // Placer des bombes de manière aléatoire
  let bombsPlaced = 0;
  while (bombsPlaced < numBombs) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);

    if (emptyBoard[randomRow][randomCol] !== 'mine') {
      emptyBoard[randomRow][randomCol] = 'mine';
      bombsPlaced++;
    }
  }

  // Calculer le nombre de bombes adjacentes pour chaque case
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (emptyBoard[row][col] !== 'mine') {
        let count = 0;

        // Vérifier les 8 cases autour
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;

            if (
              newRow >= 0 &&
              newRow < rows &&
              newCol >= 0 &&
              newCol < cols &&
              emptyBoard[newRow][newCol] === 'mine'
            ) {
              count++;
            }
          }
        }

        emptyBoard[row][col] = count;
      }
    }
  }

  return emptyBoard;
};


const Game = () => {
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    handleNewGameClick();
  }, []);

  const handleCellClick = function (row, col) {
    // Créez une copie du tableau pour éviter la mutation directe de l'état
    const newBoard = [...board];
    console.log(newBoard[row][col]);
    console.log(row, col);

    // Retirez la classe 'hidden' de la cellule cliquée
    newBoard[row][col] = ''; 

    // Mettez à jour l'état du tableau
    setBoard(newBoard);
  };

  const handleNewGameClick = () => {
    // Logique pour générer un nouveau jeu
    const newBoard = generateEmptyBoard(9, 9, 10);
    setBoard(newBoard);
    setGameOver(false);
  };


  return (
    <div className="game">
      <button onClick={handleNewGameClick}>Nouveau jeu</button>
      <Board board={board} handleCellClick={handleCellClick} />
      {gameOver && <div className="game-over">Game Over!</div>}
    </div>
  );
};

export default Game;
