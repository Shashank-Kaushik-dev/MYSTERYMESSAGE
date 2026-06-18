'use client'


import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';

import {usePathname} from 'next/navigation';

function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user  = session?.user;
 
  

  return (
  <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="grid grid-cols-3 items-center">
        
        {/* Left */}
        <Link href="/" className="justify-self-start">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Mystery Message
          </h1>
        </Link>

        {/* Center */}
        <div className="justify-self-center">
          {session && (
            <span className="text-zinc-300">
              Welcome,
              <span className="text-white font-semibold ml-2">
                {user?.username || user?.email}
              </span>
            </span>
          )}
        </div>

        {/* Right */}
       <div className="justify-self-end flex items-center gap-3">
        {session ? (
          <>
            {pathname !== '/dashboard' && (
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="bg-white text-black hover:bg-zinc-200"
                >
                  Dashboard
                </Button>
              </Link>
            )}

            <Button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-white text-black hover:bg-zinc-200"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-white text-black hover:bg-zinc-200">
              Login
            </Button>
          </Link>
        )}
      </div>

      </div>
    </div>
  </nav>
);
}

export default Navbar;