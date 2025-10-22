// Layout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Login from '../pages/Login'
import {useSelector} from 'react-redux'
import Loaders from '../components/Loaders'

const Layout = () => {
  const {user, loading} = useSelector(state=>state.auth)
  if(loading){
    return <Loaders/>
  }
  return (
    <div>
      {
        user? (<div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
    </div>) : <Login/>
      }
    </div>
  )
}

export default Layout
