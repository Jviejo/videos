'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, BookOpen, ExternalLink, Plus, Edit, Trash2, FileText, Video, Image, Globe } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import VideoForm from '@/components/VideoForm';
import { deleteVideo } from '@/actions/videos';

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
  courseId: string;
  resources?: Resource[];
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
  order: number;
  videos: Video[];
}

export default function CourseDetail() {
  const { id } = useParams();
  const { isAuthenticated, isAdmin } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

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

  const handleVideoAdded = () => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };
    fetchCourse();
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setShowVideoForm(true);
  };

  const handleCloseVideoForm = () => {
    setShowVideoForm(false);
    setEditingVideo(null);
  };

  const handleDeleteVideo = async (video: Video) => {
    const confirmDelete = window.confirm(
      `⚠️ ADVERTENCIA: Esta acción no se puede deshacer.\n\n¿Estás seguro de que quieres eliminar el video "${video.title}"?`
    );
    
    if (!confirmDelete) return;

    try {
      const result = await deleteVideo(video._id);
      
      if (result.success) {
        // Refresh the course data to update video list
        handleVideoAdded();
        alert('✅ ' + result.message);
      } else {
        alert('❌ ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('❌ Error al eliminar el video');
    }
  };

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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Videos del Curso</h2>
            {isAdmin && (
              <Button 
                onClick={() => setShowVideoForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar Video
              </Button>
            )}
          </div>
          
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
                          
                          {/* Resources Section */}
                          {video.resources && video.resources.length > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-gray-700">Recursos:</span>
                                <Badge variant="outline" className="text-xs">
                                  {video.resources.length} recurso{video.resources.length !== 1 ? 's' : ''}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                {video.resources.slice(0, 3).map((resource, resourceIndex) => (
                                  <a
                                    key={resourceIndex}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                                  >
                                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-sm flex-shrink-0">
                                      {getResourceIcon(resource.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-xs">
                                          {getResourceTypeLabel(resource.type)}
                                        </Badge>
                                        <span className="text-xs text-gray-500 truncate">
                                          {resource.description}
                                        </span>
                                      </div>
                                    </div>
                                  </a>
                                ))}
                                {video.resources.length > 3 && (
                                  <div className="text-xs text-gray-500 text-center py-1">
                                    +{video.resources.length - 3} recurso{video.resources.length - 3 !== 1 ? 's' : ''} más
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link href={video.url}>
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4 mr-2" />
                            Reproducir
                          </Button>
                        </Link>
                        
                        {isAdmin && (
                          <>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditVideo(video)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            
                            <Button 
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteVideo(video)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </Button>
                          </>
                        )}
                        
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

        {/* Video Form Modal */}
        {showVideoForm && (
          <VideoForm
            onClose={handleCloseVideoForm}
            onSuccess={handleVideoAdded}
            courseId={id as string}
            video={editingVideo || undefined}
            mode={editingVideo ? 'edit' : 'add'}
          />
        )}
      </div>
    </div>
  );
} 