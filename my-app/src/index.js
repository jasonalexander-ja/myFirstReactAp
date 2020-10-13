import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
      return (
          <button
            className={props.className}
            onClick={props.onClick}
          >
            {props.value}
          </button>
      );
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      let color = 'square';
      if(this.props.winningSqaures) {
        color = this.props.winningSqaures.includes(i) ? 'square-red' : 'square';
      }
      return (
        <Square 
          value={this.props.squares[i]}  /* The state of the square is stored in the sqares array, in the parent class. */  
          onClick={() => this.props.onClick(i)}
          key={`CellNumber:${i}`}
          className={color}
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

      if(calculateWinner(squares, this.props.heightLen)[0] || squares[i]) return;

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
      const [winner, winningSquares] = calculateWinner(current.squares, this.props.heightLen);

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
      let status = winner ? `${winner}` : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

      moves = this.state.orderHistoryAsc ? moves.reverse() : moves;
      let reorder = this.state.orderHistoryAsc ? 'Ascending' : 'Descending';
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              heightLen={this.props.heightLen}
              winningSqaures={winningSquares}
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
    let horizontal = [];
    let verticle = [];
    let diagonalRight = [];
    let diagonalLeft = [];

    for(let i = 0; i < size; i++) {
      horizontal.push(Array.from({length: size},(v,k)=>k + (i * size)));
      verticle.push(Array.from({length: size},(v,k)=>i + (k * size)));
      diagonalRight.push(i + (i * size));
      diagonalLeft.push(size + (((i * size) - i) - 1));
    }

    for(let iter = 0; iter < size; iter++) {
      let horizontalLine = horizontal[iter].map(val => squares[val]);
      if(horizontalLine.every((cell, index, array) => cell === array[0] && array[0])) return [`Winner ${horizontalLine[0]}`, horizontal[iter]];
      let verticleLine = verticle[iter].map(val => squares[val]);
      if(verticleLine.every((cell, index, array) => cell === array[0] && array[0])) return [`Winner ${verticleLine[0]}`, verticle[iter]]; 
    }

    let diagonalRightLine = diagonalRight.map(val => squares[val]);
    if(diagonalRightLine.every((cell, index, array) => cell === array[0] && array[0])) return [`Winner ${diagonalRightLine[0]}`, diagonalRight];
    let diagonalLeftLine = diagonalLeft.map(val => squares[val]);
    if(diagonalLeftLine.every((cell, index, array) => cell === array[0] && array[0])) return [`Winner ${diagonalLeftLine[0]}`, diagonalLeft];

    if(squares.every((cell) => cell)) return ['Draw', []];
    return [null, null];
  }

  // ========================================
  
  ReactDOM.render(
    <Game 
      heightLen={10}
    />,
    document.getElementById('root')
  );
  