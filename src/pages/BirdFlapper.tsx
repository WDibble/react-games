import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export function BirdFlapper() {
  // Game constants
  const gravity = 0.15
  const jumpVelocity = -4
  const gapSize = 180
  const pipeWidth = 52
  const birdSize = 32
  const birdX = 80
  const gameSpeed = 2
  const cloudSpeed = 0.5
  const hillSpeed = 1

  // Game state
  const [birdY, setBirdY] = useState(200)
  const [velocity, setVelocity] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [pipes, setPipes] = useState([{ x: 400, topHeight: 150, scored: false }])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [clouds, setClouds] = useState([
    { x: 100, y: 50 },
    { x: 300, y: 80 },
    { x: 600, y: 30 }
  ])
  const [hills, setHills] = useState([
    { x: 0, height: 120 },
    { x: 300, height: 80 },
    { x: 600, height: 100 }
  ])
  
  const gameLoopRef = useRef<number>()
  const containerRef = useRef<HTMLDivElement>(null)

  const flap = () => {
    if (!gameOver) {
      setVelocity(jumpVelocity)
      setRotation(-20)
    }
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

    // Update bird physics
    setBirdY(y => y + velocity)
    setVelocity(v => v + gravity)
    setRotation(r => Math.min(r + 2, 45))

    // Update parallax elements
    setClouds(prev => prev.map(cloud => ({
      ...cloud,
      x: cloud.x - cloudSpeed < -100 ? 800 : cloud.x - cloudSpeed
    })))

    setHills(prev => prev.map(hill => ({
      ...hill,
      x: hill.x - hillSpeed < -300 ? 700 : hill.x - hillSpeed
    })))

    // Update pipes and scoring in a single update
    setPipes(prev => {
      let scoreIncremented = false;
      const newPipes = prev.map(pipe => {
        const nextX = pipe.x - gameSpeed;
        if (!pipe.scored && nextX + pipeWidth < birdX) {
          if (!scoreIncremented) {
            setScore(s => s + 0.5);
            scoreIncremented = true;
          }
          return { ...pipe, x: nextX, scored: true };
        }
        return { ...pipe, x: nextX };
      }).filter(p => p.x + pipeWidth > -100);

      if (newPipes.length && newPipes[newPipes.length - 1].x < 400) {
        newPipes.push({
          x: 800,
          topHeight: 80 + Math.floor(Math.random() * 160),
          scored: false
        });
      }

      return newPipes;
    });

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
    setRotation(0)
    setPipes([{ x: 400, topHeight: 150, scored: false }])
    setScore(0)
    setGameOver(false)
    setClouds([
      { x: 100, y: 50 },
      { x: 300, y: 80 },
      { x: 600, y: 30 }
    ])
    setHills([
      { x: 0, height: 120 },
      { x: 300, height: 80 },
      { x: 600, height: 100 }
    ])
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
            background: 'linear-gradient(to bottom, #64B5F6, #90CAF9, #BBDEFB)'
          }}
        >
          {/* Parallax Clouds */}
          {clouds.map((cloud, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${cloud.x}px`,
                top: `${cloud.y}px`,
                width: '80px',
                height: '40px',
                background: '#fff',
                borderRadius: '20px',
                opacity: 0.9,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                zIndex: 1
              }}
            />
          ))}

          {/* Parallax Hills */}
          {hills.map((hill, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${hill.x}px`,
                bottom: '0',
                width: '300px',
                height: `${hill.height}px`,
                background: '#4CAF50',
                borderRadius: '50% 50% 0 0',
                zIndex: 2
              }}
            />
          ))}

          {/* Score Display */}
          <div className="w-full max-w-md p-4" style={{ position: 'absolute', top: 0, zIndex: 10 }}>
            <header className="py-4 px-4 sm:px-6 lg:px-8" style={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '10px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <Link to="/">
                <h1 className="text-1xl font-bold text-gray-800 text-center font-['CustomFont'] hover:text-gray-600 transition-colors">
                  REACT GAMES
                </h1>
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 text-center font-['CustomFont']">
                Bird Flapper
              </h1>
              <div className="text-2xl font-bold text-gray-800 text-center mt-2">
                {score}
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
                height: `${birdSize}px`,
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.1s',
                zIndex: 5
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#FFB74D',
                  borderRadius: '50% 60% 40% 50%',
                  position: 'relative',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <div style={{
                  position: 'absolute',
                  left: '70%',
                  top: '30%',
                  width: '20%',
                  height: '20%',
                  background: '#FFF',
                  borderRadius: '50%',
                  border: '2px solid #333'
                }} />
                <div style={{
                  position: 'absolute',
                  left: '80%',
                  top: '45%',
                  width: '30%',
                  height: '12%',
                  background: '#FF7043',
                  clipPath: 'polygon(0 0, 100% 50%, 0 100%)'
                }} />
                <div style={{
                  position: 'absolute',
                  left: '0%',
                  top: '40%',
                  width: '60%',
                  height: '25%',
                  background: '#FFA726',
                  borderRadius: '50%',
                  transform: 'rotate(-5deg)'
                }} />
              </div>
            </div>
          )}

          {/* Pipes */}
          {pipes.map((p, i) => (
            <div key={i} style={{ position: 'absolute', zIndex: 4 }}>
              <div
                style={{
                  position: 'absolute',
                  left: `${p.x}px`,
                  top: '0',
                  width: `${pipeWidth}px`,
                  height: `${p.topHeight}px`,
                  background: '#43A047',
                  boxShadow: '2px 0 4px rgba(0,0,0,0.2)',
                  borderRadius: '0 0 4px 4px'
                }}
              >
                <div style={{
                  position: 'absolute',
                  bottom: -20,
                  left: -10,
                  width: `${pipeWidth + 20}px`,
                  height: '20px',
                  background: '#2E7D32',
                  borderRadius: '4px'
                }} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: `${p.x}px`,
                  top: `${p.topHeight + gapSize}px`,
                  width: `${pipeWidth}px`,
                  height: '800px',
                  background: '#43A047',
                  boxShadow: '2px 0 4px rgba(0,0,0,0.2)',
                  borderRadius: '4px 4px 0 0'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: -20,
                  left: -10,
                  width: `${pipeWidth + 20}px`,
                  height: '20px',
                  background: '#2E7D32',
                  borderRadius: '4px'
                }} />
              </div>
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
                background: 'rgba(255,255,255,0.95)',
                padding: '24px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                zIndex: 20
              }}
            >
              <div className="text-2xl font-bold mb-4">Score: {score}</div>
              <button
                onClick={resetGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
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