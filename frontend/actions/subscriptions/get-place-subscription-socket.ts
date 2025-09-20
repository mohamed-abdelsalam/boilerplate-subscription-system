
import { END_POINTS } from '@actions/endpoints';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const GetPlaceSubscriptionSocket = (): Socket => {
  if (!socket) {
    socket = io(END_POINTS.CREATE_SUBSCRIPTION_WS, {
      withCredentials: true,
      transports: ['websocket'],
    });
  }

  return socket;
};

export type SubscriptionCheckout = {
  clientSecret: string;
  publicKey: string;
};
