import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.ts'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('Set DATABASE_URL before starting Pawprint.')

function isExternalRenderUrl(value: string) {
  try {
    return new URL(value).hostname.endsWith('.render.com')
  } catch {
    throw new Error('DATABASE_URL must be a valid Postgres connection URL.')
  }
}

export const pool = new Pool({
  connectionString,
  ssl: isExternalRenderUrl(connectionString) ? { rejectUnauthorized: true } : undefined,
  connectionTimeoutMillis: 10_000,
})
export const db = drizzle(pool, { schema })
