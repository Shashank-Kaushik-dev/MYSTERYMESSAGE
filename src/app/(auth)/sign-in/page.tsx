'use client';


import { useState } from 'react';
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
  try {
    setIsSubmitting(true);

    const result = await signIn('credentials', {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error('Login Failed', {
          description: 'Incorrect username or password',
        });
      } else {
        toast.error('Error', {
          description: result.error,
        });
      }
      return;
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  } catch (error) {
    toast.error('Error', {
      description: 'Something went wrong. Please try again.',
    });

    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};

 return (
  <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
    <div className="w-full max-w-md">
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm">
          Welcome Back
        </p>

        <h1 className="mt-4 text-5xl md:text-6xl font-bold tracking-tight">
          Sign In
        </h1>

        <p className="mt-6 text-zinc-400 leading-relaxed">
          Access your anonymous feedback dashboard and continue
          receiving honest messages.
        </p>
      </div>

      {/* Form Card */}
      <div className="border border-zinc-800 rounded-3xl p-8 bg-zinc-950">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    Email / Username
                  </FormLabel>

                  <Input
                    placeholder="Enter email or username"
                    className="bg-zinc-900 border-zinc-700 text-white"
                    {...field}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />

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
                    placeholder="Enter password"
                    className="bg-zinc-900 border-zinc-700 text-white"
                    {...field}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-zinc-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center">
          <p className="text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-white hover:text-zinc-300"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  </main>
);
}