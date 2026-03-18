import { configureStore } from '@reduxjs/toolkit'
// FIX: updated import path from authSlics -> authSlice
import authReducer from './features/authSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer
    }
})