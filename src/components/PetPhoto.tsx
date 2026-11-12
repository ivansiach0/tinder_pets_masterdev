import { PawPrint } from 'lucide-react'
import { useState } from 'react'
import type { Pet } from '@/lib/pets'

export function PetPhoto({ pet, eager = false }: { pet: Pet; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  const description = `${pet.name}, a ${pet.species}`

  if (failed) {
    return (
      <div className="pet-photo pet-photo-fallback" role="img" aria-label={`Photo unavailable for ${description}`}>
        <PawPrint size={48} aria-hidden="true" />
      </div>
    )
  }

  return (
    <img className="pet-photo" src={pet.imageUrl} alt={description}
      loading={eager ? 'eager' : 'lazy'} draggable={false} onError={() => setFailed(true)} />
  )
}
