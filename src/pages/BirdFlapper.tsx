import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function BirdFlapper() {
  const gravity = 0.2
  const jumpHeight = -5
  const obstacleSpeed = 1
  const obstacleGap = 150
  const obstacleWidth = 60

  const [gameStarted, setGameStarted] = useState(false)
  const [birdY, setBirdY] = useState(200)
  const [velocity, setVelocity] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [obstacles, setObstacles] = useState([{ x: 400, height: 200 }])
  const [score, setScore] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (!gameStarted) setGameStarted(true)
        if (!isGameOver) jump()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, isGameOver])

  useEffect(() => {
    let frameId: number

    function gameLoop() {
      if (gameStarted && !isGameOver) {
        setBirdY(y => y + velocity)
        setVelocity(v => v + gravity)
        
        setObstacles(obs => {
          const updatedObs = obs
            .map(o => ({ ...o, x: o.x - obstacleSpeed }))
            .filter(o => o.x + obstacleWidth > 0)

          if (obs.length && obs[0].x < 200) {
            const newHeight = Math.floor(Math.random() * 200) + 50
            const lastX = obs[obs.length - 1].x
            return [...updatedObs, { x: lastX + 300, height: newHeight }]
          }
          return updatedObs
        })

        if (birdY > 600) {
          setIsGameOver(true)
        }

        frameId = requestAnimationFrame(gameLoop)
      }
    }

    if (gameStarted && !isGameOver) {
      frameId = requestAnimationFrame(gameLoop)
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [gameStarted, isGameOver, birdY, velocity])

  function jump() {
    if (!isGameOver) setVelocity(jumpHeight)
  }

  function resetGame() {
    setGameStarted(false)
    setBirdY(200)
    setVelocity(0)
    setScore(0)
    setObstacles([{ x: 400, height: 200 }])
    setIsGameOver(false)
  }

  return (
    <div className="bg-[#fafafa] min-h-screen flex flex-col items-center pt-4">
      <div
        className="w-full max-w-md bg-white rounded-md shadow-md p-4 flex flex-col relative overflow-hidden"
        style={{ height: '650px' }}
      >
        <header className="text-center pb-4">
          <Link to="/">
            <h1 className="text-1xl font-bold text-gray-800 font-['CustomFont'] hover:text-gray-600 transition-colors">
              REACT GAMES
            </h1>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 font-['CustomFont']">
            Bird Flapper
          </h1>
        </header>

        {gameStarted && !isGameOver && (
          <div className="text-2xl text-gray-700 font-bold mt-2">Score: {score}</div>
        )}

        {gameStarted && !isGameOver && (
          <div
            className="w-12 h-12 bg-yellow-400 rounded-full absolute"
            style={{ top: birdY, left: '50%', transform: 'translateX(-50%)' }}
          />
        )}

        {gameStarted && !isGameOver && obstacles.map((o, i) => (
          <div key={i}>
            <div
              className="absolute bg-green-500"
              style={{
                left: o.x,
                // Top offset for pipe to start just under header
                top: 90,
                width: obstacleWidth,
                height: o.height,
              }}
            />
            <div
              className="absolute bg-green-500"
              style={{
                left: o.x,
                top: o.height + obstacleGap + 90,
                width: obstacleWidth,
                height: 650 - (o.height + obstacleGap),
              }}
            />
          </div>
        ))}

        {!gameStarted && !isGameOver && (
          <button
            onClick={() => setGameStarted(true)}
            className="mt-4 px-6 py-3 bg-blue-600 text-white text-lg rounded-full hover:bg-blue-700 transition-all"
          >
            Start
          </button>
        )}

        {isGameOver && (
          <button
            onClick={resetGame}
            className="mt-4 px-6 py-3 bg-red-600 text-white text-lg rounded-full hover:bg-red-700 transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}