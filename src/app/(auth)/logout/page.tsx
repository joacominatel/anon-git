'use client'
import { useAuth } from "@/context/AuthContext"

export default function LogoutPage() {
  const { signOut } = useAuth()
  signOut()
  return <div>Logged out</div>
}