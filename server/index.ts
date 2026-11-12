import { fileURLToPath } from 'node:url'
import { toNodeHandler } from 'better-auth/node'
import express, { type ErrorRequestHandler } from 'express'
import { auth } from './auth.ts'
import { pool } from './db/client.ts'
import { petRoutes } from './pet-routes.ts'

const production = process.env.NODE_ENV === 'production'
const host = production ? '0.0.0.0' : '127.0.0.1'
const port = production ? Number(process.env.PORT ?? 10_000) : 3001
if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error('PORT must be an integer between 1 and 65535.')
}

const app = express()
app.disable('x-powered-by')

app.get('/api/status', (_request, response) => {
  response.json({ status: 'ok' })
})

app.get('/health', async (_request, response) => {
  response.set('Cache-Control', 'no-store')
  const ping = { text: 'select 1', query_timeout: 1_500 }
  try {
    await pool.query(ping)
    response.json({ status: 'ok' })
  } catch {
    response.status(503).json({ status: 'unavailable' })
  }
})

app.all('/api/auth/{*splat}', toNodeHandler(auth))
app.use(express.json({ limit: '16kb' }))
app.use('/api', petRoutes)
app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API route not found.' })
})

if (production) {
  const webRoot = fileURLToPath(new URL('../web/', import.meta.url))
  app.use(express.static(webRoot))
  app.get(['/sign-in', '/sign-up', '/discover', '/matches'], (_request, response, next) => {
    response.sendFile('index.html', { root: webRoot }, error => {
      if (error) next(error)
    })
  })
}

const handleError: ErrorRequestHandler = (error, _request, response, next) => {
  if (response.headersSent) {
    next(error)
    return
  }

  if (error.status === 400 || error.status === 413) {
    response.status(error.status).json({ error: 'Invalid request body.' })
    return
  }

  console.error('Pawprint API request failed.')
  response.status(500).json({ error: 'Something went wrong. Try again.' })
}

app.use(handleError)

app.listen(port, host).on('listening', () => {
  console.log(`Pawprint listening at http://${host}:${port}`)
})
