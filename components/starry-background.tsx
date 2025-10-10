"use client"

import { useEffect, useState } from "react"

interface ShootingStar {
  id: number
  top: string
  left: string
  delay: number
  duration: number
}

export function StarryBackground() {
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])

  useEffect(() => {
    // Generate random shooting stars
    const generateShootingStars = () => {
      const stars: ShootingStar[] = []
      for (let i = 0; i < 3; i++) {
        stars.push({
          id: i,
          top: `${Math.random() * 80 + 10}%`,
          left: `${Math.random() * 30}%`,
          delay: Math.random() * 6,
          duration: Math.random() * 2 + 3,
        })
      }
      setShootingStars(stars)
    }

    generateShootingStars()

    // Regenerate shooting stars periodically
    const interval = setInterval(generateShootingStars, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="starry-background fixed inset-0 -z-10">
      {/* Nebula effect layer */}
      <div className="nebula-effect" />

      {/* Dynamic shooting stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: star.top,
            left: star.left,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
