import React from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import logo from '../assets/logo.svg'

const Navbar = () => {
    const user = { name: 'John Doe' }
    const navigate = useNavigate()

    const logoutUser = () => {
        navigate('/')
    }

    return (
        <div className='shadow bg-white'>
            <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
                {/* Logo */}
                <Link to="/">
                    <img src={logo} alt="Logo" className="h-11 w-auto" />
                </Link>

                {/* User Info + Logout */}
                <div className='flex items-center gap-4 text-sm'>
                    <p className='hidden sm:block'>Hi, {user?.name}</p>
                    <button
                        onClick={logoutUser}
                        className='bg-green-600 hover:bg-slate-100 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
