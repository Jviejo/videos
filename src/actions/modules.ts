'use server';

import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export interface Module {
  _id?: string;
  title: string;
  description: string;
  aiFeature: string;
  icon: string;
  iconColor: string;
  tags: string[];
  order: number;
}

export async function addModule(formData: FormData) {
  // TODO: Add server-side admin role validation when session management is implemented
  
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const collection = db.collection('modulos');

    const tags = formData.get('tags') as string;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const moduleData: Omit<Module, '_id'> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      aiFeature: formData.get('aiFeature') as string,
      icon: formData.get('icon') as string,
      iconColor: formData.get('iconColor') as string,
      tags: tagsArray,
      order: parseInt(formData.get('order') as string) || 1,
    };

    const result = await collection.insertOne(moduleData);
    
    return { 
      success: true, 
      message: 'Módulo agregado exitosamente',
      moduleId: result.insertedId.toString()
    };
  } catch (error) {
    console.error('Error adding module:', error);
    return { 
      success: false, 
      message: 'Error al agregar el módulo' 
    };
  }
}

export async function updateModule(moduleId: string, formData: FormData) {
  // TODO: Add server-side admin role validation when session management is implemented
  
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const collection = db.collection('modulos');

    const tags = formData.get('tags') as string;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const moduleData: Omit<Module, '_id'> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      aiFeature: formData.get('aiFeature') as string,
      icon: formData.get('icon') as string,
      iconColor: formData.get('iconColor') as string,
      tags: tagsArray,
      order: parseInt(formData.get('order') as string) || 1,
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(moduleId) },
      { $set: moduleData }
    );
    
    if (result.matchedCount === 0) {
      return { 
        success: false, 
        message: 'Módulo no encontrado' 
      };
    }
    
    return { 
      success: true, 
      message: 'Módulo actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error updating module:', error);
    return { 
      success: false, 
      message: 'Error al actualizar el módulo' 
    };
  }
}

export async function deleteModule(moduleId: string) {
  // TODO: Add server-side admin role validation when session management is implemented
  
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const collection = db.collection('modulos');

    const result = await collection.deleteOne({
      _id: new ObjectId(moduleId)
    });
    
    if (result.deletedCount === 0) {
      return { 
        success: false, 
        message: 'Módulo no encontrado' 
      };
    }
    
    return { 
      success: true, 
      message: 'Módulo eliminado exitosamente'
    };
  } catch (error) {
    console.error('Error deleting module:', error);
    return { 
      success: false, 
      message: 'Error al eliminar el módulo' 
    };
  }
}

export async function getNextModuleOrder(): Promise<number> {
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const collection = db.collection('modulos');

    const lastModule = await collection
      .findOne(
        {},
        { sort: { order: -1 } }
      );

    return lastModule ? lastModule.order + 1 : 1;
  } catch (error) {
    console.error('Error getting next module order:', error);
    return 1;
  }
}