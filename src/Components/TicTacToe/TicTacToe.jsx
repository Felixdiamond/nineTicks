import React, { useState } from "react";
import "./TicTacToe.css";
import circle_icon from "../Assets/circle.png";
import cross_icon from "../Assets/cross.png";

const TicTacToe = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [xIsNext, setXIsNext] = useState(true);
  const [winningLine, setWinningLine] = useState([]);
  const [stepNumber, setStepNumber] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const winner = calculateWinner(history[stepNumber]);

  const handleClick = (i) => {
    const historyPoint = history.slice(0, stepNumber + 1);
    const current = historyPoint[stepNumber];
    const squares = [...current];

    // Check if the game is already won or if the square is already filled
    if (calculateWinner(squares) || squares[i]) return;

    squares[i] = xIsNext ? (
      <div className="marker" data-marker="x">
        <img src={cross_icon} alt="cross" />
      </div>
    ) : (
      <div className="marker" data-marker="o">
        <img
          className="marker"
          src={circle_icon}
          alt="circle"
        />
      </div>
    );

    // squares[i] = xIsNext ? (
    //     <img data-marker="x" src={cross_icon} alt="cross" />
    // ) : (
    //     <img
    //       data-marker="o"
    //       className="marker"
    //       src={circle_icon}
    //       alt="circle"
    //     />
    // );

    setHistory([...historyPoint, squares]);
    setStepNumber(historyPoint.length);
    setXIsNext(!xIsNext);

    // Update the winning line state
    const result = calculateWinner(squares);
    if (result && result.length === 2) {
      setWinningLine(result[1]);
    } else {
      setWinningLine([]);
    }
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const renderMoves = () =>
    history.map((_step, move) => {
      const destination = move ? `Go to move #${move}` : "Start new game";
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{destination}</button>
        </li>
      );
    });

  return (
    <div className="container">
      {/* Add a button to toggle the dropdown */}
      <button
        className="dropdown-toggle"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        History
      </button>
      {showDropdown && <ul className="dropdown-menu">{renderMoves()}</ul>}
      <h1 className="title">
        <span>nineTicks</span>
      </h1>
      <div className="board">
        {history[stepNumber].map((_, i) => (
          <button
            className={`square ${
              winningLine.includes(i) ? "winning-line" : ""
            }`}
            onClick={() => handleClick(i)}
          >
            {history[stepNumber][i]}
          </button>
        ))}
      </div>
      <div className="info-wrapper">
        <h3>
          {winner ? "Winner: " + winner[0] : (xIsNext ? "X" : "O") + "'s turn"}
        </h3>
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
    if (squares[a] && squares[b] && squares[c]) {
      if (
        squares[a].props["data-marker"] === squares[b].props["data-marker"] &&
        squares[a].props["data-marker"] === squares[c].props["data-marker"]
      ) {
        return [squares[a].props["data-marker"], lines[i]];
      }
    }
  }

  return null;
}

export default TicTacToe;
