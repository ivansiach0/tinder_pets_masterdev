import { fromNodeHeaders } from 'better-auth/node'
import { and, asc, desc, eq, notExists } from 'drizzle-orm'
import { Router, type RequestHandler } from 'express'
import { auth, authOrigin } from './auth.ts'
import { db } from './db/client.ts'
import { decisions, pets } from './db/schema.ts'

export const petRoutes = Router()

const requireSession: RequestHandler = async (request, response, next) => {
  response.set('Cache-Control', 'private, no-store')
  const session = await auth.api.getSession({ headers: fromNodeHeaders(request.headers) })
  if (!session) {
    response.status(401).json({ error: 'Log in to continue.' })
    return
  }

  response.locals.userId = session.user.id
  next()
}

petRoutes.get('/pets', requireSession, async (_request, response) => {
  const userId: string = response.locals.userId
  const decided = db.select({ petId: decisions.petId }).from(decisions)
    .where(and(eq(decisions.userId, userId), eq(decisions.petId, pets.id)))

  const availablePets = await db.select().from(pets)
    .where(notExists(decided))
    .orderBy(asc(pets.id))

  response.json({ pets: availablePets })
})

petRoutes.post('/decisions', requireSession, async (request, response) => {
  const origin = request.get('origin')
  if (origin && origin !== authOrigin) {
    response.status(403).json({ error: 'Request origin is not allowed.' })
    return
  }

  const { petId, direction } = request.body ?? {}
  if (!request.is('application/json') || typeof petId !== 'string' ||
      !petId.trim() || petId.length > 128 || (direction !== 'left' && direction !== 'right')) {
    response.status(400).json({ error: 'Provide a pet ID and a left or right decision.' })
    return
  }

  const userId: string = response.locals.userId
  const [pet] = await db.select({ id: pets.id }).from(pets).where(eq(pets.id, petId))
  if (!pet) {
    response.status(404).json({ error: 'Pet not found.' })
    return
  }

  const [inserted] = await db.insert(decisions).values({ userId, petId, direction })
    .onConflictDoNothing({ target: [decisions.userId, decisions.petId] })
    .returning({ petId: decisions.petId, direction: decisions.direction })

  if (inserted) {
    response.status(201).json({ decision: inserted })
    return
  }

  const [existing] = await db.select({ petId: decisions.petId, direction: decisions.direction })
    .from(decisions).where(and(eq(decisions.userId, userId), eq(decisions.petId, petId)))

  if (!existing || existing.direction !== direction) {
    response.status(409).json({ error: 'You already made a decision for this pet.' })
    return
  }

  response.json({ decision: existing })
})

petRoutes.get('/matches', requireSession, async (_request, response) => {
  const userId: string = response.locals.userId
  const matches = await db.select({ pet: pets, matchedAt: decisions.createdAt })
    .from(decisions)
    .innerJoin(pets, eq(decisions.petId, pets.id))
    .where(and(eq(decisions.userId, userId), eq(decisions.direction, 'right')))
    .orderBy(desc(decisions.createdAt), asc(pets.id))

  response.json({ matches })
})
