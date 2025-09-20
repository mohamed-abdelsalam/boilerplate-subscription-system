'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GetPlansAction, Plan } from '@actions/plans/get-plans-action';

export default function PlansPage() {
  const[plans, setPlans]= useState<Plan[]>([]);

  useEffect(() => {
    GetPlansAction().then((p) => setPlans(p))
    .catch(err => console.error(err));
  }, [])
  const router= useRouter();

  if (plans === null) {
    return (
      <div className='flex items-center justify-center text-gray-700'>
        Failed to get plans
      </div>
    )
  } else {
    return (<div>
      {plans.map((p) => (
        <section className='bg-white shadow rounded-2xl p-6 space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800'>{p.name}</h2>
          <div>
            <p className='test-sm text-gray-500'>Price</p>
            <p className=' text-gray-800 font-medium'>{p.prices[0].unitAmount} {p.prices[0].currency}</p>
            <button onClick={() => {
              router.push('/subscription/new');
            }} className='w-full bg-green-600 text-white py-2 rounded hover:bg-green-700'>Subscripe Now!</button>
          </div>
        </section>))
      }
    </div>);
  }
}