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
          key={`CellNumber:${i}`}
        />
      ); 
    }

    renderRows() {
      let rows = [];
      for(let i = 0; i < this.props.heightLen; i++) {
        let rowCells = [];
        for(let it = 0; it < this.props.heightLen; it++) {
          rowCells.push(this.renderSquare(it + (i * this.props.heightLen)));
        }
      rows.push(<div className="board-row" key={`Row:${i}`}>{rowCells}</div>);
      }
      return rows;
    }
  
    render() {
      return (
        <div>
          {this.renderRows()}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        history: [{
          squares: Array(this.props.heightLen**2).fill(null),
          changed: [0, 0],
        }],
        stepNumber: 0,
        xIsNext: true,
        orderHistoryAsc: true,
      }
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if(calculateWinner(squares, this.props.heightLen) || squares[i]) return;

      squares[i] = this.state.xIsNext ? 'X' : 'O';
      
      this.setState({
        history: history.concat([{
          squares: squares,
          changed: makeCoordinate(i, this.props.heightLen),
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
      const winner = calculateWinner(current.squares, this.props.heightLen);

      let moves = history.map((step, move, arr) => {
        const desc = move ? `Move ${move} (${step.changed[0]}, ${step.changed[1]})` 
          : `Goto start.`;
        let weight = move === this.state.stepNumber ? 'bold-text' : '';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)} className={weight}>{desc}</button> 
          </li>
        );
      });
      let status = winner ? `Winner ${winner}` : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

      moves = this.state.orderHistoryAsc ? moves.reverse() : moves;
      let reorder = this.state.orderHistoryAsc ? 'Ascending' : 'Descending';
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              heightLen={this.props.heightLen}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div>
              <button 
                onClick={() => this.setState({orderHistoryAsc: !this.state.orderHistoryAsc})}
              >
                {reorder}
              </button>
            </div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
function makeCoordinate(num, heightLen) {
  return [num % heightLen, Math.floor(num / heightLen)];
}

  function calculateWinner(squares, size) {
    console.log(Array.from({length: size** 2},(v,k)=>k))
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
      heightLen={3}
    />,
    document.getElementById('root')
  );
  