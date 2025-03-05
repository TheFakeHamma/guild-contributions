import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide">Powerhouse Club</h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 text-lg">
          <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
          <Link to="/register" className="hover:text-yellow-400 transition">Register</Link>
          <Link to="/leaderboard" className="hover:text-yellow-400 transition">Leaderboard</Link>
          <Link to="/recruitment" className="hover:text-yellow-400 transition">Recruit</Link>
          <Link to="/contribution" className="hover:text-yellow-400 transition">Contribute</Link>
          <Link to="/users" className="hover:text-yellow-400 transition">Users</Link>
          <Link to="/recruits" className="hover:text-yellow-400 transition">Recruits</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center mt-4 space-y-3 bg-gray-900 p-4 rounded-lg shadow-lg">
          <Link to="/" className="hover:text-yellow-400 transition" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/register" className="hover:text-yellow-400 transition" onClick={() => setIsOpen(false)}>Register</Link>
          <Link to="/leaderboard" className="hover:text-yellow-400 transition" onClick={() => setIsOpen(false)}>Leaderboard</Link>
          <Link to="/recruitment" className="hover:text-yellow-400 transition" onClick={() => setIsOpen(false)}>Recruit</Link>
          <Link to="/contribution" className="hover:text-yellow-400 transition" onClick={() => setIsOpen(false)}>Contribute</Link>
          <Link to="/users" className="hover:text-yellow-400 transition" onClick={() => setIsOpen(false)}>Users</Link>
          <Link to="/recruits" className="hover:text-yellow-400 transition" onClick={() => setIsOpen(false)}>Recruits</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
