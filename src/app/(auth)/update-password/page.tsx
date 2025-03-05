'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePassword } from '@/services/userServices'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
})

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true)
    setError('')
    setSuccess('')

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      await updatePassword(data.password)
      setSuccess('Password updated successfully')
      toast.success('Password updated successfully', {
        description: 'You can now login with your new password',
      })
      setLoading(false)
      router.push('/')
    } catch (error: any) {
      setError('Failed to update password')
      toast.error('Failed to update password', {
        description: error.message,
      })
      setLoading(false)
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Update Password</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
