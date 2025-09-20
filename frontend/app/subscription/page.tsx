'use client';

import { GetUserSubscriptionAction } from '@actions/subscriptions/get-user-subscriptions-action';
import { useEffect, useState } from 'react';

export default function UserSubscriptionsPage() {

  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    GetUserSubscriptionAction()
      .then((response) => setSubscriptions(response))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className='max-w-3xl mx-auto space-y-8'>
      {subscriptions.map((subscription) => (
        <section className='bg-white shadow rounded-2xl p-6 space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800'>{subscription.id}</h2>
      </section>
      ))}
    </div>
  );
}