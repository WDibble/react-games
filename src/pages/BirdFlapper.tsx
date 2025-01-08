import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export function BirdFlapper() {
  const gravity = 0.25
  const jumpVelocity = -6
  const gapSize = 160
  const pipeWidth = 60
  const birdSize = 40
  const birdX = 50

  const [birdY, setBirdY] = useState(200)
  const [velocity, setVelocity] = useState(0)
  const [pipes, setPipes] = useState([{ x: 300, topHeight: 150, scored: false }])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const gameLoopRef = useRef<number>()
  const containerRef = useRef<HTMLDivElement>(null)

  const flap = () => {
    if (!gameOver) setVelocity(jumpVelocity)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') flap()
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [gameOver])

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  })

  function gameLoop() {
    if (gameOver) return
    setBirdY(y => y + velocity)
    setVelocity(v => v + gravity)

    setPipes(prev => {
      const newPipes = prev
        .map(p => {
          const nextX = p.x - 1
          if (!p.scored && nextX + pipeWidth < birdX) {
            setScore(s => s + 1)
            return { ...p, x: nextX, scored: true }
          }
          return { ...p, x: nextX }
        })
        .filter(p => p.x + pipeWidth > 0)

      if (newPipes.length && newPipes[newPipes.length - 1].x < 200) {
        const newHeight = 50 + Math.floor(Math.random() * 150)
        newPipes.push({ x: 600, topHeight: newHeight, scored: false })
      }
      return newPipes
    })

    checkCollision()
    if (gameLoopRef.current) {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }
  }

  function checkCollision() {
    const containerHeight = containerRef.current?.clientHeight ?? 600
    const birdBottom = birdY + birdSize

    if (birdBottom > containerHeight || birdY < 0) {
      setGameOver(true)
    }

    for (let i = 0; i < pipes.length; i++) {
      const p = pipes[i]
      const pipeLeft = p.x
      const pipeRight = p.x + pipeWidth
      const topPipeBottom = p.topHeight
      const bottomPipeTop = p.topHeight + gapSize

      if (
        pipeLeft < birdX + birdSize &&
        pipeRight > birdX &&
        (birdY < topPipeBottom || birdBottom > bottomPipeTop)
      ) {
        setGameOver(true)
        return
      }
    }
  }

  const resetGame = () => {
    setBirdY(200)
    setVelocity(0)
    setPipes([{ x: 300, topHeight: 150, scored: false }])
    setScore(0)
    setGameOver(false)
  }

  return (
    <div className="game-container">
      <div className="iphone-frame">
        <div
          ref={containerRef}
          onClick={flap}
          style={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            background: 'linear-gradient(to bottom, #87CEEB, #B0E0E6)'
          }}
        >
          <div className="w-full max-w-md p-4" style={{ position: 'absolute', top: 0, zIndex: 10 }}>
            <header className="py-8 px-4 sm:px-6 lg:px-8" style={{ background: 'rgba(255, 255, 255, 0.5)', padding: '10px', borderRadius: '10px' }}>
              <Link to="/">
                <h1 className="text-1xl font-bold text-gray-800 text-center font-['CustomFont'] hover:text-gray-600 transition-colors">
                  REACT GAMES
                </h1>
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 text-center font-['CustomFont']">
                Bird Flapper
              </h1>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'black',
                  textAlign: 'center',
                  marginTop: '0px'
                }}
              >
                Score: {score}
              </div>
            </header>
          </div>

          {/* Bird */}
          {!gameOver && (
            <div
              style={{
                position: 'absolute',
                left: `${birdX}px`,
                top: `${birdY}px`,
                width: `${birdSize}px`,
                height: `${birdSize}px`
              }}
            >
              {/* Body */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, yellow, orange)'
                }}
              />
              {/* Eye */}
              <div
                style={{
                  position: 'absolute',
                  left: '65%',
                  top: '20%',
                  width: '15%',
                  height: '15%',
                  borderRadius: '50%',
                  background: '#fff'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '68%',
                  top: '25%',
                  width: '7%',
                  height: '7%',
                  borderRadius: '50%',
                  background: '#000'
                }}
              />
              {/* Beak */}
              <div
                style={{
                  position: 'absolute',
                  left: '85%',
                  top: '45%',
                  width: '0',
                  height: '0',
                  borderLeft: '6px solid orange',
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent'
                }}
              />
            </div>
          )}

          {/* Pipes */}
          {pipes.map((p, i) => (
            <div key={i}>
              {/* Top Pipe */}
              <div
                style={{
                  position: 'absolute',
                  left: `${p.x}px`,
                  top: '0px',
                  width: `${pipeWidth}px`,
                  height: `${p.topHeight}px`,
                  background: 'linear-gradient(to bottom, #228B22, #006400)',
                  border: '2px solid #003300',
                  borderRadius: '8px'
                }}
              />
              {/* Bottom Pipe */}
              <div
                style={{
                  position: 'absolute',
                  left: `${p.x}px`,
                  top: `${p.topHeight + gapSize}px`,
                  width: `${pipeWidth}px`,
                  height: '1000px',
                  background: 'linear-gradient(to bottom, #228B22, #006400)',
                  border: '2px solid #003300',
                  borderRadius: '8px'
                }}
              />
            </div>
          ))}

          {/* Game Over */}
          {gameOver && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(255,255,255,0.85)',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center'
              }}
            >
              <button
                onClick={resetGame}
                style={{
                  padding: '10px 20px',
                  fontSize: '18px',
                  background: '#BBBBBB',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}