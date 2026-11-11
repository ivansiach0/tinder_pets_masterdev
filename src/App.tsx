import { ArrowLeft, ArrowUpRight, PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

function SignIn() {
  return (
    <main className="sign-in">
      <Button asChild variant="outline">
        <a href="/"><ArrowLeft size={17} aria-hidden="true" /> Back to Pawprint</a>
      </Button>
      <h1>Log in</h1>
      <p>Account sign-in will be available once authentication is connected.</p>
    </main>
  )
}

export function App() {
  return window.location.pathname === '/sign-in' ? <SignIn /> : <Landing />
}
