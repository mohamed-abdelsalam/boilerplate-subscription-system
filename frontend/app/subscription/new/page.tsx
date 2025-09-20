'use client';

import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';

import { 
  GetPlaceSubscriptionSocket,
  SubscriptionCheckout
} from '@actions/subscriptions/get-place-subscription-socket';

export default function NewSubscriptionPage() {
  const [data, setData] = useState<SubscriptionCheckout | null>(null);
  const stripe = loadStripe(data.publicKey);
  const options = { clientSecret: data.clientSecret };

  const triggerEvent = () => {
    const socket = GetPlaceSubscriptionSocket();

    socket.emit('create-subscription', {
      planId: '',
      priceId: '',
      // type: 'subscription' | onceoff
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
    element = (
      <Elements stripe={stripe} options={options}>
        <PaymentElement />
      </Elements>
    );
  }

  return (
    <div>
      {element}
      <button onClick={(event) => {
        event.preventDefault();
        triggerEvent();
      }}>Click Me!</button>
    </div>
  );
}
