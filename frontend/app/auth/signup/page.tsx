'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SignUpAction } from '@actions/signup-action';

export default function SignUpPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await SignUpAction({
      email,
      password,
      firstName,
      lastName,
    });
    if (!response.ok) {
      console.error('Failed', await response.json());
    } else {
      router.push('/user');
    }
  }

  return <div className='flex items-center justify-center min-h-screen bg-gray-300'>
    <form onSubmit={handleSubmit} className='bg-white p-6 rounded-2xl shadow-md w-96 space-y-4'>
      <h1 className='text-2xl font-semibold'>Create New Account</h1>
      <input
        type='email'
        placeholder='Email'
        required
        className='w-full border p-2 rounded'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        required
        className='w-full border p-2 rounded'
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <input
        type='text'
        placeholder='First Name'
        className='w-full border p-2 rounded'
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
      />
      <input
        type='text'
        placeholder='Last Name'
        className='w-full border p-2 rounded'
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
      />
      <button type='submit' className='w-full bg-green-600 text-white py-2 rounded hover:bg-green-700'>Sign Up</button>
    </form>
  </div>
}