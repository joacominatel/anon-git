"use client"

import { useState } from "react"
import { WalletIcon, CheckCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export function Web3Status() {
  // This would come from your web3 provider
  const [isConnected, setIsConnected] = useState(true)
  const [address, setAddress] = useState("0x1234...5678")
  const [network] = useState("Ethereum")

  const handleConnect = () => {
    // Connect wallet logic
    setIsConnected(true)
    setAddress("0x1234...5678")
  }

  if (!isConnected) {
    return (
      <Button size="sm" onClick={handleConnect}>
        <WalletIcon className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
              <CheckCircleIcon className="h-3 w-3 text-green-500" />
              <span className="text-xs">{network}</span>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p>Connected to {network}</p>
            <p className="text-muted-foreground">{address}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}