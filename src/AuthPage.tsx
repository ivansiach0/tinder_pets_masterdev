import { useState, type FormEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth'

export function AuthPage({ signUp }: { signUp: boolean }) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const action = signUp ? 'Create account' : 'Log in'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email'))
    const password = String(data.get('password'))
    setError('')
    setPending(true)

    try {
      const result = signUp
        ? await authClient.signUp.email({ name: String(data.get('name')).trim(), email, password })
        : await authClient.signIn.email({ email, password })

      if (result.error) {
        setError(result.error.message || 'Check your details and try again.')
        return
      }

      window.location.replace('/discover')
    } catch {
      setError('Could not reach Pawprint. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="sign-in">
      <Button asChild variant="outline">
        <a href="/"><ArrowLeft size={17} aria-hidden="true" /> Back to Pawprint</a>
      </Button>
      <h1>{action}</h1>
      <form className="auth-form" onSubmit={submit}>
        {signUp && (
          <label>Name
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
        )}
        <label>Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>Password
          <input name="password" type="password" autoComplete={signUp ? 'new-password' : 'current-password'}
            minLength={signUp ? 8 : undefined} maxLength={128} required />
        </label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <Button type="submit" size="lg" disabled={pending}>{pending ? 'Please wait…' : action}</Button>
      </form>
      <p>
        {signUp ? 'Already have an account? ' : 'New to Pawprint? '}
        <a className="font-bold text-primary underline" href={signUp ? '/sign-in' : '/sign-up'}>
          {signUp ? 'Log in' : 'Create an account'}
        </a>
      </p>
    </main>
  )
}
