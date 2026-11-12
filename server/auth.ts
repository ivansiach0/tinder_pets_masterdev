import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db/client.ts'

const baseURL = process.env.BETTER_AUTH_URL
const secret = process.env.BETTER_AUTH_SECRET
if (!baseURL || !secret || secret.length < 32 || secret === 'replace-with-a-generated-secret') {
  throw new Error('Set BETTER_AUTH_URL and a generated BETTER_AUTH_SECRET of at least 32 characters.')
}

export const authOrigin = new URL(baseURL).origin

export const auth = betterAuth({
  appName: 'Pawprint',
  baseURL,
  secret,
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: { enabled: true },
})
