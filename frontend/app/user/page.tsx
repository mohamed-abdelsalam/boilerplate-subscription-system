'use client';

import { useUser } from './user-context';

export default function UserPage() {

  const user = useUser();

  return (
    <div className='max-w-3xl mx-auto space-y-8'>
      <div className='bg-white shadow rounded-2xl p-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Hello, {user.firstName} {user.lastName}!</h1>
      </div>

      <section className='bg-white shadow rounded-2xl p-6 space-y-4'>
        <h2 className='text-xl font-semibold text-gray-800'>Personal Information</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <p className='test-sm text-gray-500'>Full Name</p>
            <p className=' text-gray-800 font-medium'>{user.firstName} {user.lastName}</p>
          </div>
          <div>
            <p className='test-sm text-gray-500'>Email</p>
            <p className=' text-gray-800 font-medium'>{user.email}</p>
          </div>
        </div>
      </section>

    </div>
  );
}