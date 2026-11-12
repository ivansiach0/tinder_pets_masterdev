import { Compass, Heart, LogOut, PawPrint } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth'

export function SignedIn({ page, children }: { page: 'discover' | 'matches'; children: ReactNode }) {
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

  if (!session) {
    return (
      <main className="app-message">
        {error ? (
          <>
            <p role="alert">Could not check your session.</p>
            <Button type="button" onClick={() => window.location.reload()}>Try again</Button>
          </>
        ) : <p role="status">{isPending ? 'Checking your session…' : 'Opening sign-in…'}</p>}
      </main>
    )
  }

  return (
    <>
      <header className="app-header">
        <span className="brand">
          <span className="brand-icon"><PawPrint size={21} aria-hidden="true" /></span>
          <span className="app-wordmark">Pawprint</span>
        </span>
        <nav aria-label="Main navigation">
          <a href="/discover" aria-current={page === 'discover' ? 'page' : undefined}>
            <Compass size={17} aria-hidden="true" /> Discover
          </a>
          <a href="/matches" aria-current={page === 'matches' ? 'page' : undefined}>
            <Heart size={17} aria-hidden="true" /> Matches
          </a>
        </nav>
        <Button type="button" variant="outline" className="sign-out" aria-label="Sign out"
          disabled={signingOut} onClick={signOut}>
          <LogOut size={17} aria-hidden="true" />
          <span>{signingOut ? 'Signing out…' : 'Sign out'}</span>
        </Button>
      </header>
      {signOutError && <p className="app-message" role="alert">Could not sign out. Try again.</p>}
      {children}
    </>
  )
}
