
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

interface Tenant {
  id: string;
  name: string;
  tenantId: string;
  activeModules?: string[];
  plan?: string;
  status?: string;
}

interface TenantContextProps {
  selectedTenant: Tenant | null;
  setSelectedTenant: (tenant: Tenant | null) => void;
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const db = useFirestore();
  const [selectedTenantStub, setSelectedTenantStub] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('selected_tenant');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id) setSelectedTenantStub({ id: parsed.id });
      } catch (e) {
        console.error("Error al cargar tenant guardado");
      }
    }
  }, []);

  const tenantRef = useMemo(() => {
    if (!db || !selectedTenantStub?.id) return null;
    return doc(db, "_gl_tenants", selectedTenantStub.id);
  }, [db, selectedTenantStub?.id]);

  const { data: selectedTenant } = useDoc<Tenant>(tenantRef as any);

  const setSelectedTenant = (tenant: Tenant | null) => {
    if (tenant) {
      setSelectedTenantStub({ id: tenant.id });
      localStorage.setItem('selected_tenant', JSON.stringify({ id: tenant.id, name: tenant.name, tenantId: tenant.tenantId }));
    } else {
      setSelectedTenantStub(null);
      localStorage.removeItem('selected_tenant');
    }
  };

  return (
    <TenantContext.Provider value={{ selectedTenant, setSelectedTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant must be used within TenantProvider');
  return context;
};
