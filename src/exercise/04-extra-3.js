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
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    if (winner || currentSquares[square]) {
      return
    }

    let squaresCopy = [...currentSquares]
    squaresCopy[square] = nextValue
    setCurrentSquares(squaresCopy)

    let historyCopy = [...history]
    historyCopy.push(currentSquares)
    setHistory(historyCopy)

    setCurrentStep(currentStep + 1)
  }

  const moves = calcMoves(history, currentStep)
  console.log('moves', moves)
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

function calcMoves(history, currentStep) {
  console.log('sdfhfhsd')
  const moves = []
  let text = 'game start'

  history.forEach((item, idx) => {
    const curr = idx === currentStep - 1 ? '(current)' : ''
    if (idx === 0) {
      moves.push(
        <li key={0}>
          <button disabled={Boolean(curr)}>{`Go to ${text} ${curr}`}</button>
        </li>,
      )
    } else {
      text = `move #${idx}`
      moves.push(
        <li key={idx}>
          <button disabled={Boolean(curr)}>{`Go to ${text} ${curr}`}</button>
        </li>,
      )
    }
  })

  return moves
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
