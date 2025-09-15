'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SignInAction } from '@actions/signin-action';

export default function SignInPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await SignInAction({
      email,
      password,
    });
    if (response.ok) {
      router.push('/user');
    } else {
      console.error('Fail to signin');
    }
  }

  return <div className='flex items-center justify-center min-h-screen bg-gray-300'>
    <form onSubmit={handleSubmit} className='bg-white p-6 rounded-2xl shadow-md w-96 space-y-4'>
      <h1 className='text-2xl font-semibold'>Sign In</h1>
      <input 
        type='email'
        placeholder='Email'
        className='w-full border p-2 rounded'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type='password'
        placeholder='Password'
        className='w-full border p-2 rounded'
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>Sign In</button>
      <a href='/auth/signup'>No account create new one</a>
    </form>
  </div>
}