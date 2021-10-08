// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'
function Board({squares, onClick}) {
  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [currentSquares, setCurrentSquares] = useLocalStorageState(
    'squares',
    Array(9).fill(null),
  )
  const [history, setHistory] = React.useState([])
  const [currentStep, setCurrentStep] = React.useState(0)

  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function restart() {
    setCurrentSquares(Array(9).fill(null))
    setHistory([])
    setCurrentStep(0)
  }

  function selectSquare(square) {
    if (winner || currentSquares[square]) {
      return
    }

    let squaresCopy = [...currentSquares]
    squaresCopy[square] = nextValue
    setCurrentSquares(squaresCopy)

    let historyCopy = [...history]
    if (currentStep <= history.length) {
      historyCopy.splice(currentStep, history.length - currentStep)
    }
    historyCopy.push(currentSquares)
    setHistory(historyCopy)

    calcMoves(historyCopy, currentStep)
    setCurrentStep(currentStep + 1)
  }

  function onClickStep(step) {
    setCurrentStep(step)
    if (step >= history.length) {
      step = history.length - 1
    }
    setCurrentSquares(history[step])
  }

  function calcFirstMove(curr) {
    return (
      <li key={0}>
        <button
          disabled={Boolean(curr)}
          onClick={() => onClickStep(0)}
        >{`Go to game start ${curr}`}</button>
      </li>
    )
  }

  function calcMoves(history, currentStep) {
    const moves = []

    moves.push(calcFirstMove(0 === currentStep ? '(current)' : ''))

    history.forEach((item, idx) => {
      const curr = idx === currentStep - 1 ? '(current)' : ''
      const text = `move #${idx + 1}`
      moves.push(
        <li key={idx + 1}>
          <button
            disabled={Boolean(curr)}
            onClick={() => onClickStep(idx + 1)}
          >{`Go to ${text} ${curr}`}</button>
        </li>,
      )
    })
    return moves
  }

  const moves = calcMoves(history, currentStep)

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
