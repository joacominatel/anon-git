"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeftIcon, ChevronRightIcon, QuoteIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

interface Testimonial {
  id: number
  content: string
  author: string
  role: string
  avatar: string
}

export function TestimonialSection() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      content:
        "anon-git has completely transformed how our team collaborates. The privacy features give us peace of mind while working on sensitive projects.",
      author: "0x7a3b...c45d",
      role: "Lead Developer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      content:
        "As someone who values privacy, anon-git is exactly what I've been looking for. It combines the best of Git with blockchain security.",
      author: "0x2f1e...9a8b",
      role: "Open Source Contributor",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      content:
        "The decentralized nature of anon-git means our code is always available, regardless of any single point of failure. It's the future of development.",
      author: "0x5d6c...3e2f",
      role: "CTO",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((current) => (current === testimonials.length - 1 ? 0 : current + 1))
  }, [testimonials.length])

  const prev = useCallback(() => {
    setCurrent((current) => (current === 0 ? testimonials.length - 1 : current - 1))
  }, [testimonials.length])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(next, 8000)
    return () => clearInterval(interval)
  }, [next])

  return (
    <section className="py-20 bg-card">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">What developers are saying</h2>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-background rounded-xl p-8 shadow-sm border relative"
              >
                <QuoteIcon className="h-10 w-10 text-primary/20 absolute top-6 left-6" />
                <div className="text-lg mb-6 relative z-10 pl-8 pt-4">{testimonials[current].content}</div>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonials[current].avatar} alt={testimonials[current].author} />
                    <AvatarFallback>{testimonials[current].author.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonials[current].author}</div>
                    <div className="text-sm text-muted-foreground">{testimonials[current].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 gap-2">
              <Button variant="outline" size="icon" onClick={prev}>
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Previous testimonial</span>
              </Button>
              <Button variant="outline" size="icon" onClick={next}>
                <ChevronRightIcon className="h-4 w-4" />
                <span className="sr-only">Next testimonial</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

