// frontend/src/api/client.ts
import axios from 'axios'

const { VITE_API_URL, VITE_API_TOKEN, VITE_API_TIMEOUT } = import.meta.env

if (!VITE_API_URL || !VITE_API_TOKEN || !VITE_API_TIMEOUT) {
  throw new Error('make sure ENV has been set')
}

const client = axios.create({
  baseURL: VITE_API_URL,
  timeout: Number(VITE_API_TIMEOUT),
  headers: {
    Authorization: `Bearer ${VITE_API_TOKEN}`,
  },
})

export default client
