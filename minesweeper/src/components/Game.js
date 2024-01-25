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

  // Ajouter "closed" à la fin de chaque valeur
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      emptyBoard[row][col] += 'closed';
    }
  }

  return emptyBoard;
};


const Game = () => {
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    handleNewGameClick(); // TODO: rename
  }, []);

  const clearEmptyCells = (board, row, col) => {
    if (
      row < 0 ||
      row >= board.length ||
      col < 0 ||
      col >= board[row].length ||
      !board[row][col].includes('closed')
    ) {
      return;
    }

    const newBoard = [...board];
    newBoard[row][col] = newBoard[row][col].replace('closed', '');

    if (newBoard[row][col].startsWith('0')) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          clearEmptyCells(newBoard, row + i, col + j);
        }
      }
    }

    setBoard(newBoard);
  };

  const checkAdjacentFlags = (board, row, col) => {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;

        if (
          newRow >= 0 &&
          newRow < board.length &&
          newCol >= 0 &&
          newCol < board[newRow].length
        ) {
          if (board[newRow][newCol].includes('flagged')) {
            count++;
          }
        }
      }
    }

    return count;
  };

  const handleCellClick = (e, row, col) => {
    const newBoard = [...board];
    if (e.type === 'click') {
      if (!board[row][col].includes('flagged')) {
        if (!board[row][col].includes('closed')) {
          const adjacentFlags = checkAdjacentFlags(board, row, col)
          if (adjacentFlags === parseInt(newBoard[row][col].charAt(0))) {
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                clearEmptyCells(newBoard, row + i, col + j)
              }
            }
          }
        } else {
          if (board[row][col].startsWith('0')) {
            clearEmptyCells(board, row, col);
          } else {
            newBoard[row][col] = newBoard[row][col].replace('closed', '');
            setBoard(newBoard);
          }
        }
      }
    } else if (e.type === 'contextmenu') {
      e.preventDefault();

      if (newBoard[row][col].includes('flagged')) {
        newBoard[row][col] = newBoard[row][col].replace('flagged', '')
      }
      else if (board[row][col].includes('closed')) {
        newBoard[row][col] += ' flagged';
      }


      if (!board[row][col].includes('closed')) {

        let everyCellsFlagged = true;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (newBoard[row + i][col + j].includes('closed')) {
              if (!newBoard[row + i][col + j].includes('flagged')) {
                everyCellsFlagged = false;
              }
            }
          }
        }
        console.log(everyCellsFlagged);
        if (everyCellsFlagged === true) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              newBoard[row + i][col + j] = newBoard[row + i][col + j].replace('flagged', '')
            }
          }
        } else {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (board[row + i][col + j].includes('closed')) {
                if (!board[row + i][col + j].includes('flagged')) {
                  newBoard[row + i][col + j] += ' flagged';
                }
              }
            }
          }

        }
        
      }

      setBoard(newBoard);
    }
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
