import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://artyrian.site',
  headers: { 'Authorization': 'OAuth dev-token' }
})