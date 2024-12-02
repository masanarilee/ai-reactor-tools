'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface AIGenerationVisualizerProps {
  isGenerating: boolean
}

const AIGenerationVisualizer: React.FC<AIGenerationVisualizerProps> = ({ isGenerating }) => {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; color: string }>>([])
  const spinnerControls = useAnimation()
  const textControls = useAnimation()
  const centerElementControls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setParticles(prevParticles => {
          const newParticle = generateParticle()
          return [...prevParticles, newParticle].slice(-50)
        })
      }, 100)

      spinnerControls.start({
        rotate: 360,
        transition: { duration: 2, repeat: Infinity, ease: "linear" }
      })

      textControls.start({
        backgroundPosition: ["0% 50%", "100% 50%"],
        transition: { duration: 3, repeat: Infinity, ease: "linear" }
      })

      centerElementControls.start({
        scale: [1, 1.1, 1],
        opacity: [0.9, 1, 0.9],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      })

      return () => clearInterval(interval)
    } else {
      setParticles([])
    }
  }, [isGenerating, spinnerControls, textControls, centerElementControls])

  const generateParticle = () => {
    const containerElement = containerRef.current
    const textElement = textRef.current
    if (!containerElement || !textElement) return { x: 0, y: 0, size: 0, color: '' }

    const containerRect = containerElement.getBoundingClientRect()
    const textRect = textElement.getBoundingClientRect()

    const safeZoneWidth = textRect.width + 40
    const safeZoneHeight = textRect.height + 40

    let x
    let y
    do {
      x = (Math.random() - 0.5) * containerRect.width
      y = (Math.random() - 0.5) * containerRect.height
    } while (
      Math.abs(x) < safeZoneWidth / 2 &&
      Math.abs(y) < safeZoneHeight / 2
    )

    return {
      x,
      y,
      size: Math.random() * 6 + 1,
      color: Math.random() > 0.5 ? '#1E3D59' : '#17A2B8'
    }
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50 overflow-hidden">
      <div ref={containerRef} className="relative w-[20rem] h-[20rem]">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E3D59" />
              <stop offset="100%" stopColor="#17A2B8" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#spinner-gradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            animate={spinnerControls}
          />
          <motion.g animate={centerElementControls}>
            {[0, 1, 2].map((index) => (
              <motion.circle
                key={index}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#17A2B8"
                strokeWidth="1"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.2, 1.2],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.8,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.g>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <motion.div
              ref={textRef}
              className="text-2xl font-bold whitespace-nowrap"
              style={{
                background: "linear-gradient(90deg, #1E3D59, #17A2B8, #1E3D59)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
              animate={textControls}
            >
              生成中...
            </motion.div>
            {particles.map((particle, index) => (
              <motion.div
                key={index}
                className="absolute rounded-full"
                style={{
                  left: `calc(50% + ${particle.x}px)`,
                  top: `calc(50% + ${particle.y}px)`,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0.5], scale: [0, 1, 0.8] }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIGenerationVisualizer