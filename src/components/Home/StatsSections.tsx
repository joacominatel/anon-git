"use client"
import { motion } from "framer-motion"

interface StatItemProps {
  value: string
  label: string
  delay: number
}

function StatItem({ value, label, delay }: StatItemProps) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="text-4xl font-bold mb-2">{value}</div>
      <div className="text-muted-foreground">{label}</div>
    </motion.div>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Trusted by developers worldwide
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="10K+" label="Repositories" delay={0.1} />
            <StatItem value="5K+" label="Developers" delay={0.2} />
            <StatItem value="1M+" label="Commits" delay={0.3} />
            <StatItem value="99.9%" label="Uptime" delay={0.4} />
          </div>
        </div>
      </div>
    </section>
  )
}

