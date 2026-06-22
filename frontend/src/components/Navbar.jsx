import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) =>
    location.pathname === path
      ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1'
      : 'text-gray-300 hover:text-white'

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <span className="text-white font-bold text-lg">WealthPilot <span className="text-indigo-400">AI</span></span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <Link to="/dashboard" className={`text-sm font-medium transition ${isActive('/dashboard')}`}>Dashboard</Link>
        <Link to="/profile"   className={`text-sm font-medium transition ${isActive('/profile')}`}>Profile</Link>
        <Link to="/goals"     className={`text-sm font-medium transition ${isActive('/goals')}`}>Goals</Link>
        <Link to="/portfolio" className={`text-sm font-medium transition ${isActive('/portfolio')}`}>Portfolio</Link>
      </div>

      {/* User + Logout */}
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm hidden sm:block">
          👋 {user?.name || 'User'}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
