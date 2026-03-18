import axios from 'axios'

// FIX: filename was Api.js (capital A) but all imports use 'api' (lowercase).
// This works on macOS/Windows but breaks on Linux due to case-sensitive filesystem.
// Rename this file from Api.js to api.js on disk.
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
})

export default api