import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button
      className={`square ${props.isHighlight? " highlight" : ""}` } 
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}
console.log('test');

class Board extends React.Component {
  renderSquare(i) {
    console.log(this.props.line, i);
    return (
      <Square
        key={i}
        isHighlight={this.props.line.indexOf(i) > -1}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  // 使用两个循环来渲染棋盘格子
  render() {
    return (
      <div>
        {
          // map函数可以不用return，只是此时 {} 需改为 ()
          Array(3).fill(null).map((item, index1) => (
            <div className="board-row" key={index1}>
              {
                Array(3).fill(null).map((item, index2) => (
                  this.renderSquare(index1*3 + index2)
                ))
              }
            </div>
          ))
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0, // 记录第几步
      sort: true,  // 排序：默认升序
    };
  }
  // 落子
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // 当决出胜者，或者该棋格已有棋子
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      squares: squares,
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }
  // 跳转某一步棋
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  // 步骤记录列表的排序(升序降序)
  handleSort() {
    this.setState({
      sort: !this.state.sort
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const move = history.map((step, move) => {
      const description = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={this.state.stepNumber === move ? 'current-step': ''}
          >
            {description}
          </button>
        </li>
      );
    });
    let status, line;
    if (winner) {
      status = "winner: " + winner.winnerName;
      line = winner.winnerLine;
    } else if(this.state.stepNumber ===9) {
      // 平局
      status = "There's no winner";
      line = [];
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      line = [];
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            line={line}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleSort()}>{this.state.sort ? "降序" : "升序"}</button>
          <ol>{this.state.sort ? move : move.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

// 决出胜者
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
      return {
        winnerName: squares[a], // 胜者
        winnerLine: [a, b, c]  // 连成一条直线的格子
      };
    }
  }
  return null;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
