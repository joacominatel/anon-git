"use client"

import { useRef, useEffect, useCallback } from "react"
import { ShieldIcon, LockIcon, CodeIcon, GitBranchIcon, GlobeIcon, ZapIcon, KeyIcon, ServerIcon } from "lucide-react"
import { FeatureCard } from "./FeatureCard"

export function HorizontalScrollSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Función para manejar el scroll horizontal con la rueda del mouse
  const handleWheel = useCallback((e: WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault()
      scrollRef.current.scrollLeft += e.deltaY
    }
  }, [])

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("wheel", handleWheel)
      }
    }
  }, [handleWheel])

  const features = [
    {
      icon: ShieldIcon,
      title: "Anonymous Identity",
      description: "Contribute to projects without revealing your personal identity while maintaining reputation.",
    },
    {
      icon: LockIcon,
      title: "End-to-End Encryption",
      description: "All your code and communications are encrypted to ensure maximum privacy and security.",
    },
    {
      icon: CodeIcon,
      title: "Decentralized Repositories",
      description: "Store your code across a distributed network for censorship resistance and high availability.",
    },
    {
      icon: GitBranchIcon,
      title: "Familiar Git Workflow",
      description: "Use the same Git commands you already know, with added privacy and security features.",
    },
    {
      icon: GlobeIcon,
      title: "Global Collaboration",
      description: "Work with developers around the world without intermediaries or central points of failure.",
    },
    {
      icon: ZapIcon,
      title: "Fast Performance",
      description: "Optimized for speed with distributed caching and efficient data transfer protocols.",
    },
    {
      icon: KeyIcon,
      title: "Cryptographic Verification",
      description: "Verify code integrity and authenticity with advanced cryptographic signatures.",
    },
    {
      icon: ServerIcon,
      title: "Self-Hosting Option",
      description: "Run your own anon-git node for complete control over your development environment.",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          <p className="text-muted-foreground">
            Discover how anon-git is revolutionizing code collaboration with privacy and security at its core.
          </p>
        </div>

        <div className="relative">
          <div ref={scrollRef} className="scroll-container">
            {features.map((feature, index) => (
              <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </div>

          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  )
}

