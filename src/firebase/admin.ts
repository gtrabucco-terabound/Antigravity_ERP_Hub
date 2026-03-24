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
      const serviceAccount = require("../../firebase-admin-sdk.json");
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin (HUB) inicializado vía Archivo Local");
    }
  } catch (error) {
    console.error("Error al inicializar Firebase Admin (HUB):", error);
  }
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
export default admin;
