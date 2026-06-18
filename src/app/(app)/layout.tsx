import type { Metadata } from 'next';


import Navbar from '@/components/Navbar';



export const metadata: Metadata = {
  title: 'True Feedback',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}