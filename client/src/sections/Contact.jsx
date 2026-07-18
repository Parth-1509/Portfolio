import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import gsap from 'gsap'
import { FiSend, FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi'
import { socials } from '../data/about'

const iconFor = (label) => {
  switch (label) {
    case 'GitHub': return <FiGithub />
    case 'LinkedIn': return <FiLinkedin />
    case 'Twitter': return <FiTwitter />
    case 'Email': return <FiMail />
    default: return null
  }
}

// --- inline magnetic hook, no separate component/file needed ---
function useMagnetic(strength = 0.35) {
  const ref = useRef(null)
  const quickX = useRef(null)
  const quickY = useRef(null)

  const ensureQuick = () => {
    if (!quickX.current && ref.current) {
      quickX.current = gsap.quickTo(ref.current, 'x', { duration: 0.5, ease: 'power3.out' })
      quickY.current = gsap.quickTo(ref.current, 'y', { duration: 0.5, ease: 'power3.out' })
    }
  }

  const onMouseMove = (e) => {
    if (!ref.current) return
    ensureQuick()
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    quickX.current(relX * strength)
    quickY.current(relY * strength)
  }

  const onMouseLeave = () => {
    ensureQuick()
    quickX.current?.(0)
    quickY.current?.(0)
  }

  return { ref, onMouseMove, onMouseLeave }
}
// --- end inline magnetic hook ---

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const magnetic = useMagnetic(0.35)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await axios.post('http://localhost:5000/api/contact', form)
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative min-h-screen w-full bg-ink  px-6 md:px-16 py-28 md:py-16 flex flex-col justify-center">

      <div className="max-w-3xl">
        <p className="eyebrow mb-4">Get in touch</p>
        <h2 className="font-display text-5xl md:text-7xl text-bone mb-8">
          Let's build something worth shipping.
        </h2>
        <p className="text-bone-dim text-base md:text-lg max-w-xl mb-14">
          Open to full-time roles and select freelance projects. Tell me a
          little about what you're working on.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 ">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-bone-dim">Name</label>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                className="bg-transparent border-b border-line focus:border-bronze outline-none py-3 text-bone placeholder:text-bone-dim/50 transition-colors"
                placeholder="Your Name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-bone-dim">Email</label>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="bg-transparent border-b border-line focus:border-bronze outline-none py-3 text-bone placeholder:text-bone-dim/50 transition-colors"
                placeholder="abc@xyz.com"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-bone-dim">Message</label>
            <textarea
              required
              rows={4}
              name="message"
              value={form.message}
              onChange={handleChange}
              className="bg-transparent border-b border-line focus:border-bronze outline-none py-3 text-bone placeholder:text-bone-dim/50 transition-colors resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          <div className="flex items-center gap-6">
            <button
              ref={magnetic.ref}
              onMouseMove={magnetic.onMouseMove}
              onMouseLeave={magnetic.onMouseLeave}
              type="submit"
              disabled={status === 'sending'}
              data-cursor="grow"
              className="magnetic hover:text-white inline-flex items-center gap-3 w-fit rounded-full font-mono text-xs uppercase tracking-widest px-8 py-4 text-ink disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,118,0.85) 0%, rgba(201,168,118,0.55) 50%, rgba(201,168,118,0.7) 100%)',
                backdropFilter: 'blur(14px) saturate(160%)',
                WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.15), 0 4px 16px rgba(201,168,118,0.4)',
                textShadow: '0 1px 2px rgba(0,0,0,0.25)',
              }}
            >
              {status === 'sending' ? 'Sending…' : 'Send Message'} <FiSend />
            </button>
            {status === 'sent' && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-bronze text-sm font-mono">
                Message sent — thank you.
              </motion.span>
            )}
            {status === 'error' && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm font-mono">
                Something went wrong. Try again.
              </motion.span>
            )}
          </div>
        </form>

       
      </div>
    </section>
  )
}