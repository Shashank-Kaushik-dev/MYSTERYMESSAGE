'use client';
import React from 'react';
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useState,useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInSchema } from '@/schemas/signInSchema';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, {AxiosError} from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Loader2 } from 'lucide-react';


export default function SignInForm() {

  const router = useRouter();
 
  const[isSubmitting,setIsSubmitting] = useState(false);
 
  // zod implementtation for form validation using react-hook-form and zod schema
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),// resolver for validating form data using zod schema
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

 

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
     const result = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
    })
    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error( 'Login Failed',{  
          description: 'Incorrect username or password', 
        });
      } else {
        toast.error('Error',{     
          description: result.error,    
        });
      }
    }

    if(result?.url) {
        router.replace("/dashboard")
    }
  };

 return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input placeholder="Email/Username" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input placeholder="Password" type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type="submit">Sign In</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}