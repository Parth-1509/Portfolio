import { useEffect, useState } from 'react'
import useLenis from './hooks/useLenis'
import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import StarField from './components/StarField'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import About from './sections/About'
import Contact from './sections/Contact'

export default function App() {
  useLenis()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Parth Patel — Full Stack Web Developer'
    document.body.style.overflow = loading ? 'hidden' : ''
    if (window.__lenis) {
      if (loading) window.__lenis.stop()
      else window.__lenis.start()
    }
  }, [loading])

  return (
    <div className="bg-ink min-h-screen w-full">
      <StarField />
      <Preloader onComplete={() => setLoading(false)} />
      <CustomCursor />
      <Navbar />
      <main className="relative">
        <Hero />
        <Projects />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}