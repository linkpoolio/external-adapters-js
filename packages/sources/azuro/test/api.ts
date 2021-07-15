import axios from 'axios'
import https from 'https'

export const api = axios.create({
  baseURL: 'https://artyrian.site',
  headers: { Authorization: `OAuth ${process.env.API_KEY}` },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
})
