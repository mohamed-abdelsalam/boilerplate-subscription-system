'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProfileAction } from '@actions/users/profile-action';
import { UserProvider } from './user-context';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    ProfileAction().then((response) => {
      if (!response) {
        router.replace('/auth/signin');
      } else {
        setUser(response);
      }
    })
    .catch((error) => {
      console.error(error);
      router.replace('/auth/signin');
    }).finally(() => {
      setIsLoading(false);
    });
  }, [router]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen text-gray-600'>
        Loading...
      </div>
    );
  }

  if (user === null) return null;

  return (
    <UserProvider user={user}>
      <div className='min-h-screen bg-gray-50 flex'>
      <aside className='w-64 bg-white shadow-md p-6 space-y-6'>
        <h2 className='text-xl font-semibold text-gray-800'>My Account</h2>
        <nav className='flex flex-col space-y-2'>
          <Link href='/subscription' className='px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition'>Subscriptions</Link>
          <Link href='/user/settings' className='px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition'>Settings</Link>
          <Link href='/auth/signout' className='px-3 py-2 rounded-lg text-red-700 hover:bg-blue-50 hover:text-red-600 transition'>Sign out</Link>
        </nav>
      </aside>
      <main className='flex-1 p-8'>{children}</main>
    </div>
    </UserProvider>
  );
}
