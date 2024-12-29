import { Link } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center">
      {/* Main content */}
      <div className="relative z-10 mt-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center font-['CustomFont']">
          REACT GAMES
        </h1>
        
        <nav className="flex flex-col w-full max-w-md px-4">
          <Link 
            to="/wordguesser" 
            className="bg-indigo-50 hover:bg-indigo-100 p-6 transition-all duration-300 ease-in-out hover:p-12 transform text-center"
          >
            <span className="text-2xl text-gray-800 font-['CustomFont']">
              Word Guesser
            </span>
          </Link>
          <Link 
            to="/BirdFlapper" 
            className="bg-rose-50 hover:bg-rose-100 p-6 transition-all duration-300 ease-in-out hover:p-12 transform text-center"
          >
            <span className="text-2xl text-gray-800 font-['CustomFont']">
            Bird Flapper
            </span>
          </Link>
          <Link 
            to="/wordguesser" 
            className="bg-emerald-50 hover:bg-emerald-100 p-6 transition-all duration-300 ease-in-out hover:p-12 transform text-center"
          >
            <span className="text-2xl text-gray-800 font-['CustomFont']">
            Word Guesser
            </span>
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default App