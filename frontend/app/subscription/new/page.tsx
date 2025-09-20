'use client';

import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';

import { 
  GetPlaceSubscriptionSocket,
  SubscriptionCheckout
} from '@actions/subscriptions/get-place-subscription-socket';
import { useSearchParams } from 'next/navigation';

export default function NewSubscriptionPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<SubscriptionCheckout | null>(null);

  const triggerSubscription = (event) => {
    event.preventDefault();
    const socket = GetPlaceSubscriptionSocket();

    socket.emit('create-subscription', {
      planId: searchParams.get('planId'),
      priceId: searchParams.get('priceId'),
      type: 'subscription',
    });

    console.log('event emitted');
  }

  useEffect(() => {
    const socket: Socket = GetPlaceSubscriptionSocket();
    socket.on('connect', () => {
      console.log('Connected');
    });

    socket.on('subscription-ready', async (data: SubscriptionCheckout) => {
      setData(data);
      console.log(data);
    });

    socket.on('exception', function(data) {
      console.log('exception', data);
    });

    return () => {
      socket.off('subscription-ready');
      socket.disconnect();
    }

  }, []);

  let element = null;
  if (data) {
    const stripe = loadStripe(data.publicKey);
    const options = { clientSecret: data.clientSecret };
    element = (
      <Elements stripe={stripe} options={options}>
        <PaymentElement />
      </Elements>
    );
  }

  return (
    <div className='flex items-center rounded-xl border-emerald-500'>
      {element}
      <button onClick={triggerSubscription}>Click Me!</button>
    </div>
  );
}
