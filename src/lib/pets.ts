import { useEffect, useState } from 'react'

export type Pet = {
  id: string
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'reptile'
  name: string
  ageMonths: number
  location: string
  bio: string
  imageUrl: string
}

export type Direction = 'left' | 'right'

export function petAge(months: number) {
  const years = Math.floor(months / 12)
  const remainder = months % 12
  if (!years) return `${months} mo`
  if (!remainder) return `${years} yr`
  return `${years} yr ${remainder} mo`
}

export class PetApiError extends Error {
  constructor(readonly status: number) {
    super(`Pet request failed with status ${status}.`)
  }
}

async function petRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init)
  if (response.status === 401) window.location.replace('/sign-in')
  if (!response.ok) throw new PetApiError(response.status)
  return response.json() as Promise<T>
}

export function recordDecision(petId: string, direction: Direction) {
  return petRequest('/api/decisions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ petId, direction }),
    signal: AbortSignal.timeout(15_000),
  })
}

type PetData<T> = { status: 'loading' } | { status: 'error' } | { status: 'ready'; data: T }

export function usePetData<T>(path: string) {
  const [result, setResult] = useState<PetData<T>>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)])
    petRequest<T>(path, { signal }).then(
      data => {
        if (!controller.signal.aborted) setResult({ status: 'ready', data })
      },
      () => {
        if (!controller.signal.aborted) setResult({ status: 'error' })
      },
    )
    return () => controller.abort()
  }, [path, attempt])

  function retry() {
    setResult({ status: 'loading' })
    setAttempt(value => value + 1)
  }

  return { result, retry }
}
