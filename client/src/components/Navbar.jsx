import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// FIX: corrected import path from authSlics -> authSlice
import { logout } from '../app/features/authSlice'
import logo from '../assets/logo.svg'

const Navbar = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutUser = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className='shadow bg-white'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
        <Link to="/">
          <img src={logo} alt="Logo" className="h-11 w-auto" />
        </Link>

        <div className='flex items-center gap-4 text-sm'>
          <p className='hidden sm:block'>Hi, {user?.name}</p>
          {/* FIX: was bg-green-600 which looks like a primary CTA; changed to neutral styling */}
          <button
            onClick={logoutUser}
            className='bg-white hover:bg-slate-100 border border-gray-300 text-slate-700 px-7 py-1.5 rounded-full active:scale-95 transition-all'
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar