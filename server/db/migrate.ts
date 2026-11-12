import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db, pool } from './client.ts'

try {
  await migrate(db, { migrationsFolder: 'drizzle', migrationsSchema: 'pawprint_migrations' })
  console.log('Database migrations applied.')
} finally {
  await pool.end()
}
