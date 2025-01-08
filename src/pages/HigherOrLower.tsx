import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

type Card = {
  value: number
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  display: string
}

const createDeck = () => {
  const suits: ('hearts' | 'diamonds' | 'clubs' | 'spades')[] = ['hearts', 'diamonds', 'clubs', 'spades']
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const newDeck: Card[] = []

  suits.forEach(suit => {
    values.forEach((value, index) => {
      newDeck.push({
        value: index + 1,
        suit,
        display: value
      })
    })
  })

  return shuffle(newDeck)
}

const shuffle = (array: Card[]) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function HigherOrLower() {
  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const [nextCard, setNextCard] = useState<Card | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0) // Add high score
  const [gameOver, setGameOver] = useState(false)
  const [deck, setDeck] = useState<Card[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [loading, setLoading] = useState(true)

  const drawCard = useCallback(() => {
    if (deck.length === 0) {
      setGameOver(true)
      return null
    }
    const newDeck = [...deck]
    const card = newDeck.pop()
    if (!card) return null
    setDeck(newDeck)
    return card
  }, [deck])

  useEffect(() => {
    const newDeck = createDeck()
    setDeck(newDeck)
    const firstCard = newDeck[newDeck.length - 1]
    const secondCard = newDeck[newDeck.length - 2]
    
    if (firstCard && secondCard) {
      setCurrentCard(firstCard)
      setNextCard(secondCard)
      setDeck(newDeck.slice(0, -2))
    }
    
    setLoading(false)
  }, [])

  const initializeGame = useCallback(() => {
  try {
    const newDeck = createDeck()
    setDeck(newDeck)
    const firstCard = newDeck[newDeck.length - 1]
    const secondCard = newDeck[newDeck.length - 2]
    
    if (firstCard && secondCard) {
      setCurrentCard(firstCard)
      setNextCard(secondCard)
      setDeck(newDeck.slice(0, -2))
    }
    
    setScore(0)
    setGameOver(false)
    setShowResult(false)
    setLoading(false)
  } catch (error) {
    console.error('Error initializing game:', error)
    setLoading(false)
    setGameOver(true)
  }
}, [])

  const handleGuess = (higher: boolean) => {
    if (!currentCard || !nextCard || gameOver) return
  
    const isCorrectGuess = higher 
      ? nextCard.value >= currentCard.value
      : nextCard.value <= currentCard.value
  
    setIsCorrect(isCorrectGuess)
    setShowResult(true)
  
    const timeoutId = setTimeout(() => {
      if (isCorrectGuess) {
        const newScore = score + 1
        setScore(newScore)
        setHighScore(Math.max(newScore, highScore))
        setCurrentCard(nextCard)
        const newCard = drawCard()
        setNextCard(newCard)
        setShowResult(false)
      } else {
        // Update high score before resetting
        setHighScore(Math.max(score, highScore))
        // Auto-reset game after 1 second
        setTimeout(() => {
          initializeGame()
        }, 1000)
      }
    }, 1000)
  
    return () => clearTimeout(timeoutId)
  }

  const getSuitColor = (suit: 'hearts' | 'diamonds' | 'clubs' | 'spades') => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-gray-800'
  }

  const getSuitSymbol = (suit: 'hearts' | 'diamonds' | 'clubs' | 'spades') => {
    switch (suit) {
      case 'hearts': return '♥'
      case 'diamonds': return '♦'
      case 'clubs': return '♣'
      case 'spades': return '♠'
      default: return ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!currentCard) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-green-800 flex flex-col items-center pt-4">
      <div className="w-full max-w-md p-4">
        <header className="py-4 px-4">
          <Link to="/">
            <h1 className="text-xl font-bold text-white text-center font-['CustomFont'] hover:text-gray-200 transition-colors">
              REACT GAMES
            </h1>
          </Link>
          <h1 className="text-3xl font-bold text-white text-center font-['CustomFont'] mb-4">
            Higher or Lower
          </h1>
          <div className="text-2xl font-bold text-white text-center">
            Score: {score} | High Score: {highScore}
          </div>
        </header>

        <div className="relative h-96 flex items-center justify-center">
          {/* Current Card */}
          <div className={`absolute bg-white rounded-xl w-64 h-96 shadow-xl 
            ${showResult ? 'transform -translate-x-40 transition-transform duration-500' : '-translate-x-6'}`}>
            <div className="p-6 flex flex-col h-full">
              <div className={`text-4xl ${getSuitColor(currentCard.suit)}`}>
                {currentCard.display}
              </div>
              <div className={`text-8xl ${getSuitColor(currentCard.suit)} flex-grow flex items-center justify-center`}>
                {getSuitSymbol(currentCard.suit)}
              </div>
              <div className={`text-4xl ${getSuitColor(currentCard.suit)} self-end transform rotate-180`}>
                {currentCard.display}
              </div>
            </div>
          </div>

          {/* Next Card */}
          {nextCard && (
            <div className={`absolute bg-white rounded-xl w-64 h-96 shadow-xl transform 
              ${showResult ? 'translate-x-40' : 'translate-x-6'} transition-transform duration-500`}>
              <div className="p-6 flex flex-col h-full">
                <div className={`text-4xl ${getSuitColor(nextCard.suit)}`}>
                  {showResult ? nextCard.display : '?'}
                </div>
                <div className={`text-8xl ${getSuitColor(nextCard.suit)} flex-grow flex items-center justify-center`}>
                  {showResult ? getSuitSymbol(nextCard.suit) : '?'}
                </div>
                <div className={`text-4xl ${getSuitColor(nextCard.suit)} self-end transform rotate-180`}>
                  {showResult ? nextCard.display : '?'}
                </div>
              </div>
            </div>
          )}

          {/* Result Overlay */}
          {showResult && (
            <div className={`absolute inset-0 flex items-center justify-center text-6xl font-bold
              ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? 'CORRECT!' : 'WRONG!'}
            </div>
          )}
        </div>

        {gameOver ? (
          <div className="mt-8 flex justify-center">
            <button
              onClick={initializeGame}
              className="px-6 py-3 bg-white text-green-800 rounded-lg font-bold text-xl hover:bg-gray-100"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => handleGuess(false)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold text-xl hover:bg-red-600"
              disabled={showResult}
            >
              Lower
            </button>
            <button
              onClick={() => handleGuess(true)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold text-xl hover:bg-green-600"
              disabled={showResult}
            >
              Higher
            </button>
          </div>
        )}
      </div>
    </div>
  )
}