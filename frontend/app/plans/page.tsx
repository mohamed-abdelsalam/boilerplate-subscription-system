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
            <p className='test-sm text-gray-500'>Prices</p>
            {p.prices.map((price) => {
              return (
                <section key={price.id} className='bg-white shadow rounded-xl p-6 space-y-4'>
                  <p className='text-gray-800 font-medium'>{price.unitAmount} {price.currency}</p>
                  <button className='w-full bg-green-600 text-white py-2 rounded hover:bg-green-700' onClick={() => {router.push('/subscription/new');}}>Subscripe Now!</button>
              </section>)
            })}
          </div>
        </section>))
      }
    </div>);
  }
}