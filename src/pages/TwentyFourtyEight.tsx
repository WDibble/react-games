import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SIZE = 4

const generateEmptyGrid = () => {
  return Array(SIZE).fill(null).map(() => Array(SIZE).fill(0))
}

const addRandomTile = (grid: number[][]) => {
  const emptyTiles = []
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (grid[row][col] === 0) {
        emptyTiles.push({ row, col })
      }
    }
  }
  if (emptyTiles.length === 0) return grid

  const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]
  grid[row][col] = Math.random() < 0.9 ? 2 : 4
  return grid
}

const moveLeft = (grid: number[][]) => {
  const newGrid = grid.map(row => {
    const newRow = row.filter(val => val !== 0)
    while (newRow.length < SIZE) newRow.push(0)
    return newRow
  })
  return newGrid
}

const combineLeft = (grid: number[][]) => {
  const newGrid = grid.map(row => {
    for (let col = 0; col < SIZE - 1; col++) {
      if (row[col] !== 0 && row[col] === row[col + 1]) {
        row[col] *= 2
        row[col + 1] = 0
      }
    }
    return row
  })
  return newGrid
}

const rotateGridClockwise = (grid: number[][]) => {
  const newGrid = generateEmptyGrid()
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      newGrid[col][SIZE - row - 1] = grid[row][col]
    }
  }
  return newGrid
}

const rotateGridCounterClockwise = (grid: number[][]) => {
  const newGrid = generateEmptyGrid()
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      newGrid[SIZE - col - 1][row] = grid[row][col]
    }
  }
  return newGrid
}

const moveGrid = (grid: number[][], direction: number) => {
  let newGrid = grid
  switch (direction) {
    case 0: // Up
      newGrid = rotateGridCounterClockwise(grid)
      newGrid = moveLeft(newGrid)
      newGrid = combineLeft(newGrid)
      newGrid = moveLeft(newGrid)
      newGrid = rotateGridClockwise(newGrid)
      break
    case 1: // Right
      newGrid = rotateGridClockwise(grid)
      newGrid = rotateGridClockwise(newGrid)
      newGrid = moveLeft(newGrid)
      newGrid = combineLeft(newGrid)
      newGrid = moveLeft(newGrid)
      newGrid = rotateGridCounterClockwise(newGrid)
      newGrid = rotateGridCounterClockwise(newGrid)
      break
    case 2: // Down
      newGrid = rotateGridClockwise(grid)
      newGrid = moveLeft(newGrid)
      newGrid = combineLeft(newGrid)
      newGrid = moveLeft(newGrid)
      newGrid = rotateGridCounterClockwise(newGrid)
      break
    case 3: // Left
      newGrid = moveLeft(grid)
      newGrid = combineLeft(newGrid)
      newGrid = moveLeft(newGrid)
      break
    default:
      break
  }
  return newGrid
}

const checkGameOver = (grid: number[][]) => {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (grid[row][col] === 0) return false
      if (col < SIZE - 1 && grid[row][col] === grid[row][col + 1]) return false
      if (row < SIZE - 1 && grid[row][col] === grid[row + 1][col]) return false
    }
  }
  return true
}

export default function Game2048() {
  const [grid, setGrid] = useState(addRandomTile(generateEmptyGrid()))
  const [gameOver, setGameOver] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null)

  const handleKeyDown = (e: KeyboardEvent | { key: string }) => {
    if (gameOver) return
    let newGrid
    switch (e.key) {
      case 'ArrowUp':
        newGrid = moveGrid(grid, 0)
        break
      case 'ArrowRight':
        newGrid = moveGrid(grid, 1)
        break
      case 'ArrowDown':
        newGrid = moveGrid(grid, 2)
        break
      case 'ArrowLeft':
        newGrid = moveGrid(grid, 3)
        break
      default:
        return
    }
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      setGrid(addRandomTile(newGrid))
      if (checkGameOver(newGrid)) {
        setGameOver(true)
      }
    }
  }

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStart.x
    const dy = touch.clientY - touchStart.y

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        handleKeyDown({ key: 'ArrowRight' })
      } else {
        handleKeyDown({ key: 'ArrowLeft' })
      }
    } else {
      if (dy > 0) {
        handleKeyDown({ key: 'ArrowDown' })
      } else {
        handleKeyDown({ key: 'ArrowUp' })
      }
    }
    setTouchStart(null)
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [grid, gameOver])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <header className="py-8 px-4 sm:px-6 lg:px-8">
          <Link to="/">
            <h1 className="text-1xl font-bold text-gray-800 text-center font-['CustomFont'] hover:text-gray-600 transition-colors">
              REACT GAMES
            </h1>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 text-center font-['CustomFont']">
            2048
          </h1>
        </header>
      <div className="grid gap-2 bg-gray-800 p-4 rounded-lg">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-2">
            {row.map((tile, colIndex) => (
              <div
                key={colIndex}
                className={`flex items-center justify-center w-16 h-16 text-2xl font-bold text-white rounded-lg ${
                  tile === 0 ? 'bg-gray-200' : `bg-${tileColors[tile] || 'bg-gray-200'}`
                }`}
              >
                {tile !== 0 && tile}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex space-x-4">
        <button onClick={() => handleKeyDown({ key: 'ArrowUp' })} className="p-4 bg-gray-300 rounded text-2xl text-gray-400">↑</button>
        <button onClick={() => handleKeyDown({ key: 'ArrowDown' })} className="p-4 bg-gray-300 rounded text-2xl text-gray-400">↓</button>
        <button onClick={() => handleKeyDown({ key: 'ArrowLeft' })} className="p-4 bg-gray-300 rounded text-2xl text-gray-400">←</button>
        <button onClick={() => handleKeyDown({ key: 'ArrowRight' })} className="p-4 bg-gray-300 rounded text-2xl text-gray-400">→</button>
      </div>
    </div>
  )
}

const tileColors: { [key: number]: string } = {
  2: 'gray-300',
  4: 'gray-400',
  8: 'orange-400',
  16: 'orange-500',
  32: 'orange-600',
  64: 'orange-700',
  128: 'yellow-400',
  256: 'yellow-500',
  512: 'yellow-600',
  1024: 'yellow-700',
  2048: 'yellow-800',
}