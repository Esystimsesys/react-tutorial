import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
  return (
    <button
      //勝利につながったマスの場合はハイライト用のクラスを追加
      className={props.win ? "square square-win" : "square"}
      onClick={props.onClick}
    >
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
        win={props.winLine.includes(i)}
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
      </div>
    );
  }

  return (
    <div>{rows}</div>
  );
};


const Game = () => {
  //ゲームで保持するステートを定義
  const [state, setState] = useState({
    history: [{
      squares: Array(9).fill(null), //全マスの状態を格納した配列
      move: null,                   //直前に差した手のマス番号
      winLine: Array(3).fill(null), //勝利した場合に勝利につながった3マスのマス番号を格納した配列
    }],
    stepNumber: 0,  //表示するステップ番号
    xIsNext: true,  //次のプレイヤーがXかどうか
    sortAscend: true, //履歴表示を昇順とするかどうか
  });

  //マスをクリックした際の動作を定義する関数定義
  const handleClick = (i) => {
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares];
    
    //既に勝利している場合、またはクリックされたマスが既にプレイされたマスの場合は何もせずリターン
    const [winner,] = calculateWinner(current.squares);
    if (winner || squares[i]) return;

    //クリックした手の情報をステートに記録
    squares[i] = state.xIsNext ? "X" : "O";
    const [, winLine] = calculateWinner(squares);

    setState({
      history: history.concat([{ squares: squares, move: i, winLine: winLine }]),
      stepNumber: history.length,
      xIsNext: !state.xIsNext,
      sortAscend: state.sortAscend,
    });
  };

  //履歴をクリックした際に該当する手に遷移する関数定義
  const jumpTo = (step) => {
    setState({
      history: [...state.history],
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  };

  //履歴表示の昇順・降順を切り替える関数定義
  const changeSort = () => {
    const newState = { ...state };
    newState.sortAscend = !newState.sortAscend;
    setState(newState);
  };
  
  const history = state.history;
  const current = history[state.stepNumber];

  //履歴情報のJSXを作成
  const moves = history.map((step, move) => {
    //履歴に表示する行列番号を算出
    const rowNo = Math.floor(step.move / 3) + 1;
    const colNo = step.move % 3 + 1;

    //履歴情報として表示するの文字列を作成
    const desc = move ?
      "Go to move #" + move + "(" + colNo + "," + rowNo + ")" :
      "Go to game start";
    
    return (
      <li key={move}>
        <button
          //表示している手の履歴情報を強調表示するためのクラスを設定
          className={(move == state.stepNumber) ? "game-info-current" : ""}
          onClick={() => jumpTo(move)}
        >
          {desc}
        </button>
      </li>
    );
  });

  
  //ゲームステータスを表示するための文字列を設定
  const [winner, ] = calculateWinner(current.squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = 'Next player: ' + (state.xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} winLine={current.winLine} onClick={ (i) => handleClick(i) }/>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button onClick={changeSort}>
          {state.sortAscend ? "Sort Ascend" : "Sort Descend"}
        </button>
        <ol>
          {state.sortAscend ? moves : moves.reverse()}
        </ol>
      </div>
    </div>
  );
};

//マス情報を引数として勝者を計算する関数
//勝利したプレイヤーと、勝利につながった３つのマス番号の配列を返却する
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
      return [squares[a], [a, b, c]];
    }
  }
  return [null, Array(3).fill(null)];
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

