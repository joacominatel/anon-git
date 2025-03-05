import Link from "next/link"
import { GitBranchIcon } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <GitBranchIcon className="h-6 w-6 text-primary" />
      <span className="font-bold text-lg hidden sm:inline-block">anon-git</span>
    </Link>
  )
}