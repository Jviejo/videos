'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, ExternalLink, FileText, Video, Image, Globe } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Resource {
  _id?: string;
  type: 'video' | 'pdf' | 'html' | 'imagen';
  url: string;
  description: string;
}

interface Video {
  _id: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  order: number;
  courseId?: string;
  resources?: Resource[];
}

export default function VideoPlayer() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'imagen':
        return <Image className="h-4 w-4" />;
      case 'html':
        return <Globe className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'PDF';
      case 'video':
        return 'Video';
      case 'imagen':
        return 'Imagen';
      case 'html':
        return 'HTML';
      default:
        return type;
    }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/videos/${id}`);
        if (response.ok) {
          const data = await response.json();
          setVideo(data);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideo();
    }
  }, [id]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Requerido</h1>
          <p className="text-gray-600 mb-4">Debes iniciar sesión para ver este video</p>
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
          <p className="text-gray-600">Cargando video...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Video no encontrado</h1>
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
        <Link 
          href={video.courseId ? `/courses/${video.courseId}` : '/dashboard'} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {video.courseId ? 'Volver al Curso' : 'Volver al Dashboard'}
        </Link>

        {/* Video Player Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Video</Badge>
                  {/* <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {video.duration}
                  </div> */}
                </div>
              </div>
              <CardTitle className="text-2xl">{video.title}</CardTitle>
              <CardDescription className="text-base">
                {video.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Video Player */}
              <div className="mb-6">
                <div className="relative w-full h-0 pb-[56.25%] bg-gray-900 rounded-lg overflow-hidden">
                  <iframe
                    src={video.url}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  />
                </div>
              </div>

              {/* Video Actions */}
              <div className="flex flex-wrap gap-4">
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir en Nueva Pestaña
                </a>
                
                {video.courseId && (
                  <Link href={`/courses/${video.courseId}`}>
                    <Button variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Ver Más Videos del Curso
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Título:</span>
                  <p className="text-gray-900">{video.title}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Duración:</span>
                  <p className="text-gray-900">{video.duration}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Orden:</span>
                  <p className="text-gray-900">{video.order}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {video.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resources Section */}
        {video.resources && video.resources.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Recursos Adicionales</CardTitle>
                <CardDescription>
                  Material complementario para este video
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {video.resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getResourceTypeLabel(resource.type)}
                            </Badge>
                            <h4 className="font-medium text-gray-900">
                              {resource.description}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {resource.url}
                          </p>
                        </div>
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 