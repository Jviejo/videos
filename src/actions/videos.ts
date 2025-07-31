'use server';

import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export interface Video {
  _id?: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  order: number;
  courseId: string;
}

export async function addVideo(courseId: string, formData: FormData) {
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const videosCollection = db.collection('videos');
    const coursesCollection = db.collection('cursos');

    const video: Omit<Video, '_id'> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      url: formData.get('url') as string,
      duration: formData.get('duration') as string,
      order: parseInt(formData.get('order') as string) || 1,
      courseId: courseId,
    };

    const result = await videosCollection.insertOne(video);
    
    // Update course to include the new video reference
    await coursesCollection.updateOne(
      { _id: new ObjectId(courseId) },
      { $push: { videoIds: result.insertedId } }
    );
    
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
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const collection = db.collection('videos');

    const video: Omit<Video, '_id' | 'courseId'> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      url: formData.get('url') as string,
      duration: formData.get('duration') as string,
      order: parseInt(formData.get('order') as string) || 1,
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