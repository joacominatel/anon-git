'use client'
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
export default function LogoutPage() {
  const { signOut } = useAuth()
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  signOut()
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(countdown - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [countdown])
  useEffect(() => {
    setTimeout(() => {
      router.push('/')
    }, 5000)
  }, [router])
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Logged out</h1>
      <p className="text-sm text-gray-500">You will be redirected to the home page in {countdown} seconds</p>
    </div>
  )
}