import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
}

const LogoParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isHovered) {
      interval = setInterval(() => {
        const newParticle: Particle = {
          id: Date.now(),
          x: (Math.random() - 0.5) * 400,
          y: (Math.random() - 0.5) * 200,
          size: Math.random() * 4 + 2,
          color: Math.random() > 0.5 ? '#1E3D59' : '#17A2B8',
          duration: Math.random() * 2 + 1
        }

        setParticles(prev => [...prev, newParticle])

        // Remove old particles
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== newParticle.id))
        }, newParticle.duration * 1000)
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isHovered])

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setParticles([])
      }}
    >
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: particle.x,
              y: particle.y
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: particle.duration,
              ease: "easeOut"
            }}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default LogoParticles