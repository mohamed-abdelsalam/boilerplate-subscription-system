'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PermissionsProvider } from './permission-context';
import { GetAdminPermissionsAction } from '@actions/users/get-admin-permissions-action';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [permissions, setPermissions] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    GetAdminPermissionsAction()
      .then(() => (setPermissions([])))
      .catch(() => (setPermissions(null)))
      .finally(() => (setIsLoading(false)));
    }, []);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen text-gray-600'>
        Loading...
      </div>
    );
  }
  
  if (permissions === null) return null;

  return (
    <PermissionsProvider permissions={permissions}>
      <div className='min-h-screen bg-gray-50 flex'>
        <aside className='w-64 bg-white shadow-md p-6 space-y-6'>
          <h2 className='text-xl font-semibold text-gray-800'>Admin Portal</h2>
          <nav className='flex flex-col space-y-2'>
            <Link href='/admin/newplan' className='px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition'>Create Plan</Link>
            <Link href='/admin/plans' className='px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition'>Plans</Link>
            <Link href='/admin/users' className='px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition'>Users</Link>
            <Link href='/admin/subscriptions' className='px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition'>Subscriptions</Link>
            <Link href='/auth/signout' className='px-3 py-2 rounded-lg text-red-700 hover:bg-blue-50 hover:text-red-600 transition'>Sign out</Link>
          </nav>
        </aside>
        <main className='flex-1 p-8'>{children}</main>
      </div>
    </PermissionsProvider>
  );
};