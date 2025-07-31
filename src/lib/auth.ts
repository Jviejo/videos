'use server';

import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import clientPromise from './db';

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  password: string;
  role?: string;
  createdAt?: Date;
}

export async function registerUser(email: string, password: string, name: string) {
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const usersCollection = db.collection('users');

    // Verificar si el usuario ya existe
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return { success: false, error: 'El usuario ya existe' };
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el nuevo usuario
    const newUser: User = {
      email,
      name,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);

    if (result.acknowledged) {
      return { 
        success: true, 
        user: {
          id: result.insertedId.toString(),
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        }
      };
    } else {
      return { success: false, error: 'Error al crear el usuario' };
    }
  } catch (error) {
    console.error('Error en registerUser:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const usersCollection = db.collection('users');

    // Buscar el usuario por email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Credenciales inválidas' };
    }

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
    console.error('Error en loginUser:', error);
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