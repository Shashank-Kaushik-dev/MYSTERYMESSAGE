'use client';
import {useRouter, useParams} from 'next/navigation';
import React from 'react';
import {verifySchema} from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {  useForm } from 'react-hook-form';

import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
import { FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username: string}>()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema ),// resolver for validating form data using zod schema
        defaultValues: {
          code: '',
        },
      });

      const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
          const response = await axios.post('/api/verify-code', {
            username: params.username,
            code: data.code,
          })

          toast.success('success', {
            description: response.data.message,
          }) 
          router.replace('/sign-in');   
      } catch (error) {
        console.error("Error in signup of user", error)
              const axiosError = error as AxiosError<ApiResponse>;
              const errorMessage = axiosError.response?.data.message 
              toast.error('Error', {
                description: errorMessage ?? 'An error occurred during sign up',
              });
      }
}
return (
  <main className="min-h-screen bg-black bg-gradient-to-b from-black via-black to-zinc-950 text-white flex items-center justify-center px-6">
    <div className="w-full max-w-md">
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm">
          Verify Account
        </p>

        <h1 className="mt-4 text-5xl md:text-6xl font-bold tracking-tight">
          Check Your
          <br />
          Email
        </h1>

        <p className="mt-6 text-zinc-400 leading-relaxed">
          Enter the verification code sent to your email address
          to activate your account.
        </p>
        <p className="mt-4 text-zinc-500">
          Verifying account for{" "}
          <span className="text-white font-medium">
            @{params.username}
          </span>
        </p>
      </div>

      {/* Verification Card */}
      <div className="border border-zinc-800 rounded-3xl p-8 bg-zinc-950">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    Verification Code
                  </FormLabel>

                  <Input
                    placeholder="Enter verification code"
                    className="bg-zinc-900 border-zinc-700 text-white text-center tracking-[0.3em]"
                    {...field}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-zinc-200"
            >
              Verify Account
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            Verification codes usually arrive within a few minutes.
          </p>
        </div>
      </div>
    </div>
  </main>
);
}

export default VerifyAccount
