import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export function WordGuesser() {
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(''))
  const [currentGuess, setCurrentGuess] = useState('')
  const [currentRow, setCurrentRow] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [answer] = useState('REACT')
  const inputRef = useRef<HTMLInputElement>(null)

  const submitGuess = useCallback(() => {
    if (currentRow < 6) {
      const newGuesses = [...guesses]
      newGuesses[currentRow] = currentGuess
      setGuesses(newGuesses)
      setCurrentRow(currentRow + 1)
      setCurrentGuess('')
      
      if (currentGuess === answer) {
        setGameOver(true)
      } else if (currentRow === 5) {
        setGameOver(true)
      }
    }
  }, [currentRow, currentGuess, guesses, answer])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return
      
      if (e.key === 'Enter' && currentGuess.length === 5) {
        submitGuess()
        e.preventDefault()
      } else if (e.key === 'Backspace' && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        setCurrentGuess(currentGuess.slice(0, -1))
      } else if (currentGuess.length < 5 && e.key.match(/^[a-zA-Z]$/) && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        setCurrentGuess(currentGuess + e.key.toUpperCase())
      }
    }

    // Only add keyboard listener if not on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) {
      document.addEventListener('keydown', handleKeyPress)
      return () => document.removeEventListener('keydown', handleKeyPress)
    }
  }, [gameOver, currentGuess, currentRow, submitGuess])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    if (value.length <= 5 && value.match(/^[A-Z]*$/)) {
      setCurrentGuess(value)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentGuess.length === 5) {
      submitGuess()
      e.preventDefault()
    }
  }

  const focusInput = () => {
    inputRef.current?.focus()
  }

  const getLetterClassName = (letter: string, index: number, row: number) => {
    if (guesses[row] === '') return 'bg-white border-2 border-gray-300'
    
    if (letter === answer[index]) {
      return 'bg-green-500 text-white'
    } else if (answer.includes(letter)) {
      return 'bg-yellow-500 text-white'
    } else {
      return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center pt-4">
      <input
        ref={inputRef}
        type="text"
        value={currentGuess}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        maxLength={5}
        className="opacity-0 absolute"
        autoCapitalize="characters"
        autoComplete="off"
        autoCorrect="off"
      />
      
      <div className="w-full max-w-md p-4" onClick={focusInput}>
        <header className="py-8 px-4 sm:px-6 lg:px-8">
          <Link to="/">
            <h1 className="text-1xl font-bold text-gray-800 text-center font-['CustomFont'] hover:text-gray-600 transition-colors">
              REACT GAMES
            </h1>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 text-center font-['CustomFont']">
            Word Guesser
          </h1>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-sm mx-auto">
            <div className="grid grid-rows-6 gap-2">
              {Array(6).fill(null).map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-2">
                  {Array(5).fill(null).map((_, colIndex) => {
                    const letter = rowIndex === currentRow 
                      ? currentGuess[colIndex] || ''
                      : guesses[rowIndex][colIndex] || ''
                    
                    return (
                      <div
                        key={colIndex}
                        className={`
                          w-full aspect-square flex items-center justify-center
                          text-2xl font-bold rounded
                          ${rowIndex === currentRow 
                            ? 'bg-white border-2 border-gray-300' 
                            : getLetterClassName(letter, colIndex, rowIndex)}
                        `}
                      >
                        {letter}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {gameOver && (
              <div className="mt-8 text-center">
                <p className="text-xl font-bold text-gray-800">
                  {currentGuess === answer ? 'You won!' : `Game Over! The word was ${answer}`}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}