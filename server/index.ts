import { toNodeHandler } from 'better-auth/node'
import express, { type ErrorRequestHandler } from 'express'
import { auth } from './auth.ts'
import { petRoutes } from './pet-routes.ts'

const app = express()
app.disable('x-powered-by')

app.get('/api/status', (_request, response) => {
  response.json({ status: 'ok' })
})

app.all('/api/auth/{*splat}', toNodeHandler(auth))
app.use(express.json({ limit: '16kb' }))
app.use('/api', petRoutes)

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

app.listen(3001, '127.0.0.1').on('listening', () => {
  console.log('API listening at http://127.0.0.1:3001')
})
