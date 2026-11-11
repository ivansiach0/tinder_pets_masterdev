import express from 'express'

const app = express()
app.disable('x-powered-by')

app.get('/api/status', (_request, response) => {
  response.json({ status: 'ok' })
})

app.listen(3001, '127.0.0.1').on('listening', () => {
  console.log('API listening at http://127.0.0.1:3001')
})
