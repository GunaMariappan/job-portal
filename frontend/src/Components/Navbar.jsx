import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const candidateLinks = [
    { label: 'Dashboard', path: '/candidate/dashboard' },
    { label: 'Browse Jobs', path: '/candidate/jobs' },
    { label: 'Saved Jobs', path: '/candidate/saved-jobs' },
    { label: 'Applied Jobs', path: '/candidate/applied-jobs' },
    { label: 'Profile', path: '/candidate/profile' },
  ]

  const recruiterLinks = [
    { label: 'Dashboard', path: '/recruiter/dashboard' },
    { label: 'Post Job', path: '/recruiter/post-job' },
  ]

  const adminLinks = [
    { label: 'Admin Dashboard', path: '/admin/dashboard' },
  ]

  const getLinks = () => {
    if (user?.role === 'candidate') return candidateLinks
    if (user?.role === 'recruiter') return recruiterLinks
    if (user?.role === 'admin') return adminLinks
    return []
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JP</span>
            </div>
            <span className="text-xl font-bold text-indigo-600">JobPortal</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {getLinks().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-sm">
                      {user.full_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{user.full_name}</span>
                </div>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-700 font-medium px-4 py-2 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-600 hover:text-indigo-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100">
            <div className="flex flex-col gap-2">
              {getLinks().map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={logout}
                  className="text-left bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium mt-2"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    className="text-center text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg font-medium">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)}
                    className="text-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar