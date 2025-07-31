'use server';

import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export interface Course {
  _id?: string;
  title: string;
  description: string;
  module: string;
  duration: string;
  level: string;
  students: number;
  imageUrl: string;
  tags: string[];
  order: number;
}

export async function addCourse(formData: FormData) {
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const collection = db.collection('cursos');

    const tags = formData.get('tags') as string;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const course: Omit<Course, '_id'> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      module: formData.get('module') as string,
      duration: formData.get('duration') as string,
      level: formData.get('level') as string,
      students: parseInt(formData.get('students') as string) || 0,
      imageUrl: formData.get('imageUrl') as string,
      tags: tagsArray,
      order: parseInt(formData.get('order') as string) || 1,
    };

    const result = await collection.insertOne(course);
    
    return { 
      success: true, 
      message: 'Curso agregado exitosamente',
      courseId: result.insertedId.toString()
    };
  } catch (error) {
    console.error('Error adding course:', error);
    return { 
      success: false, 
      message: 'Error al agregar el curso' 
    };
  }
}

export async function updateCourse(courseId: string, formData: FormData) {
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const collection = db.collection('cursos');

    const tags = formData.get('tags') as string;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const course: Omit<Course, '_id'> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      module: formData.get('module') as string,
      duration: formData.get('duration') as string,
      level: formData.get('level') as string,
      students: parseInt(formData.get('students') as string) || 0,
      imageUrl: formData.get('imageUrl') as string,
      tags: tagsArray,
      order: parseInt(formData.get('order') as string) || 1,
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(courseId) },
      { $set: course }
    );
    
    if (result.matchedCount === 0) {
      return { 
        success: false, 
        message: 'Curso no encontrado' 
      };
    }
    
    return { 
      success: true, 
      message: 'Curso actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error updating course:', error);
    return { 
      success: false, 
      message: 'Error al actualizar el curso' 
    };
  }
}

export async function deleteCourse(courseId: string) {
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    
    // First, delete all videos associated with this course
    await db.collection('videos').deleteMany({ courseId: courseId });
    
    // Then delete the course itself
    const result = await db.collection('cursos').deleteOne({
      _id: new ObjectId(courseId)
    });
    
    if (result.deletedCount === 0) {
      return { 
        success: false, 
        message: 'Curso no encontrado' 
      };
    }
    
    return { 
      success: true, 
      message: 'Curso eliminado exitosamente'
    };
  } catch (error) {
    console.error('Error deleting course:', error);
    return { 
      success: false, 
      message: 'Error al eliminar el curso' 
    };
  }
}

export async function getNextCourseOrder(): Promise<number> {
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const collection = db.collection('cursos');

    const lastCourse = await collection
      .findOne(
        {},
        { sort: { order: -1 } }
      );

    return lastCourse ? lastCourse.order + 1 : 1;
  } catch (error) {
    console.error('Error getting next course order:', error);
    return 1;
  }
}