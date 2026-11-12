import { db, pool } from './client.ts'
import { mockPets } from './catalog.ts'
import { pets } from './schema.ts'

try {
  const inserted = await db.insert(pets).values(mockPets)
    .onConflictDoNothing({ target: pets.id })
    .returning({ id: pets.id })
  console.log(`Inserted ${inserted.length} of ${mockPets.length} mock pets.`)
} finally {
  await pool.end()
}
