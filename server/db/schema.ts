import { boolean, index, integer, pgSchema, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

export const pawprint = pgSchema('pawprint')

const createdAt = () => timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
const updatedAt = () => timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
const expiresAt = () => timestamp('expires_at', { withTimezone: true }).notNull()

export const user = pawprint.table('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

export const session = pawprint.table('session', {
  id: text('id').primaryKey(),
  expiresAt: expiresAt(),
  token: text('token').notNull().unique(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
}, table => [index('session_user_id_idx').on(table.userId)])

export const account = pawprint.table('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
  scope: text('scope'),
  password: text('password'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, table => [index('account_user_id_idx').on(table.userId)])

export const verification = pawprint.table('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: expiresAt(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, table => [index('verification_identifier_idx').on(table.identifier)])

export const species = pawprint.enum('pet_species', ['dog', 'cat', 'bird', 'rabbit', 'reptile'])

export const pets = pawprint.table('pets', {
  id: text('id').primaryKey(),
  species: species('species').notNull(),
  name: text('name').notNull(),
  ageMonths: integer('age_months').notNull(),
  location: text('location').notNull(),
  bio: text('bio').notNull(),
  imageUrl: text('image_url').notNull(),
})

export const direction = pawprint.enum('swipe_direction', ['left', 'right'])

export const decisions = pawprint.table('decisions', {
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  petId: text('pet_id').notNull().references(() => pets.id),
  direction: direction('direction').notNull(),
  createdAt: createdAt(),
}, table => [
  primaryKey({ columns: [table.userId, table.petId] }),
  index('decisions_matches_idx').on(table.userId, table.direction, table.createdAt),
])
