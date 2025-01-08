import { Link } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center px-4 sm:px-6">
      {/* Main content */}
      <div className="w-full max-w-md mx-auto mt-8 sm:mt-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-12 text-center font-['CustomFont']">
          REACT GAMES
        </h1>
        
        <nav className="flex flex-col gap-4 w-full">
          <Link 
            to="/wordguesser" 
            className="bg-indigo-50 hover:bg-indigo-100 p-4 sm:p-6 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 text-center"
          >
            <span className="text-xl sm:text-2xl text-gray-800 font-['CustomFont']">
              Word Guesser
            </span>
          </Link>
          <Link 
            to="/BirdFlapper" 
            className="bg-rose-50 hover:bg-rose-100 p-4 sm:p-6 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 text-center"
          >
            <span className="text-xl sm:text-2xl text-gray-800 font-['CustomFont']">
              Bird Flapper
            </span>
          </Link>
          <Link 
            to="/2048"
            className="bg-emerald-50 hover:bg-emerald-100 p-4 sm:p-6 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 text-center"
          >
            <span className="text-xl sm:text-2xl text-gray-800 font-['CustomFont']">
              2048
            </span>
          </Link>
          <Link 
            to="/higherorlower"
            className="bg-pink-50 hover:bg-pink-100 p-4 sm:p-6 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 text-center"
          >
            <span className="text-xl sm:text-2xl text-gray-800 font-['CustomFont']">
              Higher or Lower
            </span>
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default App