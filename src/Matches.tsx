import { Heart, MapPin } from 'lucide-react'
import { PetPhoto } from '@/components/PetPhoto'
import { Button } from '@/components/ui/button'
import { petAge, usePetData, type Pet } from '@/lib/pets'

export function Matches() {
  const { result, retry } = usePetData<{ matches: { pet: Pet }[] }>('/api/matches')
  const matches = result.status === 'ready' ? result.data.matches : []

  return (
    <main className="matches">
      <h1>Matches</h1>
      {result.status === 'loading' && <p className="app-message" role="status">Loading matches…</p>}
      {result.status === 'error' && (
        <div className="app-message">
          <p role="alert">Couldn’t load your matches.</p>
          <Button type="button" onClick={retry}>Try again</Button>
        </div>
      )}
      {result.status === 'ready' && (
        matches.length ? (
          <ul className="match-list">
            {matches.map(({ pet }) => (
              <li key={pet.id} className="match-card">
                <PetPhoto pet={pet} />
                <div className="pet-details">
                  <span className="pet-species">{pet.species}</span>
                  <h2>{pet.name} <span>{petAge(pet.ageMonths)}</span></h2>
                  <p className="pet-location"><MapPin size={15} aria-hidden="true" />{pet.location}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <section className="deck-empty" aria-label="No matches">
            <Heart size={38} aria-hidden="true" />
            <p role="status">Swipe right to save a pet here.</p>
            <Button asChild><a href="/discover">Discover pets</a></Button>
          </section>
        )
      )}
    </main>
  )
}
