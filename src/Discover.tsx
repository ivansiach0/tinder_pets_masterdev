import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth'

export function Discover() {
  const { data: session, isPending, error } = authClient.useSession()
  const [signingOut, setSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState(false)

  useEffect(() => {
    if (!isPending && !session && !error) window.location.replace('/sign-in')
  }, [isPending, session, error])

  async function signOut() {
    setSigningOut(true)
    setSignOutError(false)
    try {
      const result = await authClient.signOut()
      if (result.error) {
        setSignOutError(true)
        return
      }
      window.location.replace('/')
    } catch {
      setSignOutError(true)
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <main className="sign-in">
      <h1>Discover</h1>
      {error ? (
        <>
          <p role="alert">Could not check your session.</p>
          <Button type="button" onClick={() => window.location.reload()}>Try again</Button>
        </>
      ) : session ? (
        <>
          <p>Welcome, {session.user.name}. Pet profiles will appear here when Discover is ready.</p>
          <Button type="button" variant="outline" disabled={signingOut} onClick={signOut}>
            {signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
          {signOutError && <p role="alert">Could not sign out. Try again.</p>}
        </>
      ) : (
        <p role="status">{isPending ? 'Checking your session…' : 'Opening sign-in…'}</p>
      )}
    </main>
  )
}
