
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Tenant {
  id: string;
  name: string;
  tenantId: string;
  modules?: any[];
}

interface TenantContextProps {
  selectedTenant: Tenant | null;
  setSelectedTenant: (tenant: Tenant | null) => void;
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [selectedTenant, setSelectedTenantState] = useState<Tenant | null>(null);

  // Persistir selección en localStorage para navegación entre páginas
  useEffect(() => {
    const saved = localStorage.getItem('selected_tenant');
    if (saved) {
      try {
        setSelectedTenantState(JSON.parse(saved));
      } catch (e) {
        console.error("Error al cargar tenant guardado");
      }
    }
  }, []);

  const setSelectedTenant = (tenant: Tenant | null) => {
    setSelectedTenantState(tenant);
    if (tenant) {
      localStorage.setItem('selected_tenant', JSON.stringify(tenant));
    } else {
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
