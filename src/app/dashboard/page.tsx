'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import CourseForm from '@/components/CourseForm';
import { deleteCourse } from '@/actions/courses';

export interface Course {
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
}

interface GroupedCourses {
  [module: string]: Course[];
}

export default function Dashboard() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

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

  const handleCourseAdded = () => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  const handleCloseForm = () => {
    setShowCourseForm(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = async (course: Course) => {
    const confirmDelete = window.confirm(
      `⚠️ ADVERTENCIA: Esta acción no se puede deshacer.\n\n¿Estás seguro de que quieres eliminar el curso "${course.title}"?\n\nEsto también eliminará todos los videos asociados al curso.`
    );
    
    if (!confirmDelete) return;

    try {
      const result = await deleteCourse(course._id);
      
      if (result.success) {
        // Refresh the courses list
        handleCourseAdded();
        alert('✅ ' + result.message);
      } else {
        alert('❌ ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('❌ Error al eliminar el curso');
    }
  };

  // Group courses by module
  const groupedCourses: GroupedCourses = courses.reduce((acc, course) => {
    const moduleName = course.module || 'Sin Módulo';
    if (!acc[moduleName]) {
      acc[moduleName] = [];
    }
    acc[moduleName].push(course);
    return acc;
  }, {} as GroupedCourses);

  // Sort courses within each module by order
  Object.keys(groupedCourses).forEach(moduleName => {
    groupedCourses[moduleName].sort((a, b) => (a.order || 999) - (b.order || 999));
  });

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

  // Verificar que el usuario tenga rol 'user' o 'admin'
  const allowedRoles = ['user', 'admin'];
  if (user && !allowedRoles.includes(user.role || '')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder al dashboard. Solo usuarios con perfil 'user' o 'admin' pueden acceder.</p>
          <p className="text-sm text-gray-500 mb-4">Tu rol actual: {user.role || 'sin rol definido'}</p>
          <Button onClick={() => {
            logout();
            window.location.href = '/auth';
          }}>
            Cerrar Sesión
          </Button>
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
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Dashboard de Cursos
              </h1>
              <p className="text-lg text-gray-600">
                Bienvenido, {user?.name}. Explora nuestros cursos organizados por módulos
              </p>
            </div>
            {isAdmin && (
              <Button 
                onClick={() => setShowCourseForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar Curso
              </Button>
            )}
          </div>
        </div>

        {/* Courses grouped by modules */}
        <div className="space-y-8">
          {Object.entries(groupedCourses).map(([moduleName, moduleCourses]) => (
            <div key={moduleName} className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">{moduleName}</h2>
                <p className="text-gray-600">{moduleCourses.length} curso{moduleCourses.length !== 1 ? 's' : ''}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moduleCourses.map((course) => (
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
                      
                      <div className="flex gap-2">
                        <Link href={`/courses/${course._id}`} className="flex-1">
                          <Button className="w-full">
                            <Play className="h-4 w-4 mr-2" />
                            Ver Curso
                          </Button>
                        </Link>
                        {isAdmin && (
                          <>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEditCourse(course)}
                              className="shrink-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => handleDeleteCourse(course)}
                              className="shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Course Form Modal */}
        {showCourseForm && (
          <CourseForm
            onClose={handleCloseForm}
            onSuccess={handleCourseAdded}
            course={editingCourse || undefined}
            mode={editingCourse ? 'edit' : 'add'}
          />
        )}
      </div>
    </div>
  );
} 