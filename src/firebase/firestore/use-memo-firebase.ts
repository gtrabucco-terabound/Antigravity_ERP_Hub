'use client';

import { useMemo, useRef } from 'react';

/**
 * Hook para memorizar referencias o consultas de Firestore.
 * Evita ciclos de renderizado infinitos al asegurar que la referencia solo cambie si las dependencias lo hacen.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<T>(null as any);
  const lastDeps = useRef<any[]>([]);

  const changed = !deps.every((dep, i) => dep === lastDeps.current[i]);

  if (changed) {
    ref.current = factory();
    lastDeps.current = deps;
  }

  return ref.current;
}
