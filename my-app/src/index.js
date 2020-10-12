import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
          className="square"
          onClick={props.onClick}
        >
          {props.value}
        </button>
    );
}
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square 
          value={this.props.squares[i]}  /* The state of the square is stored in the sqares array, in the parent class. */  
          onClick={() => this.props.onClick(i)}
        />
      ); 
    }
  
    render() {
      const squareCount = this.props.cols * this.props.rows;
      let squareArr = Array(squareCount);
      for(let i = 0; i < squareCount; i++) {
        console.log(i);
      }
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        history: [{
          squares: Array(this.props.cols * this.props.rows).fill(null),
          changed: [0, 0],
        }],
        stepNumber: 0,
        xIsNext: true,
      }
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if(calculateWinner(squares) || squares[i]) return;

      squares[i] = this.state.xIsNext ? 'X' : 'O';
      
      this.setState({
        history: history.concat([{
          squares: squares,
          changed: makeCoordinate(i, this.props.cols, this.props.rows),
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      })
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ? `Move ${move} (${step.changed[0]}, ${step.changed[1]})` 
          : `Goto start.`;
        if(move !== this.state.stepNumber) {
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc} </button> 
            </li>
          );
        }
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><strong>{desc}</strong></button> 
          </li>
        )
      });

      let status;
      if(winner) status = `Winner ${winner}`;
      else status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              cols={this.props.cols}
              rows={this.props.rows}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
function makeCoordinate(num, cols, rows) {
  return [num % cols, Math.floor(num / rows)];
}

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
    <Game 
      cols={3}
      rows={3}
    />,
    document.getElementById('root')
  );
  