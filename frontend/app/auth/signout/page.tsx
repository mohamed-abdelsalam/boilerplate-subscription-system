'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignOutAction } from '@actions/signout-action';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    SignOutAction()
    .then(() => router.push('/auth/signin'))
  }, []);
}