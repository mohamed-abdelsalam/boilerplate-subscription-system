'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignOutAction } from '@actions/auth/signout-action';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    SignOutAction()
    .then(() => router.push('/auth/signin'))
  }, []);
}