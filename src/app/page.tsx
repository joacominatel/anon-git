"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GitBranchIcon, ArrowDownIcon } from "lucide-react"
import { HorizontalScrollSection } from "@/components/Home/HorizontalScrollSection"
import { StatsSection } from "@/components/Home/StatsSections"
import { TestimonialSection } from "@/components/Home/TestimonialSection"
import { CtaSection } from "@/components/Home/CTASection"
import { Footer } from "@/components/Footer/Footer"
import { motion } from "framer-motion"

export default function Page() {
  // Función para activar las animaciones al hacer scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    const fadeElements = document.querySelectorAll(".fade-in-up")
    fadeElements.forEach((el) => observer.observe(el))

    return () => {
      fadeElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-6"
            >
              <GitBranchIcon className="h-16 w-16 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              Code Anonymously, <br />
              Collaborate Securely
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8"
            >
              anon-git is a decentralized platform that enables anonymous code collaboration while preserving your
              privacy through blockchain technology.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg">Get Started</Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block"
            >
              <Button
                variant="ghost"
                size="icon"
                className="animate-bounce"
                onClick={() => {
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: "smooth",
                  })
                }}
              >
                <ArrowDownIcon className="h-6 w-6" />
                <span className="sr-only">Scroll down</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with Horizontal Scroll */}
      <HorizontalScrollSection />

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              anon-git combines the power of Git with blockchain technology to provide a secure, private, and
              decentralized code collaboration platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="fade-in-up bg-card p-6 rounded-xl border flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground">
                Link your Web3 wallet to create an anonymous identity that preserves your privacy.
              </p>
            </div>

            <div
              className="fade-in-up bg-card p-6 rounded-xl border flex flex-col items-center text-center"
              style={{ transitionDelay: "0.2s" }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create or Clone Repos</h3>
              <p className="text-muted-foreground">
                Start a new project or contribute to existing ones using familiar Git commands.
              </p>
            </div>

            <div
              className="fade-in-up bg-card p-6 rounded-xl border flex flex-col items-center text-center"
              style={{ transitionDelay: "0.4s" }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborate Securely</h3>
              <p className="text-muted-foreground">
                Work with others while maintaining privacy and security through end-to-end encryption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </>
  )
}