'use client';

import { createContext, useContext } from 'react';

type Permission = {
  id: string;
  permissionDescription: string;
};

const PermissionsContext = createContext<Permission[] | null>(null);

export function PermissionsProvider({ permissions, children }: { permissions: Permission[]; children:React.ReactNode }) {
  return <PermissionsContext.Provider value={permissions}>{children}</PermissionsContext.Provider>
};

export function usePermissions() {
  return useContext(PermissionsContext);
};