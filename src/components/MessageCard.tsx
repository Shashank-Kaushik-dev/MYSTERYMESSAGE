'use client'


import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );

      toast(response.data.message);

      onMessageDelete(message._id.toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error('Error', {
        description:
          axiosError.response?.data.message ??
          'Failed to delete message',
      });
    }
  };

  return (
    <Card className="bg-zinc-950 border border-zinc-800 rounded-3xl text-white hover:border-zinc-700 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">
              Anonymous Message
            </CardTitle>

            <p className="text-sm text-zinc-500 mt-1">
              {dayjs(message.createdAt).format(
                'MMM D, YYYY • h:mm A'
              )}
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="
                  border-zinc-700
                  bg-zinc-900
                  hover:bg-red-500/10
                  hover:border-red-500
                  hover:text-red-400
                "
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete Message?
                </AlertDialogTitle>

                <AlertDialogDescription className="text-zinc-400">
                  This action cannot be undone. The message
                  will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-zinc-300 leading-relaxed break-words">
          {message.content}
        </p>
      </CardContent>
    </Card>
  );
}