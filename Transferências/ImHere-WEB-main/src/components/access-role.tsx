"use client"
import { useAuth } from '@/hooks/useAuth';
import React from 'react';

interface ACLProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function AccessRole({ allowedRoles, children }: Readonly<ACLProps>) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
