'use client';

import {  useDebounceCallback } from 'usehooks-ts'
import { useState,useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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

import { signUpSchema } from '@/schemas/signUpSchema';
import axios, {AxiosError} from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Loader2 } from 'lucide-react';


export default function SignUpForm() {

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
      router.replace(`/verify/${data.username}`)
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message 
      toast.error('Error', {
        description: errorMessage ?? 'An error occurred during sign up',
      });
      setIsSubmitting(false);
    }
  };

return (
  <main className="min-h-screen bg-black bg-gradient-to-b from-black via-black to-zinc-950 text-white flex items-center justify-center px-6 py-16">
    <div className="w-full max-w-md">
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm">
          Create Account
        </p>

        <h1 className="mt-4 text-5xl md:text-6xl font-bold tracking-tight">
          Join True
          <br />
          Feedback
        </h1>

        <p className="mt-6 text-zinc-400 leading-relaxed">
          Create your anonymous feedback page and start receiving
          honest opinions from anyone.
        </p>
      </div>

      {/* Form Card */}
      <div className="border border-zinc-800 rounded-3xl p-8 bg-zinc-950">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Username */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    Username
                  </FormLabel>

                  <Input
                    placeholder="Choose a username"
                    className="bg-zinc-900 border-zinc-700 text-white"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />

                  {isCheckingUsername ? (
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Checking username...
                    </div>
                  ) : (
                    usernameMessage && (
                      <p
                        className={`text-sm ${
                          usernameMessage === 'Username is unique'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    Email
                  </FormLabel>

                  <Input
                    placeholder="Enter your email"
                    className="bg-zinc-900 border-zinc-700 text-white"
                    {...field}
                  />

                  <p className="text-zinc-500 text-sm">
                   We&apos;ll send a verification code to this email.
                  </p>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    Password
                  </FormLabel>

                  <Input
                    type="password"
                    placeholder="Create a password"
                    className="bg-zinc-900 border-zinc-700 text-white"
                    {...field}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-zinc-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-zinc-500">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="text-white hover:text-zinc-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  </main>
);
}