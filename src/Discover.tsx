import { Heart, MapPin, PawPrint, X } from 'lucide-react'
import { useEffect, useEffectEvent, useRef, useState, type PointerEvent } from 'react'
import { PetPhoto } from '@/components/PetPhoto'
import { Button } from '@/components/ui/button'
import { petAge, PetApiError, recordDecision, usePetData, type Direction, type Pet } from '@/lib/pets'

type Drag = { pointerId: number; x: number; y: number }
type Save = { status: 'saving' | 'error'; direction: Direction } | { status: 'conflict' }

function SwipeDeck({ pets, refresh }: { pets: Pet[]; refresh: () => void }) {
  const [index, setIndex] = useState(0)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [save, setSave] = useState<Save | null>(null)
  const drag = useRef<Drag | null>(null)
  const submittedPetId = useRef<string | null>(null)
  const pet = pets[index]

  async function decide(direction: Direction) {
    if (!pet || submittedPetId.current === pet.id || drag.current || save?.status === 'conflict') return
    submittedPetId.current = pet.id
    setSave({ status: 'saving', direction })
    try {
      await recordDecision(pet.id, direction)
      setIndex(current => current + 1)
      setSave(null)
    } catch (error) {
      submittedPetId.current = null
      setSave(error instanceof PetApiError && error.status === 409
        ? { status: 'conflict' }
        : { status: 'error', direction })
    }
  }

  const handleKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
        (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return

    const target = event.target
    if (target instanceof HTMLElement &&
        (target.isContentEditable || target.closest('input, textarea, select, button, a, [role="button"], [role="textbox"]'))) return

    if (pet) {
      event.preventDefault()
      void decide(event.key === 'ArrowLeft' ? 'left' : 'right')
    }
  })

  useEffect(() => {
    const listener = (event: KeyboardEvent) => handleKey(event)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  function startDrag(event: PointerEvent<HTMLElement>) {
    if (!event.isPrimary || event.button !== 0 || submittedPetId.current === pet?.id || save?.status === 'conflict') return
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  function moveDrag(event: PointerEvent<HTMLElement>) {
    if (drag.current?.pointerId === event.pointerId) {
      setOffset(event.clientX - drag.current.x)
    }
  }

  function resetDrag() {
    drag.current = null
    setOffset(0)
    setDragging(false)
  }

  function finishDrag(event: PointerEvent<HTMLElement>) {
    const start = drag.current
    if (start?.pointerId !== event.pointerId) return

    const x = event.clientX - start.x
    const y = event.clientY - start.y
    const threshold = Math.min(100, event.currentTarget.offsetWidth * 0.24)
    resetDrag()
    if (Math.abs(x) >= threshold && Math.abs(x) > Math.abs(y)) {
      void decide(x < 0 ? 'left' : 'right')
    }
  }

  function cancelDrag(event: PointerEvent<HTMLElement>) {
    if (drag.current?.pointerId === event.pointerId) resetDrag()
  }

  if (!pet) {
    return (
      <section className="deck-empty" aria-label="End of deck">
        <PawPrint size={38} aria-hidden="true" />
        <p role="status">You’ve met every pet in the deck.</p>
        <Button asChild><a href="/matches">View matches</a></Button>
      </section>
    )
  }

  const busy = save?.status === 'saving'
  const blocked = busy || save?.status === 'conflict'
  const cue = save?.status === 'saving' ? save.direction : Math.abs(offset) > 24 ? (offset < 0 ? 'left' : 'right') : null

  return (
    <>
      <div className="deck-stack" data-stacked={index < pets.length - 1}>
        <article key={pet.id} className="swipe-card" data-dragging={dragging} aria-labelledby="pet-name"
          style={{ transform: `translateX(${offset}px) rotate(${Math.max(-13, Math.min(13, offset / 13))}deg)` }}
          onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={finishDrag}
          onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag}>
          <PetPhoto key={pet.id} pet={pet} eager />
          {cue && <span className={`swipe-cue cue-${cue}`} aria-hidden="true">{cue === 'left' ? 'Pass' : 'Adopt'}</span>}
          <div className="pet-details">
            <span className="pet-species">{pet.species}</span>
            <h2 id="pet-name">{pet.name} <span>{petAge(pet.ageMonths)}</span></h2>
            <p className="pet-location"><MapPin size={15} aria-hidden="true" />{pet.location}</p>
            <p>{pet.bio}</p>
          </div>
        </article>
      </div>
      <span className="sr-only" role="status">{busy ? 'Saving decision…' : `${pet.name}, ${pet.species}, ${petAge(pet.ageMonths)}`}</span>
      <div className="swipe-actions" aria-label="Swipe actions">
        <Button type="button" variant="outline" className="swipe-action pass-action" aria-disabled={blocked}
          onClick={() => void decide('left')}>
          <X size={22} aria-hidden="true" /> Pass
        </Button>
        <Button type="button" className="swipe-action" aria-disabled={blocked} onClick={() => void decide('right')}>
          <Heart size={20} aria-hidden="true" /> Adopt
        </Button>
      </div>
      {save?.status === 'error' && (
        <div className="decision-error">
          <p role="alert">Couldn’t save your decision.</p>
          <Button type="button" variant="outline" onClick={() => void decide(save.direction)}>Retry</Button>
        </div>
      )}
      {save?.status === 'conflict' && (
        <div className="decision-error">
          <p role="alert">A decision for this pet was already saved.</p>
          <Button type="button" variant="outline" onClick={refresh}>Refresh deck</Button>
        </div>
      )}
      <p className="keyboard-hint">Use <kbd>←</kbd> to pass or <kbd>→</kbd> to adopt</p>
    </>
  )
}

export function Discover() {
  const { result, retry } = usePetData<{ pets: Pet[] }>('/api/pets')
  return (
    <main className="discover">
      <h1>Discover</h1>
      {result.status === 'loading' && <p className="app-message" role="status">Finding pets…</p>}
      {result.status === 'error' && (
        <div className="app-message">
          <p role="alert">Couldn’t load the deck.</p>
          <Button type="button" onClick={retry}>Try again</Button>
        </div>
      )}
      {result.status === 'ready' && <SwipeDeck pets={result.data.pets} refresh={retry} />}
    </main>
  )
}
