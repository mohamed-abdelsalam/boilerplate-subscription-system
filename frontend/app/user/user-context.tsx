'use client';

import { createContext, useContext } from 'react';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

const UserContext = createContext<User | null>(null);

export function UserProvider({ user, children }: { user: User; children:React.ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
};

export function useUser() {
  return useContext(UserContext);
};