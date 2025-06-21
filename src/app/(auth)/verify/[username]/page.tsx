'use client'
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import dbConnect from "@/lib/dbConnect";
import React from 'react'
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { verifyValidation } from "@/schemas/verifySchema";
import * as z from 'zod'
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username : string}>()

    const form = useForm<z.infer<typeof verifyValidation>>({
      resolver: zodResolver(verifyValidation),
      
    })

    const onSubmit = async (data : z.infer<typeof verifyValidation> )=> {
     try {
      const response = await axios.post(`/api/verify-code`,{
        username: params.username,
        code: data.code
      })

      toast.success(response.data.message)
      router.replace('sign-in')

     } catch (error) {
      console.log('Error in signing up user', error);
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message

      toast.error(errorMessage)
      
     }
    }

  return (
     <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center"><h1 className="text-4xl font-extrabold tracking-tight lg:text-4xl mb-6">Verification Code</h1>
        <p className="mb-6">Enter your Verification code here</p></div>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code"
                 {...field}
                  />

              </FormControl>
  
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        </form>
        </Form>
        
      </div>
    </div>
 
  )
}

export default VerifyAccount   