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
      // Increased frequency by reducing interval from 100ms to 50ms
      interval = setInterval(() => {
        // Generate multiple particles per interval
        const newParticles = Array.from({ length: 3 }).map(() => ({
          id: Date.now() + Math.random(),
          // Increased spread range for more dynamic movement
          x: (Math.random() - 0.5) * 600,
          y: (Math.random() - 0.5) * 400,
          size: Math.random() * 6 + 2, // Slightly larger particles
          color: Math.random() > 0.5 ? '#1E3D59' : '#17A2B8',
          duration: Math.random() * 2 + 1
        }));

        setParticles(prev => [...prev, ...newParticles])

        // Remove old particles
        setTimeout(() => {
          setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
        }, newParticles[0].duration * 1000)
      }, 50)
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
              y: particle.y,
              rotate: Math.random() * 360 // Added rotation for more dynamic movement
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