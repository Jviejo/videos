'use server';

import { ObjectId } from 'mongodb';
import clientPromise from './db';
import { generateVerificationCode, sendVerificationCode, isCodeValid } from './email';

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  role?: string;
  createdAt?: Date;
  // Campos para verificación por email
  verificationCode?: string;
  verificationCodeTimestamp?: Date;
  isVerified?: boolean;
}


// Función para solicitar código de login (crea usuario si no existe)
export async function requestLoginCode(email: string) {
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const usersCollection = db.collection('users');

    // Generar código de verificación
    const verificationCode = await generateVerificationCode();
    const timestamp = new Date();

    // Buscar el usuario por email
    const existingUser = await usersCollection.findOne({ email });
    
    if (existingUser) {
      // Usuario existe - actualizar con nuevo código
      await usersCollection.updateOne(
        { email },
        { 
          $set: { 
            verificationCode,
            verificationCodeTimestamp: timestamp,
            isVerified: true // Aseguramos que esté verificado
          }
        }
      );
    } else {
      // Usuario no existe - crear nuevo usuario con email como nombre por defecto
      const newUser: User = {
        email,
        name: email.split('@')[0], // Usar parte antes del @ como nombre por defecto
        role: 'user',
        createdAt: timestamp,
        verificationCode,
        verificationCodeTimestamp: timestamp,
        isVerified: true
      };

      await usersCollection.insertOne(newUser);
    }

    // Enviar código por email
    const emailResult = await sendVerificationCode(email, verificationCode, 'login');
    
    if (emailResult.success) {
      return { 
        success: true, 
        message: 'Código de verificación enviado a tu email' 
      };
    } else {
      return { 
        success: false, 
        error: emailResult.message 
      };
    }
  } catch (error) {
    console.error('Error en requestLoginCode:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}

// Función para verificar código y completar login
export async function verifyLoginCode(email: string, code: string) {
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const usersCollection = db.collection('users');

    // Buscar el usuario
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Verificar el código
    if (!(await isCodeValid(user.verificationCode, user.verificationCodeTimestamp, code))) {
      return { success: false, error: 'Código inválido o expirado' };
    }

    // Limpiar código después del login exitoso
    await usersCollection.updateOne(
      { email },
      { 
        $unset: { verificationCode: '', verificationCodeTimestamp: '' }
      }
    );

    return {
      success: true,
      user: {
        id: user._id?.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Error en verifyLoginCode:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}

export async function getUserById(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return null;
    }

    return {
      id: user._id?.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    };
  } catch (error) {
    console.error('Error en getUserById:', error);
    return null;
  }
}

export async function validateAdminRole(userId: string): Promise<boolean> {
  try {
    const user = await getUserById(userId);
    return user?.role === 'admin';
  } catch (error) {
    console.error('Error validating admin role:', error);
    return false;
  }
} 