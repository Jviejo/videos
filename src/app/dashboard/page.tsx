'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

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
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Requerido</h1>
          <p className="text-gray-600 mb-4">Debes iniciar sesión para acceder al dashboard</p>
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
          <p className="text-gray-600">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard de Cursos
          </h1>
          <p className="text-lg text-gray-600">
            Bienvenido, {user?.name}. Explora nuestros cursos disponibles
          </p>
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Cursos</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Play className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Cursos Disponibles</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Estudiantes Activos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {courses.reduce((sum, course) => sum + course.students, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course._id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {course.module}
                  </Badge>
                  <Badge variant={course.level === 'Principiante' ? 'default' : course.level === 'Intermedio' ? 'secondary' : 'destructive'}>
                    {course.level}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  {/* <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.students} estudiantes
                  </div> */}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {course.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Link href={`/courses/${course._id}`}>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Ver Curso
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 