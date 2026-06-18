'use client';
import { useRouter } from 'next/navigation';

import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <main className="bg-black text-white min-h-screen">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 min-h-screen flex items-center">
          <div>
            <p className="uppercase tracking-[0.4em] text-zinc-500 text-sm">
              Anonymous Feedback Platform
            </p>

            <h1 className="mt-6 text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.95] tracking-tight">
              Hear what
              <br />
              people really
              <br />
              think.
            </h1>

            <p className="mt-8 text-zinc-400 text-lg max-w-xl leading-relaxed">
              Create your own anonymous feedback page. Share your
              personal link and receive honest messages from anyone,
              anytime.
            </p>

            <div className="mt-10 flex gap-4">
             <Button
              size="lg"
              className="bg-white text-black hover:bg-zinc-200"
              onClick={() => router.push('/sign-up')}
            >
              Get Started
            </Button>

             
            </div>
          </div>
        </section>
        {/* Demo Account Card */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
        <div className="border border-zinc-800 bg-zinc-950 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Demo Account
            </h3>

            <p className="text-zinc-400 text-sm mt-1">
              Use these credentials  to explore the dashboard and test the application.
            </p>
          </div>

          <div className="text-sm">
            <p>
              <span className="text-zinc-500">Email:</span>{' '}
              <span className="font-medium text-white">
                demo@gmail.com
              </span>
            </p>
            <p>
              <span className="text-zinc-500">Username:</span>{' '}
              <span className="font-medium text-white">
                demo
              </span>
            </p>

            <p className="mt-1">
              <span className="text-zinc-500">Password:</span>{' '}
              <span className="font-medium text-white">
                test123
              </span>
            </p>
          </div>
        </div>

        <div className="mt-3 text-xs text-zinc-500">
          Note: New account registration requires email verification through a
          Resend test account, so sign-up functionality may be unavailable for
          public visitors. Please use the demo account above to explore all
          features.
        </div>
      </section>

        {/* Divider */}
        <div className="border-t border-zinc-900" />

        {/* Process Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="text-zinc-500 uppercase tracking-widest text-sm mb-16">
            How it works
          </p>

          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <p className="text-6xl font-bold text-zinc-800">01</p>

              <h3 className="mt-6 text-3xl font-semibold">
                Create
              </h3>

              <p className="mt-4 text-zinc-400 leading-relaxed">
                Sign up and generate your personal anonymous
                feedback page in seconds.
              </p>
            </div>

            <div>
              <p className="text-6xl font-bold text-zinc-800">02</p>

              <h3 className="mt-6 text-3xl font-semibold">
                Share
              </h3>

              <p className="mt-4 text-zinc-400 leading-relaxed">
                Send your unique link to friends, classmates,
                colleagues, or your audience.
              </p>
            </div>

            <div>
              <p className="text-6xl font-bold text-zinc-800">03</p>

              <h3 className="mt-6 text-3xl font-semibold">
                Receive
              </h3>

              <p className="mt-4 text-zinc-400 leading-relaxed">
                Collect genuine opinions and insights without
                revealing identities.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-zinc-900" />

        {/* Carousel Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <div className="flex justify-between items-end mb-16">
            <div>
              
              <h2 className="mt-4 text-5xl md:text-6xl font-bold">
                What people
                <br />
                are saying.
              </h2>
            </div>
          </div>

          <Carousel
      plugins={[
        Autoplay({
          delay: 3500,
        }),
      ]}
      className="w-full max-w-2xl mx-auto"
    >
      <CarouselContent>
        {messages.map((message, index) => (
          <CarouselItem key={index}>
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {message.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex gap-4">
                  <Mail className="w-5 h-5 text-zinc-500 shrink-0 mt-1" />

                  <div>
                    <p className="text-zinc-300 leading-relaxed">
                      {message.content}
                    </p>

                    <p className="mt-6 text-xs text-zinc-600">
                      {message.received}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      </Carousel>
        </section>

        {/* Divider */}
        <div className="border-t border-zinc-900" />

        {/* Statement Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-40">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
            Built for people
            <br />
            who want honest
            <br />
            opinions.
          </h2>

          <div className="mt-12 max-w-2xl">
            <p className="text-zinc-400 text-xl leading-relaxed">
              No names. No pressure. No awkward conversations.
              Just authentic feedback that helps you grow.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-40">
          <div className="border border-zinc-800 rounded-3xl p-12 md:p-20">
            <h2 className="text-4xl md:text-6xl font-bold">
              Start receiving
              <br />
              anonymous feedback.
            </h2>

            <p className="mt-6 text-zinc-400 text-lg max-w-xl">
              Create your profile and start collecting honest
              messages today.
            </p>

            <Button
            size="lg"
            className="mt-10 bg-white text-black hover:bg-zinc-200"
            onClick={() => router.push('/sign-up')}
          >
            Create Account
          </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
          <h3 className="text-xl font-semibold">
            True Feedback
          </h3>

          <p className="mt-2 text-zinc-500">
            Next.js · TypeScript · MongoDB
          </p>

          <p className="mt-6 text-sm text-zinc-600">
            © 2026 True Feedback. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}