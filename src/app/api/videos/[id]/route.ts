import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const { id } = await params;

    // Buscar el video en la colección de videos
    const video = await db.collection('videos').findOne({
      _id: new ObjectId(id)
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 