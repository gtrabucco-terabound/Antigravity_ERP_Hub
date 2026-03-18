# Configuración de Firebase - TerraLink Hub

Este documento detalla la vinculación de este módulo con el backend centralizado de Terabound.

## Detalles del Proyecto
- **Nombre de la App:** TerraLink Hub (Shell Principal)
- **ID del Proyecto Firebase:** `studio-1405627774-cebad`
- **Plataforma:** Web (Next.js 15)

## Servicios Utilizados
- **App Hosting:** Configurado en `apphosting.yaml`.
- **Firestore:** Reglas base definidas en `firestore.rules`.
- **Firebase Auth:** Gestionado vía `src/firebase/provider.tsx`.

## Configuración de Entorno
Se han configurado las siguientes variables en `.env.local`:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Estado de la Inicialización
- [x] Vinculación exitosa en `.firebaserc`.
- [x] Archivos de configuración Firebase generados.
- [x] Inicialización modular del SDK implementada.
- [x] Documentación de configuración completada.
