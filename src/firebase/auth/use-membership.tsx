'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore } from '../provider';
import { useUser } from './use-user';
import { useTenant } from '@/context/tenant-context';
import { collection, query, where, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';

interface UserMembership {
  id: string;
  userId: string;
  role: 'ADMIN_OWNER' | 'SUPERVISOR' | 'OPERATIVE';
  status: string;
  email: string;
  name: string;
}

export function useMembership() {
  const { user } = useUser();
  const { selectedTenant } = useTenant();
  const db = useFirestore();
  const [membership, setMembership] = useState<UserMembership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !user?.uid || !selectedTenant?.id) {
      setLoading(false);
      setMembership(null);
      return;
    }

    setLoading(true);
    const membersRef = collection(db, '_gl_tenants', selectedTenant.id, 'members');
    const q = query(membersRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // DEBUG OVERRIDE
      const debugRole = localStorage.getItem('debug_role');
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data() as UserMembership;
        if (debugRole) data.role = debugRole as any;
        
        // Mapeo seguro en caso de que en la BD se haya tipeado "ADMIN" manualmente
        if ((data.role as any) === "ADMIN") {
          data.role = "ADMIN_OWNER";
        }
        
        setMembership({ ...data, id: doc.id });
      } else if (debugRole) {
        setMembership({ 
          id: 'debug', 
          role: debugRole as any, 
          email: user.email || 'debug@test.com',
          name: 'Debug User',
          status: 'active',
          userId: 'debug'
        });
      } else {
        setMembership(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching membership:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, user?.uid, selectedTenant?.id]);

  return { membership, loading };
}
