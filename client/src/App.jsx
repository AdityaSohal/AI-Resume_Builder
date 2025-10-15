import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import { Layout } from 'lucide-react'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='app' element={<Layout/>}/>
        <Route path='/dashboard' index element={<Dashboard />} />
        <Route path='/builder/:resumeID' element={<ResumeBuilder />} />
        <Route/>
        <Route path='/view/:resumeID' element={<Preview />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
