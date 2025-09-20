'use client';

import React, { useState } from 'react';
import { CreatePlanAction } from '@actions/plans/create-plan-action';
import { useRouter } from 'next/navigation';

export default function NewPlanPage() {

  const [name, setName] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [nickname, setNickname] = useState<string>();
  const [unitAmount, setUnitAmount] = useState<number>(0);
  const router = useRouter()
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    await CreatePlanAction({
      name,
      prices: [{
        currency,
        unitAmount,
        nickname,
        recurring: {
          interval: 'day',
          intervalCount: 12,
        }
      }],
    });

    router.replace('/plans');
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-300'>
      <form onSubmit={handleSubmit} className='bg-white p-6 rounded-2xl shadow-md w-96 space-y-4'>
        <h1 className='text-2xl font-semibold'>Create New Plan</h1>
        <input
          type='text'
          placeholder='Plan Name'
          required
          className='w-full border p-2 rounded'
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type='text'
          placeholder='Price Nickname'
          required
          className='w-full border p-2 rounded'
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
        />
        <input
          type='number'
          placeholder='Unit Amount'
          required
          className='w-full border p-2 rounded'
          value={unitAmount}
          onChange={(event) => setUnitAmount(Number(event.target.value))}
        />
        <input
          type='text'
          placeholder='Currency'
          required
          className='w-full border p-2 rounded'
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
        />
        <button type='submit' className='w-full bg-green-600 text-white py-2 rounded hover:bg-green-700'>Create Plan</button>
      </form>
    </div>
  );
}