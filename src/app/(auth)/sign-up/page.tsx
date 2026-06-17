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
  const [username,setUsername] = useState('');
  const [usernameMessage,setUsernameMessage] = useState('');
  const[isCheckingUsername,setIsCheckingUsername] = useState(false);
  const[isSubmitting,setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);

  // zod implementtation for form validation using react-hook-form and zod schema
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),// resolver for validating form data using zod schema
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect( () => {
    const checkUsernameUnique = async () => {
    if (username) {
      setIsCheckingUsername(true);
      setUsernameMessage('');
      try{
         const reponse = await axios.get(`/api/check-username-unique?username=${username}`)
         // console.log(response.data.message)
         // let message = response.data.message;
         setUsernameMessage(reponse.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username');
      } finally{
        setIsCheckingUsername(false);
      }
    }}
    checkUsernameUnique();
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const resposne = await axios.post('/api/sign-up', data);
      toast.success('Success', {
          description: resposne.data.message,
});
      router.replace(`/verify/${username}`)
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message 
      toast.error('Error', {
        description: errorMessage ?? 'An error occurred during sign up',
      });
      setIsSubmitting(false);
    }
  };

 return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                     placeholder="Enter your username"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />{/*no need for onchange here as react-hook-form handles it automatically */} 
                  <p className=' text-gray-400 text-sm'>We will send you a verification code</p>
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
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}