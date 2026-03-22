import axios from "axios"

/**
 * Axios API client
 *
 * Centralized axios instance for all API requests.
 * Base URL is read from environment variables — configure in .env files.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json"
  }
})