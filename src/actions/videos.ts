'use server';

import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export interface Resource {
  _id?: string;
  type: 'video' | 'pdf' | 'html' | 'imagen';
  url: string;
  description: string;
}

export interface Video {
  _id?: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  order: number;
  courseId: string;
  resources?: Resource[];
}

export async function addVideo(courseId: string, formData: FormData) {
  // TODO: Add server-side admin role validation when session management is implemented
  
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const videosCollection = db.collection('videos');

    // Parse resources from form data
    const resources: Resource[] = [];
    const resourceTypes = formData.getAll('resourceType') as string[];
    const resourceUrls = formData.getAll('resourceUrl') as string[];
    const resourceDescriptions = formData.getAll('resourceDescription') as string[];

    for (let i = 0; i < resourceTypes.length; i++) {
      if (resourceTypes[i] && resourceUrls[i] && resourceDescriptions[i]) {
        resources.push({
          type: resourceTypes[i] as 'video' | 'pdf' | 'html' | 'imagen',
          url: resourceUrls[i],
          description: resourceDescriptions[i],
        });
      }
    }

    const video: Omit<Video, '_id'> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      url: formData.get('url') as string,
      duration: formData.get('duration') as string,
      order: parseInt(formData.get('order') as string) || 1,
      courseId: courseId,
      resources: resources,
    };

    const result = await videosCollection.insertOne(video);
    
    return { 
      success: true, 
      message: 'Video agregado exitosamente',
      videoId: result.insertedId.toString()
    };
  } catch (error) {
    console.error('Error adding video:', error);
    return { 
      success: false, 
      message: 'Error al agregar el video' 
    };
  }
}

export async function updateVideo(videoId: string, formData: FormData) {
  // TODO: Add server-side admin role validation when session management is implemented
  
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const collection = db.collection('videos');

    // Parse resources from form data
    const resources: Resource[] = [];
    const resourceTypes = formData.getAll('resourceType') as string[];
    const resourceUrls = formData.getAll('resourceUrl') as string[];
    const resourceDescriptions = formData.getAll('resourceDescription') as string[];

    for (let i = 0; i < resourceTypes.length; i++) {
      if (resourceTypes[i] && resourceUrls[i] && resourceDescriptions[i]) {
        resources.push({
          type: resourceTypes[i] as 'video' | 'pdf' | 'html' | 'imagen',
          url: resourceUrls[i],
          description: resourceDescriptions[i],
        });
      }
    }

    const video: Omit<Video, '_id' | 'courseId'> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      url: formData.get('url') as string,
      duration: formData.get('duration') as string,
      order: parseInt(formData.get('order') as string) || 1,
      resources: resources,
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(videoId) },
      { $set: video }
    );
    
    if (result.matchedCount === 0) {
      return { 
        success: false, 
        message: 'Video no encontrado' 
      };
    }
    
    return { 
      success: true, 
      message: 'Video actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error updating video:', error);
    return { 
      success: false, 
      message: 'Error al actualizar el video' 
    };
  }
}

export async function getNextVideoOrder(courseId: string): Promise<number> {
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const collection = db.collection('videos');

    const lastVideo = await collection
      .findOne(
        { courseId: courseId },
        { sort: { order: -1 } }
      );

    return lastVideo ? lastVideo.order + 1 : 1;
  } catch (error) {
    console.error('Error getting next video order:', error);
    return 1;
  }
}

export async function deleteVideo(videoId: string) {
  // TODO: Add server-side admin role validation when session management is implemented
  
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const collection = db.collection('videos');

    const result = await collection.deleteOne({
      _id: new ObjectId(videoId)
    });
    
    if (result.deletedCount === 0) {
      return { 
        success: false, 
        message: 'Video no encontrado' 
      };
    }
    
    return { 
      success: true, 
      message: 'Video eliminado exitosamente'
    };
  } catch (error) {
    console.error('Error deleting video:', error);
    return { 
      success: false, 
      message: 'Error al eliminar el video' 
    };
  }
}