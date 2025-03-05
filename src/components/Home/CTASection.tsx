import { Button } from "@/components/ui/button"
import { GitBranchIcon } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-20 bg-background text-foreground border-t">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GitBranchIcon className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to code anonymously?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already building the future with anon-git. Start your anonymous coding
            journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Connect Wallet
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10"
            >
              Explore Repositories
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

