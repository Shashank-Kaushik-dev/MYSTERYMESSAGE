'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { SuggestionResponse } from '@/types/SuggestionResponse';





export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

 const [suggestions, setSuggestions] = useState<string[]>([
  "What's your favorite movie?",
  "Do you have any pets?",
  "What's your dream job?",
]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);

    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast('Message Sent', {
        description: response.data.message,
      });

      form.reset({
        ...form.getValues(),
        content: '',
      });
    } catch (error) {
       const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage =
          axiosError.response?.data.message ??
          'Failed to send message';

  toast.error(errorMessage);
} finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    setIsSuggestLoading(true);
    setSuggestError(null);

    const response = await fetch('/api/suggest-messages', {
      method: 'POST',
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }

  const data: SuggestionResponse = await response.json();

  setSuggestions(data.messages);

  } catch (error) {
    const message =
      error instanceof Error && error.name === 'AbortError'
        ? 'Request timed out. Please try again.'
        : 'Failed to load suggestions';

    setSuggestError(message);

    toast('Error', {
      description: message,
    });
  } finally {
    clearTimeout(timeoutId);
    setIsSuggestLoading(false);
  }
};

 return (
  <main className="min-h-screen bg-black bg-gradient-to-b from-black via-black to-zinc-950 text-white">
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Send Anonymous Message
        </h1>

        <p className="mt-4 text-zinc-400">
          Leave anonymous feedback for
          <span className="text-white font-semibold ml-2">
            @{username}
          </span>
        </p>
      </div>

      <Card className="bg-zinc-950 border border-zinc-800 rounded-3xl mb-8">
        <CardContent className="p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">
                      Your Message
                    </FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here..."
                        className="
                          resize-none
                          min-h-32
                          bg-zinc-900
                          border-zinc-700
                          text-white
                          placeholder:text-zinc-500
                        "
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                {isLoading ? (
                  <Button
                    disabled
                    className="bg-white text-black"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent}
                    className="bg-white text-black hover:bg-zinc-200"
                  >
                    Send Message
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4 mb-10">
        <div className="flex flex-col gap-3">
          <Button
            onClick={fetchSuggestedMessages}
            disabled={isSuggestLoading}
            className="w-fit bg-zinc-800 text-white hover:bg-zinc-700"
          >
            {isSuggestLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Suggest Messages'
            )}
          </Button>

          <p className="text-zinc-400">
            Need inspiration? Generate suggestions and click one
            to use it.
          </p>
        </div>

        <Card className="bg-zinc-950 border border-zinc-800 rounded-3xl">
          <CardHeader>
            <h3 className="text-xl font-semibold text-white">
              Suggested Messages
            </h3>
          </CardHeader>

          <CardContent className="flex flex-col space-y-3">
            {suggestError ? (
              <p className="text-red-400">{suggestError}</p>
            ) : (
              suggestions.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="
                    whitespace-normal
                    h-auto
                    p-4
                    text-left
                    justify-start
                    border-zinc-700
                    bg-zinc-900
                    text-white
                    hover:bg-zinc-800
                  "
                  onClick={() =>
                    handleMessageClick(message)
                  }
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="bg-zinc-800 my-8" />

      <div className="text-center py-4">
        <h3 className="text-2xl font-semibold mb-2">
          Create Your Own Message Board
        </h3>

        <p className="text-zinc-400 mb-6">
          Start receiving anonymous messages from friends,
          classmates, and colleagues.
        </p>

        <Link href="/sign-up">
          <Button className="bg-white text-black hover:bg-zinc-200">
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>
  </main>
);
}