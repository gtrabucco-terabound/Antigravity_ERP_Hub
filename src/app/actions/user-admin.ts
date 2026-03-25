"use server"

import { getAdminAuth, getAdminFirestore } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Server Action para crear un usuario desde el HUB y vincularlo al Tenant activo.
 * Solo debe ser invocado por Admins (Admin/Owner).
 */

interface CreateUserParams {
  email: string;
  displayName: string;
  tenantId: string;
  role: "ADMIN" | "MANAGER" | "AREA_MANAGER" | "SUPERVISOR" | "OPERATIVE" | "ADMINISTRATIVE" | "FINANCE" | "IT" | "AUDITOR";
  modules?: string[];
  tempPassword?: string;
}

export async function createTenantUserAction({
  email,
  displayName,
  tenantId,
  role,
  modules = [],
  tempPassword
}: CreateUserParams) {
  try {
    const adminAuth = getAdminAuth();
    const adminFirestore = getAdminFirestore();

    if (!tenantId) throw new Error("tenantId es requerido");

    // 1. Crear usuario en Firebase Auth usando tempPassword si existe, si no generar uno seguro legible y fácil
    const generatedPassword = tempPassword || ("Tera" + Math.floor(1000 + Math.random() * 9000) + "!");
    
    let userRecord;
    try {
      userRecord = await adminAuth.createUser({
        email,
        password: generatedPassword,
        displayName,
      });
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-exists') {
        // El usuario ya existe en Auth, lo obtenemos
        userRecord = await adminAuth.getUserByEmail(email);
      } else {
        throw authError; // Relanzar si es otro error
      }
    }

    const uid = userRecord.uid;

    // 2. Establecer Custom Claims básicos para Middleware
    // Combinamos con los claims existentes para no sobreescribirlos si era un usuario multi-tenant
    const currentClaims = userRecord.customClaims || {};
    const tenantRoles = currentClaims.tenantRoles || {};
    
    await adminAuth.setCustomUserClaims(uid, {
      ...currentClaims,
      tenantRoles: {
        ...tenantRoles,
        [tenantId]: role
      }
    });

    // 3. Crear/Actualizar Documento Maestro de Usuario (_gl_users/{uid})
    await adminFirestore.collection("_gl_users").doc(uid).set({
      uid,
      email,
      displayName,
      photoURL: userRecord.photoURL || null,
      active: true,
      lastLoginAt: null,
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
      role: "operative", 
      status: "pending_activation",
      tempPassword: generatedPassword,
      mustChangePassword: true,
      tenantId: tenantId
    }, { merge: true });

    // 4. Crear Membresía del Usuario en el Tenant (_gl_tenants/{tenantId}/members/{uid})
    await adminFirestore.doc(`_gl_tenants/${tenantId}/members/${uid}`).set({
      uid,
      userId: uid, // Agregado para soportar estructura manual del sistema
      role,
      modules, // Módulos a los que este usuario tiene acceso explícito
      status: "active",
      joinedAt: FieldValue.serverTimestamp()
    });

    // Enviar link de restablecimiento de contraseña (Opcional, pero recomendado en flujos corporativos)
    const resetLink = await adminAuth.generatePasswordResetLink(email);
    console.log(`[USER_CREATED] Email: ${email}, TempPass: ${generatedPassword}, Reset Link: ${resetLink}`);

    return { 
      success: true, 
      uid,
      message: `El usuario fue creado con la contraseña temporal: ${generatedPassword}`,
      tempPassword: generatedPassword,
      resetLink // Solo para depuración o si el Admin quiere enviarlo manual
    };
  } catch (error: any) {
    console.error("Error en createTenantUserAction:", error);
    return { success: false, error: error.message };
  }
}

interface UpdateUserParams {
  uid: string;
  tenantId: string;
  role?: string;
  modules?: string[];
  status?: "active" | "suspended";
}

export async function updateTenantUserAction({
  uid,
  tenantId,
  role,
  modules,
  status
}: UpdateUserParams) {
  try {
    const adminAuth = getAdminAuth();
    const adminFirestore = getAdminFirestore();

    if (!tenantId || !uid) throw new Error("Faltan identificadores (tenantId o uid)");

    const updateData: any = {
      updatedAt: FieldValue.serverTimestamp()
    };

    if (role !== undefined) updateData.role = role;
    if (modules !== undefined) updateData.modules = modules;
    if (status !== undefined) updateData.status = status;

    // Actualizar documento en Firestore
    await adminFirestore.doc(`_gl_tenants/${tenantId}/members/${uid}`).update(updateData);

    // Si se cambió el rol, actualizar Custom Claims
    if (role !== undefined) {
      const userRecord = await adminAuth.getUser(uid);
      const currentClaims = userRecord.customClaims || {};
      const tenantRoles = currentClaims.tenantRoles || {};
      
      await adminAuth.setCustomUserClaims(uid, {
        ...currentClaims,
        tenantRoles: {
          ...tenantRoles,
          [tenantId]: role
        }
      });
    }

    return { success: true, message: "Usuario actualizado exitosamente." };
  } catch (error: any) {
    console.error("Error en updateTenantUserAction:", error);
    return { success: false, error: error.message };
  }
}

