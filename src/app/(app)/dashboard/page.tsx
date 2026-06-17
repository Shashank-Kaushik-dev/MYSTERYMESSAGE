'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';

import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';

import {Input} from '@/components/ui/input';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

 

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessage: false,
    },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessage');

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessage', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {  
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings'
        
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast('Refreshed Messages',{
                description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast('Error',{
           
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages'
          
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessage();
  }, [session, setValue,  fetchAcceptMessage, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessage', !acceptMessages);
      toast('Message Settings Updated', {
        description: response.data.message,
        
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error', {
        
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings'
        
      });
    }
  };

  if (!session || !session.user) {
    return <div> Please login</div>;
  }

  const { username } = session.user as User;
  // TODO: do more research on how to get the base url in nextjs, this is a hacky way to do it

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast('URL Copied!', {
      description: 'Profile URL has been copied to clipboard.',
    });
  };

 return (
  <main className="min-h-screen bg-black bg-gradient-to-b from-black via-black to-zinc-950 text-white">
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">

      {/* Header */}
         <div className="mb-16">
  <h1 className="text-6xl md:text-8xl font-black tracking-tight">
    Dashboard
  </h1>

  <p className="mt-4 text-xl text-zinc-400">
    Welcome back,
    <span className="text-white font-semibold ml-2">
      @{username}
    </span>
  </p>

  <p className="mt-6 text-zinc-500 max-w-2xl">
    Manage your anonymous feedback page, share your profile,
    and review incoming messages.
  </p>
</div>

      {/* Profile Link Card */}
      <div className="border border-zinc-800 rounded-3xl p-8 bg-zinc-950 mb-8">
  <h2 className="text-2xl font-semibold mb-2">
    Your Feedback Link
  </h2>

  <p className="text-zinc-400 mb-6">
    Share this link with others to receive anonymous messages and feedback.
  </p>

  <div className="flex flex-col md:flex-row gap-4">
    <Input
      value={profileUrl}
      disabled
      className="bg-zinc-900 border-zinc-700 text-white"
    />

    <Button
      onClick={copyToClipboard}
      className="bg-white text-black hover:bg-zinc-200"
    >
      Copy Link
    </Button>
  </div>
</div>

      {/* Settings Card */}
      <div className="border border-zinc-800 rounded-3xl p-8 bg-zinc-950 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Accept Messages
            </h2>

            <p className="text-zinc-500 mt-1">
              Enable or disable anonymous messages.
            </p>
          </div>

          <div className="flex items-center gap-4">
  <Switch
  {...register('acceptMessage')}
  checked={acceptMessages}
  onCheckedChange={handleSwitchChange}
  disabled={isSwitchLoading}
  className="
    data-[state=checked]:bg-emerald-500
    data-[state=unchecked]:bg-zinc-700
  "
/>

  <span
    className={`text-sm font-medium ${
      acceptMessages ? 'text-green-400' : 'text-red-400'
    }`}
  >
    {acceptMessages ? 'ON' : 'OFF'}
  </span>
</div>
        </div>
      </div>

      {/* Messages Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">
          Messages
        </h2>

        <Button
        variant="outline"
        className="border-zinc-700 text-black hover:bg-zinc-200"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </>
        )}
      </Button>
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="border border-zinc-800 rounded-3xl p-12 bg-zinc-950 text-center">
            <p className="text-zinc-500">
              No messages yet.
            </p>
          </div>
        )}
      </div>

    </div>
  </main>
);
}

export default UserDashboard;