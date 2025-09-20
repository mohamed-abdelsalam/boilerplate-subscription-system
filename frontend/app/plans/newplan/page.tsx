'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { CreatePlanAction, Price } from '@actions/plans/create-plan-action';

const SupportedCurrencies: string[] = ['eur', 'usd', 'egp', 'sar'];
const Intervals: string[] = ['day', 'week', 'month', 'year'];

export default function NewPlanPage() {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [entries, setEntries] = useState<Price[]>(
    [
      { currency: 'eur',
        unitAmount: 0,
        recurring: 
          {
            interval: 'day',
            intervalCount: 0,
          },
      },
    ],
  );

  const handleChange = (index: number, field: string, value: any) => {
    const newEntries = [...entries];
    if (field === 'recurring.interval') {
      newEntries[index]['recurring']['interval'] = value;
    } else if (field === 'recurring.intervalCount') {
      newEntries[index]['recurring']['intervalCount'] = value;
    } else {
      newEntries[index][field] = value;
    }
    setEntries(newEntries);
  };

  const addEntry = () => {
    setEntries(
      [
        ...entries,
        {
          currency: '', 
          unitAmount: 0,
          recurring: 
          {
            interval: 'day',
            intervalCount: 0,
          },
        },
      ]
    );
  }

  const removeEentry = (index: number) => {
    setEntries(entries.filter((_ , i) => i !== index));
  }
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    await CreatePlanAction({
      name,
      prices: entries,
    });

    router.replace('/plans');
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 max-w-5xl mx-auto'>
      <h1 className='text-2xl font-semibold'>Create New Plan</h1>
      <input
        type='text'
        placeholder='Plan Name'
        required
        className='w-full border p-2 rounded'
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      {entries.map((entry, index) => (
        <div key={index} className='flex items-center gap-5 border p-3 rounded-lg'>
          <div className='flex flex-col'>
            <label htmlFor='unitAmount' className='mb-1 font-medium text-gray-700'>Unit Amount</label>
            <input
              type='number'
              className='border rounded px-3 py-2'
              value={entry.unitAmount}
              placeholder='unitAmount'
              onChange={(e) => handleChange(index, 'unitAmount', e.target.value)}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='currency' className='mb-1 font-medium text-gray-700'>
              Currency
            </label>
            <select
              className='border rounded px-3 py-2'
              value={entry.currency}
              onChange={(e) => handleChange(index, 'currency', e.target.value)}
            >
              {SupportedCurrencies.map((k) => (<option key={k} value={k}>{k.toUpperCase()}</option>))}
            </select>
          </div>

          <div className='flex flex-col'>
            <label htmlFor='currency' className='mb-1 font-medium text-gray-700'>Charging Intervals Count</label>
            <input
              type='number'
              className='border rounded px-3 py-2'
              value={entry.recurring.intervalCount}
              onChange={(e) => handleChange(index, 'recurring.intervalCount', e.target.value)}
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='currency' className='mb-1 font-medium text-gray-700'>Charge Every</label>
            <select
              className='border rounded px-3 py-2'
              value={entry.recurring.interval}
              onChange={(e) => handleChange(index, 'recurring.interval', e.target.value)}
            >
              {Intervals.map((k) => (
                <option key={k} value={k}>{k.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <button type='button' onClick={() => removeEentry(index)} className='px-4 py-2 mt-5 bg-slate-200 text-red-500 hover:text-red-700 rounded-lg'>
            Delete
          </button>
          
        </div>
      ))}
      <div className='flex gap-2'>
        <button type='button' onClick={addEntry} className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'>
          Add Entry
        </button>
        <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'>
          Create Plan
        </button>
      </div>
    </form>
  );
}