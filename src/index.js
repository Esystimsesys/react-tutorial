import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

const Board = (props) => {
  const renderSquare = (i) => {
    return (
      <Square
        key={i}
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  };

  const rows = [];
  for (let i = 0; i < 3; i++){
    const cols = [];
    for (let j = 0; j < 3; j++){
      cols.push(renderSquare(i * 3 + j));
    }
    rows.push(
      <div key={i} className="board-row">
        {cols}
      </div>);
  }

  return (
    <div>{rows}</div>
  );
};


const Game = () => {
  const [state, setState] = useState({
    history: [{
      squares: Array(9).fill(null),
      move: Array(2).fill(null),
    }],
    stepNumber: 0,
    xIsNext: true,
  });


  const handleClick = (i) => {
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];

    const squares = [...current.squares];
    if (calculateWinner(current.squares) || squares[i]) return;

    squares[i] = state.xIsNext ? "X" : "O";
    const rowNo = Math.floor(i / 3) + 1;
    const colNo = i % 3 + 1;
    setState({
      history: history.concat([{ squares: squares, move: [colNo, rowNo] }]),
      stepNumber: history.length,
      xIsNext: !state.xIsNext,
    });
  };

  const jumpTo = (step) => {
    setState({
      history: [...state.history],
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  };
  
  const history = state.history;
  const current = history[state.stepNumber];

  const moves = history.map((step, move) => {
    const desc = move ?
      "Go to move #" + move + "(" + step.move[0] + "," + step.move[1] + ")" :
      "Go to game start";
    
    return (
      <li key={move}>
        <button
          className={(move == state.stepNumber) ? "game-info-current" : ""}
          onClick={() => jumpTo(move)}
        >
          {desc}
        </button>
      </li>
    );
  });

  
  const winner = calculateWinner(current.squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = 'Next player: ' + (state.xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={ (i) => handleClick(i) }/>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
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
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

