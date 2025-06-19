import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

const ParticleContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background: linear-gradient(135deg, #080417 0%, #0f0726 50%, #110830 100%);
`

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`

interface Particle {
  x: number
  y: number
  z: number
  radius: number
  color: string
  vx: number
  vy: number
  vz: number
  opacity: number
  isLarge: boolean
  glowSize: number
  glowOpacity: number
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Initialize particles
    const initParticles = () => {
      const particleCount = Math.min(
        140, // Increased particle count
        Math.floor((window.innerWidth * window.innerHeight) / 9000) // More particles in the same area
      )
      const particles: Particle[] = []

      // Create particles with varying sizes
      for (let i = 0; i < particleCount; i++) {
        const isLarge = Math.random() > 0.5 // 50% large particles (up from 40%)
        const glowSize = isLarge ? 2.2 + Math.random() * 2.2 : 1.65 + Math.random() * 1.1 // 10% larger glow sizes
        const glowOpacity = isLarge ? 0.3 + Math.random() * 0.4 : 0.2 + Math.random() * 0.3 // Keep opacity the same

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          radius: isLarge ? 2.75 + Math.random() * 4.4 : 1.1 + Math.random() * 2.2, // 10% larger particles
          color: getRandomColor(isLarge),
          vx: (Math.random() - 0.5) * 0.195, // 30% faster movement
          vy: (Math.random() - 0.5) * 0.195, // 30% faster movement
          vz: Math.random() * 0.195, // 30% faster movement
          opacity: isLarge ? 0.7 + Math.random() * 0.3 : 0.5 + Math.random() * 0.3, // Keep opacity the same
          isLarge,
          glowSize,
          glowOpacity
        })
      }

      particlesRef.current = particles
    }

    // Get random color based on particle size
    const getRandomColor = (isLarge: boolean) => {
      if (isLarge) {
        // Bright white with slight purple tint for large particles
        return Math.random() > 0.6
          ? 'rgb(255, 255, 255)' // Pure white (40%)
          : 'rgb(250, 245, 255)' // White with very slight purple tint (60%)
      } else {
        // Light purple tints for small particles
        const purpleIntensity = Math.random()
        if (purpleIntensity > 0.7) {
          // More purple (30%)
          return 'rgb(235, 225, 255)'
        } else if (purpleIntensity > 0.3) {
          // Medium purple tint (40%)
          return 'rgb(245, 240, 255)'
        } else {
          // Light purple tint (30%)
          return 'rgb(250, 248, 255)'
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach(particle => {
        // Update position - 30% faster movement
        particle.x += particle.vx * 1.3
        particle.y += particle.vy * 1.3
        particle.z -= particle.vz * 1.3

        // Reset particle if it goes out of view
        if (
          particle.x < 0 ||
          particle.x > canvas.width ||
          particle.y < 0 ||
          particle.y > canvas.height ||
          particle.z < 0
        ) {
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
          particle.z = 1000
          particle.vx = (Math.random() - 0.5) * 0.195 // 30% faster
          particle.vy = (Math.random() - 0.5) * 0.195 // 30% faster
        }

        // Scale size based on z-position (perspective effect)
        const scale = 1000 / (1000 + particle.z)
        const scaledRadius = particle.radius * scale

        // Draw glow for particles
        const glowRadius = scaledRadius * particle.glowSize
        const glow = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, glowRadius)

        // Determine glow color based on position - more purple towards the middle-right
        const distanceFromCenter = Math.sqrt(
          Math.pow(particle.x - canvas.width * 0.6, 2) + Math.pow(particle.y - canvas.height * 0.5, 2)
        )

        const maxDistance = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) * 0.5
        const purpleGlowIntensity = Math.max(0, 1 - distanceFromCenter / maxDistance)

        let glowColor
        if (purpleGlowIntensity > 0.5) {
          // More purple glow in the center-right - increased intensity
          glowColor = `rgba(138, 94, 244, ${particle.glowOpacity * 1.8 * purpleGlowIntensity})` // Increased purple glow
        } else {
          // Light purple glow elsewhere - changed from white to light purple
          glowColor = `rgba(190, 170, 255, ${particle.glowOpacity * 1.5})` // Light purple instead of white
        }

        glow.addColorStop(0, glowColor)
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, scaledRadius, 0, Math.PI * 2)

        // Use the particle's color with its opacity
        const color = particle.color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba')
        ctx.fillStyle = color
        ctx.fill()

        // Connect nearby particles, only between certain ones to avoid too many lines
        if (particle.isLarge || Math.random() > 0.6) {
          // More connections (changed from 0.7)
          particlesRef.current.forEach(p2 => {
            const dx = particle.x - p2.x
            const dy = particle.y - p2.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            // Longer connections for large particles
            const connectionDistance = particle.isLarge ? 200 : 150 // Slightly reduced connection distance

            if (distance < connectionDistance) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(p2.x, p2.y)

              // Determine line color based on position - more purple towards the middle-right
              let lineOpacity
              if (purpleGlowIntensity > 0.6) {
                // Purple connections in the center-right
                lineOpacity = 0.25 * (1 - distance / connectionDistance) * purpleGlowIntensity // Increased opacity
                ctx.strokeStyle = `rgba(138, 94, 244, ${lineOpacity})`
              } else {
                // Light purple connections elsewhere (instead of white)
                lineOpacity = 0.15 * (1 - distance / connectionDistance) // Increased opacity
                ctx.strokeStyle = `rgba(190, 170, 255, ${lineOpacity})`
              }

              ctx.lineWidth = particle.isLarge ? 0.8 : 0.5 // Thinner lines to match smaller particles
              ctx.stroke()
            }
          })
        }
      })

      requestAnimationFrame(animate)
    }

    // Initialize
    setCanvasSize()
    initParticles()
    animate()

    // Handle window resize
    window.addEventListener('resize', () => {
      setCanvasSize()
      initParticles()
    })

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return (
    <ParticleContainer>
      <Canvas ref={canvasRef} />
    </ParticleContainer>
  )
}

export default ParticleBackground
