import React, { useState } from "react";
import "./TicTacToe.css";
import circle_icon from "../Assets/circle.png";
import cross_icon from "../Assets/cross.png";

const TickAI = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerX, setIsPlayerX] = useState(true);
  const [difficulty, setDifficulty] = useState("easy");
  const [showDifficultyModal, setShowDifficultyModal] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (i) => {
    if (winner || board[i]) return;

    const newBoard = [...board];
    newBoard[i] = "X"; // Player always plays X
    setBoard(newBoard);
    setIsPlayerX(false); // Switch the turn to the AI after the player's move

    if (!winner) {
      setTimeout(() => {
        const aiMove = makeAIMove(newBoard, false, difficulty);
        if (aiMove !== -1) {
          newBoard[aiMove] = "O"; // AI always plays O
          setBoard(newBoard);
          setIsPlayerX(true); // Switch the turn back to the player after the AI's move
        }
      }, 500);
    }
  };

  const renderSquare = (i) => {
    return (
      <button
        className={`square ${
          winner && winner.line.includes(i) ? "winning-line" : ""
        }`}
        onClick={() => handleClick(i)}
      >
        {board[i] === "X" ? (
          <div className="marker" data-marker="x">
            <img src={cross_icon} alt="cross" />
          </div>
        ) : board[i] === "O" ? (
          <div className="marker" data-marker="o">
            <img src={circle_icon} alt="circle" />
          </div>
        ) : null}
      </button>
    );
  };

  const startNewGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerX(true); // Reset player to X
  };

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
    setShowDifficultyModal(false);
  };

  return (
    <div className="container">
      {showDifficultyModal && (
        <div className="difficulty-modal">
          <h3>Choose Difficulty Level:</h3>
          <button onClick={() => handleDifficultyChange("easy")}>Easy</button>
          <button onClick={() => handleDifficultyChange("medium")}>
            Medium
          </button>
          <button onClick={() => handleDifficultyChange("hard")}>Hard</button>
        </div>
      )}
      <h1 className="title">
        <span>nineTicks</span>
      </h1>
      <div className="board">
        {Array(9)
          .fill(null)
          .map((_, i) => renderSquare(i))}
      </div>
      <div className="info-wrapper">
        <h3>
          {winner
            ? `Winner: ${winner.player}`
            : `Player: ${isPlayerX ? "X" : "O"}`}
        </h3>
        <button onClick={startNewGame}>Start New Game</button>
      </div>
    </div>
  );
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: lines[i] };
    }
  }

  return null;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
  // Check for terminal states (win, loss, or tie)
  const winner = calculateWinner(board);
  if (winner) {
    return { score: winner.player === 'O' ? 10 - depth : -10 + depth };
  }
  if (board.every(square => square !== null)) {
    return { score: 0 };
  }

  // Collect all possible moves
  const moves = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      const newBoard = [...board];
      newBoard[i] = isMaximizing ? 'O' : 'X';
      const result = minimax(newBoard, depth + 1, !isMaximizing, alpha, beta);
      moves.push({ index: i, score: result.score });

      // Alpha-Beta Pruning
      if (isMaximizing) {
        alpha = Math.max(alpha, result.score);
        if (beta <= alpha) break;
      } else {
        beta = Math.min(beta, result.score);
        if (beta <= alpha) break;
      }
    }
  }

  // Choose the best move
  let bestMove;
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of moves) {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    }
  } else {
    let bestScore = Infinity;
    for (const move of moves) {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    }
  }

  return bestMove;
}

function makeAIMove(board, isMaximizing, difficulty) {
  if (difficulty === "easy") {
    // Choose a random available square
    const availableSquares = board.reduce((squares, value, index) => {
      if (value === null) {
        squares.push(index);
      }
      return squares;
    }, []);
    return availableSquares[
      Math.floor(Math.random() * availableSquares.length)
    ];
  } else if (difficulty === "medium") {
    // Check for winning moves
    const winningMove = checkForWinningMove(board, isMaximizing ? "O" : "X");
    if (winningMove !== -1) {
      return winningMove;
    }

    // Check if the player can win and block it
    const blockingMove = checkForWinningMove(board, isMaximizing ? "X" : "O");
    if (blockingMove !== -1) {
      return blockingMove;
    }

    // If neither applies, choose a random available square
    const availableSquares = board.reduce((squares, value, index) => {
      if (value === null) {
        squares.push(index);
      }
      return squares;
    }, []);
    return availableSquares[
      Math.floor(Math.random() * availableSquares.length)
    ];
  } else if (difficulty === "hard") {
    const bestMove = minimax(board, 0, isMaximizing, -Infinity, Infinity);
    return bestMove.index;
  }
}

function checkForWinningMove(board, player) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] === player && board[b] === player && board[c] === null) {
      return c;
    } else if (
      board[a] === player &&
      board[c] === player &&
      board[b] === null
    ) {
      return b;
    } else if (
      board[b] === player &&
      board[c] === player &&
      board[a] === null
    ) {
      return a;
    }
  }

  return -1;
}

export default TickAI;
