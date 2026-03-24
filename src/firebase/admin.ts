import * as admin from "firebase-admin";

/**
 * Singleton para el Firebase Admin SDK en el HUB.
 * Se utiliza para crear usuarios desde el dashboard o gestionar membresías en el Servidor.
 */

if (!admin.apps.length) {
  try {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (serviceAccountVar) {
      const serviceAccount = JSON.parse(
        serviceAccountVar.startsWith("{") 
          ? serviceAccountVar 
          : Buffer.from(serviceAccountVar, "base64").toString()
      );
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin (HUB) inicializado vía Variable de Entorno");
    } else {
      // Uso dinamico de fs para evitar que Webpack falle si el archivo no existe en Vercel
      const fs = require('fs');
      const path = require('path');
      const svcPath = path.resolve(process.cwd(), 'firebase-admin-sdk.json');
      
      if (fs.existsSync(svcPath)) {
        const fileContent = fs.readFileSync(svcPath, 'utf8');
        const serviceAccount = JSON.parse(fileContent);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase Admin (HUB) inicializado vía Archivo Local");
      } else {
        console.warn("ATENCIÓN: FIREBASE_SERVICE_ACCOUNT vacía y no hay firebase-admin-sdk.json.");
      }
    }
  } catch (error) {
    console.error("Error al inicializar Firebase Admin (HUB):", error);
  }
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
export default admin;
