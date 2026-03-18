import axios from 'axios'

// In monorepo deployment, frontend and backend share the same Vercel domain
// so API calls use a relative path (no baseURL needed in production)
// In local dev, we still need to point to localhost:3000
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
})

export default api