import * as admin from "firebase-admin";

/**
 * Función segura y perezosa (lazy) para inicializar Firebase Admin.
 * Previene el error "The default Firebase app does not exist" al cargar la página en Vercel.
 */
export function getFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (serviceAccountVar) {
    const serviceAccount = JSON.parse(
      serviceAccountVar.startsWith("{") 
        ? serviceAccountVar 
        : Buffer.from(serviceAccountVar, "base64").toString()
    );
    console.log("Firebase Admin (HUB) inicializado vía Variable de Entorno (JSON)");
    return admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } 
  
  if (projectId && clientEmail && privateKey) {
    console.log("Firebase Admin (HUB) inicializado vía Variables Individuales");
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } 
  
  try {
    const fs = require('fs');
    const path = require('path');
    const svcPath = path.resolve(process.cwd(), 'firebase-admin-sdk.json');
    if (fs.existsSync(svcPath)) {
      const fileContent = fs.readFileSync(svcPath, 'utf8');
      console.log("Firebase Admin (HUB) inicializado vía Archivo Local");
      return admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fileContent)) });
    }
  } catch(e) {
    console.warn("Fallo al leer archivo local de credenciales:", e);
  }

  throw new Error("CRÍTICO: Faltan las variables de entorno FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL en Vercel para Firebase Admin.");
}

export const getAdminAuth = () => getFirebaseAdminApp().auth();
export const getAdminFirestore = () => getFirebaseAdminApp().firestore();
