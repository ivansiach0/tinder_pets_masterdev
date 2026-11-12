import { ArrowUpRight, PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthPage } from './AuthPage'
import { Discover } from './Discover'
import { Matches } from './Matches'
import { SignedIn } from './SignedIn'

function Landing() {
  return (
    <main className="landing">
      <div className="landing-content">
        <header className="brand">
          <span className="brand-icon"><PawPrint size={21} aria-hidden="true" /></span>
          Pawprint
        </header>
        <div className="landing-copy">
          <h1>Find your<br />kind of <em>pet.</em></h1>
          <p>Meet adoptable pets, swipe through their profiles, and save the ones you’d love to meet.</p>
          <Button asChild size="lg">
            <a href="/sign-in">Log in <ArrowUpRight size={19} aria-hidden="true" /></a>
          </Button>
        </div>
      </div>
      <div className="hero-photo">
        <img
          src="/landing-dog.jpg"
          alt="A tan dog in a black collar outdoors"
          fetchPriority="high"
        />
      </div>
    </main>
  )
}

export function App() {
  switch (window.location.pathname) {
    case '/sign-in':
      return <AuthPage signUp={false} />
    case '/sign-up':
      return <AuthPage signUp />
    case '/discover':
      return <SignedIn page="discover"><Discover /></SignedIn>
    case '/matches':
      return <SignedIn page="matches"><Matches /></SignedIn>
    default:
      return <Landing />
  }
}
