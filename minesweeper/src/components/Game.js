import React, { useState, useEffect } from 'react';
import Board from './Board';
import '../styles/nums.css';


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
  const [hasWon, setHasWon] = useState(false);
  const [minesLeft, setMinesLeft] = useState([]);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timer, setTimer] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    handleNewGameClick();
  }, []);

  const isDefined = (board, row, col) => {
    if (typeof board[row] !== 'undefined' && typeof board[row][col] !== 'undefined') {
      return true;
    }
    return false;
  };

  const arrayToInt = (array) => {
    while (array[0] == 0) {
      if (array.length == 1) {
        break;
      } else {
        array.shift()
      }
    }

    return parseInt(array.join(''));
  };

  const intToArray = (int) => {
    let str = int.toString();
    
    // Créer un tableau à partir de la chaîne de caractères
    let array = str.split('').map(Number);
  
    // Insérer le signe négatif au début du tableau si le nombre est négatif
    if (int < 0) {
      while (array[0] == 0) {
        array.shift();
      }
      array.unshift('-');
    }

    let newArray = array.filter(function(element) {
      // Return true if the element is not NaN
      if (element == '-') {
        return true;
      }
      // TODO: CRASHES IF -99
      return !isNaN(element);
    });

    // Ajouter un leading zero si la longueur est inférieure à 2
    while (newArray.length < 3) {
      newArray.unshift(0);
    }

    return newArray;
  };

  const explode = (board, row, col) => {
    // change mine.svg to mine_red.svg
    board[row][col] = board[row][col].replace('mine', 'gameover');

    // game over!
    console.log('game over!')
    // for every cells in board
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        // show mines
        if (board[i][j].includes('mine')) {
          board[i][j] = board[i][j].replace('closed', '');
        }

        // show wrong flags
        if (board[i][j].includes('flagged')) {
          if (!board[i][j].includes('mine')) {
            board[i][j] += ' minewrong';
          }
        }
      }
    }
    setBoard(board);
    setGameOver(true);
    // stop timer
    clearInterval(intervalId);
    setIntervalId(null);
    setTimerStarted(false);
    return board;
  };

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

    let newBoard = [...board];
    if (!newBoard[row][col].includes('flagged')) {
      newBoard[row][col] = newBoard[row][col].replace('closed', '');
      if (newBoard[row][col].includes('mine')) {
        newBoard = explode(newBoard, row, col);
      }
    }
    if (newBoard[row][col].startsWith('0')) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (!newBoard[row][col].includes('flagged')) {
            clearEmptyCells(newBoard, row + i, col + j);
          }
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
    if (gameOver === true || hasWon === true) {
      return
    }
    if (timerStarted === false && gameOver === false && hasWon === false) {
      setTimerStarted(true);
      let newTimer = 0;
      const intervalId = setInterval(() => {
        if (newTimer < 999) {
          setTimer(intToArray(newTimer + 1));
          newTimer += 1;
        }
      }, 1000);
      setIntervalId(intervalId);
    }

    let newBoard = [...board];
    if (e.type === 'click') {
      if (board[row][col]) {
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
          }
          else if (board[row][col].startsWith('0')) {
            clearEmptyCells(board, row, col);
          }
          else {
            if (newBoard[row][col].includes('mine')) {
              newBoard = explode(newBoard, row, col);
            }
            newBoard[row][col] = newBoard[row][col].replace('closed', '');
            setBoard(newBoard);
          }
        }
      }
    } else if (e.type === 'contextmenu') {
      e.preventDefault();
      if (newBoard[row][col]) {
        if (newBoard[row][col].includes('flagged')) {
          newBoard[row][col] = newBoard[row][col].replaceAll('flagged', '')
        }
        else if (board[row][col].includes('closed')) {
          newBoard[row][col] += ' flagged';
        }
      }


      if (!board[row][col].includes('closed')) {

        let everyCellsFlagged = true;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (isDefined(newBoard, row + i, col + j)) {
              if (newBoard[row + i][col + j].includes('closed')) {
                if (!newBoard[row + i][col + j].includes('flagged')) {
                  everyCellsFlagged = false;
                }
              }
            }
          }
        }
        if (everyCellsFlagged === true) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (isDefined(newBoard, row + i, col + j)) {
                newBoard[row + i][col + j] = newBoard[row + i][col + j].replaceAll('flagged', '')
              }
            }
          }
        } else {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (isDefined(newBoard, row + i, col + j)) {
                if (board[row + i][col + j].includes('closed')) {
                  if (!board[row + i][col + j].includes('flagged')) {
                    newBoard[row + i][col + j] += ' flagged';
                  }
                }
              }
            }
          }

        }

      }
    }


    // Count flags
    let flagsCount = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].includes('flagged')) {
          flagsCount += 1;
        }
      }
    }
    // Refresh mines count
    let newMinesLeft = intToArray(10 - flagsCount);
    setMinesLeft(newMinesLeft);


    // Check if the player has won the game
    let allCellsRevealed = true;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (!board[i][j].includes('mine')) {
          if (board[i][j].includes('closed')) {
            allCellsRevealed = false;
          }
        }
      }
    }
    if (allCellsRevealed) {
      // Flags every missing mines
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j].includes('mine')) {
            newBoard[i][j] += ' flagged';
          }
        }
      }

      setHasWon(true);
      // stop timer
      clearInterval(intervalId);
      setIntervalId(null);
      setTimerStarted(false);
    }

    setBoard(newBoard);
  };

  const handleNewGameClick = () => {
    // Logic to generate a new game
    const newBoard = generateEmptyBoard(9, 9, 10);
    setBoard(newBoard);
    setGameOver(false);
    setHasWon(false);
    setMinesLeft([0,1,0]);
    // clear timer
    clearInterval(intervalId);
    setIntervalId(null);
    setTimerStarted(false);
    setTimer([0,0,0]);
  };


  return (
    <div className="game">
      {/* TOP */}
      <div className="top-area-center top">
        <div className="corner-up-left" />
        <div className="border-hor" />
        <div className="corner-up-right" />
      </div>

      <div className="top-area-center mid">
        <div className="border-vert h-20" />
        <div className="numbers-panel mines-left">
          <div className={`num num-${minesLeft[0]}`}></div>
          <div className={`num num-${minesLeft[1]}`}></div>
          <div className={`num num-${minesLeft[2]}`}></div>
        </div>
        <div onClick={handleNewGameClick} className={`game-status ${hasWon ? 'game-won' : gameOver ? 'game-lost' : 'game-playing'}`} />
        <div className="numbers-panel timer">
          <div className={`num num-${timer[0]}`}></div>
          <div className={`num num-${timer[1]}`}></div>
          <div className={`num num-${timer[2]}`}></div>
        </div>
        <div className="border-vert h-20" />
      </div>

      <div className="top-area-center bottom">
        <div className="t-left" />
        <div className="border-hor" />
        <div className="t-right" />
      </div>


      {/* BOARD */}
      <div className="top-area-center board">
        <div className="border-vert h-360" />
        <Board board={board} handleCellClick={handleCellClick} />
        <div className="border-vert h-360" />
        {/* il faut 22.5rem pour cette grille! pas h-80, il faudrait que ça soit en pourcentages pour que ça soit automatique
        mais je n'ai pas encore réussi à le faire.. */}
      </div>

      <div className="top-area-center board-bottom">
        <div className="corner-bottom-left" />
        <div className="border-hor" />
        <div className="corner-bottom-right" />
      </div>
    </div>
  );
};

export default Game;
