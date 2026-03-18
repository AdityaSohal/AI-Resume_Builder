import React, { useEffect, useCallback } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
// FIX: removed unused Login import (Login is rendered inside Layout when user is not authenticated)
import { useDispatch } from 'react-redux'
import api from './configs/api'
// FIX: corrected import path from authSlics -> authSlice
import { login, setLoading } from './app/features/authSlice'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const dispatch = useDispatch()

  const getUserData = useCallback(async () => {
    const token = localStorage.getItem('token')
    try {
      if (token) {
        const { data } = await api.get('/api/users/data', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (data.user) {
          dispatch(login({ token, user: data.user }))
        }
        dispatch(setLoading(false))
      } else {
        dispatch(setLoading(false))
      }
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error.message)
    }
  }, [dispatch])

  useEffect(() => {
    getUserData()
  }, [getUserData])

  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeID' element={<ResumeBuilder />} />
        </Route>

        <Route path='/view/:resumeID' element={<Preview />} />
      </Routes>
    </>
  )
}

export default App