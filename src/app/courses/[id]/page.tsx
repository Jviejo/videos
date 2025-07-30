'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Video {
  _id: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  order: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  module: string;
  duration: string;
  level: string;
  students: number;
  imageUrl: string;
  tags: string[];
  videos: Video[];
}

export default function CourseDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Requerido</h1>
          <p className="text-gray-600 mb-4">Debes iniciar sesión para ver este curso</p>
          <Link href="/auth">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h1>
          <Link href="/dashboard">
            <Button>Volver al Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Dashboard
        </Link>

        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary">{course.module}</Badge>
            <Badge variant={course.level === 'Principiante' ? 'default' : course.level === 'Intermedio' ? 'secondary' : 'destructive'}>
              {course.level}
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
          <p className="text-lg text-gray-600 mb-6 max-w-4xl">{course.description}</p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            {/* <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {course.duration}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {course.students} estudiantes
            </div> */}
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              {course.videos?.length || 0} videos
            </div>
          </div>
        </div>

        {/* Course Tags */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {course.tags?.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Videos Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Videos del Curso</h2>
          
          {course.videos && course.videos.length > 0 ? (
            <div className="grid gap-4">
              {course.videos
                .sort((a, b) => a.order - b.order)
                .map((video, index) => (
                <Card key={video._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                          <span className="text-blue-600 font-bold">{index + 1}</span>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {video.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {video.description}
                          </p>
                          {/* <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {video.duration}
                          </div> */}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link href={video.url}>
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4 mr-2" />
                            Reproducir
                          </Button>
                        </Link>
                        
                        <a 
                          href={video.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay videos disponibles
                </h3>
                <p className="text-gray-600">
                  Los videos de este curso estarán disponibles pronto.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 