// frontend/src/api/client.ts
import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN ?? 'dev-token'}`,
  },
})

export default client
