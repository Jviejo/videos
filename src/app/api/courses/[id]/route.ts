import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const client = await clientPromise;
    const db = client.db('formacion');
    const { id } = await params;

    const course = await db.collection('cursos').findOne({
      _id: new ObjectId(id)
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    // Fetch videos for this course
    const videos = await db.collection('videos')
      .find({ courseId: id })
      .sort({ order: 1 })
      .toArray();

    // Add videos to course object
    const courseWithVideos = {
      ...course,
      videos: videos
    };

    return NextResponse.json(courseWithVideos);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 