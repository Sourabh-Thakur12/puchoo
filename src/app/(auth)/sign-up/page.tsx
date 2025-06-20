'use client'

import React, { useEffect, useState } from 'react'
import * as z  from 'zod'
import { useForm } from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@react-email/components'
import {Loader2} from 'lucide-react'

const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debouncedUsername = useDebounceCallback(setUsername, 300)
  const router = useRouter()


  // zod implimentataion
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(()=>{
    const checkUniqueUsername = async () => {
      if(username){
        setIsCheckingUsername(true)
        setUsername('')
        try {
          const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`)
            setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>          
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        }
        finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUniqueUsername()
  },[username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast.message('Success',{
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.log('Error in signing up user', error);
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message

      toast.error(errorMessage)
      setIsSubmitting(false)
      
    }

  }
  
  return (
     <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center"></div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username"
                 {...field}
                 onChange={(e) => {
                  field.onChange(e)
                  debouncedUsername(e.target.value)
                 }} />

              </FormControl>
                {isCheckingUsername && <Loader2 className='animate-spin' />}
                <p className={`text-sm ${usernameMessage === "User is abvailable" ? 'text-green-500' : 'text-red-500'}`}>test {usernameMessage}</p>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="email"
                 {...field}
                  />
              </FormControl>
              <FormDescription>
                
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input placeholder="password" type='password'
                 {...field}
                 />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
 
          <Button type="submit" aria-disabled={isSubmitting}>
          {
            isSubmitting? (
              <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin'/>Please Wait 
              </>
            ):('Sign-up')
          }
          </Button>
            </form> 
        </Form>
        <p>
          Already a member? {' '}
          <Link href="/Sign-in" className='text-blue-600 hover:text-blue-800'>Sign-in</Link>
        </p>
        </div>
    </div>
  )
}

export default page