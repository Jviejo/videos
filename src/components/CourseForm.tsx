'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { addCourse, updateCourse, getNextCourseOrder, Course } from '@/actions/courses';
import { X } from 'lucide-react';

interface Module {
  _id: string;
  title: string;
  description: string;
  aiFeature: string;
  icon: string;
  iconColor: string;
  tags: string[];
  order: number;
}

interface CourseFormProps {
  onClose: () => void;
  onSuccess: () => void;
  course?: Course;
  mode?: 'add' | 'edit';
}

export default function CourseForm({ onClose, onSuccess, course, mode = 'add' }: CourseFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [nextOrder, setNextOrder] = useState(1);
  const [modules, setModules] = useState<Module[]>([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  
  const isEditMode = mode === 'edit' && course;

  useEffect(() => {
    if (mode === 'add') {
      getNextCourseOrder().then(setNextOrder);
    }
  }, [mode]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('/api/modules');
        if (response.ok) {
          const data = await response.json();
          setModules(data);
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
      } finally {
        setModulesLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = isEditMode && course
      ? await updateCourse(course._id!, formData)
      : await addCourse(formData);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{isEditMode ? 'Editar Curso' : 'Agregar Nuevo Curso'}</CardTitle>
            <CardDescription>
              {isEditMode 
                ? 'Modifica la información del curso' 
                : 'Completa la información para crear un nuevo curso'
              }
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Título del curso"
                  defaultValue={isEditMode && course ? course.title : ''}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="module">Módulo *</Label>
                <Select name="module" defaultValue={isEditMode && course ? course.module : ''} required>
                  <SelectTrigger>
                    <SelectValue placeholder={modulesLoading ? "Cargando módulos..." : "Selecciona un módulo"} />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module._id} value={module.title}>
                        {module.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descripción del curso"
                                  defaultValue={isEditMode && course ? course.description : ''}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duración *</Label>
                <Input
                  id="duration"
                  name="duration"
                  placeholder="ej: 2 horas"
                  defaultValue={isEditMode && course ? course.duration : ''}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level">Nivel *</Label>
                <Select name="level" defaultValue={isEditMode && course ? course.level : ''} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Principiante">Principiante</SelectItem>
                    <SelectItem value="Intermedio">Intermedio</SelectItem>
                    <SelectItem value="Avanzado">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="students">Estudiantes</Label>
                <Input
                  id="students"
                  name="students"
                  type="number"
                  placeholder="0"
                  min="0"
                  defaultValue={isEditMode && course ? course.students.toString() : '0'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Orden * order {course?.order }</Label>
                <Input
                  id="order"
                  name="order"
                  type="text"
                  min="1"
                  placeholder="Posición del curso"
                  defaultValue={isEditMode && course && course.order ? course.order.toString() : nextOrder.toString()}
                  required
                />
                <p className="text-xs text-gray-500">
                  Define el orden de aparición del curso
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de Imagen</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                defaultValue={isEditMode && course ? course.imageUrl : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separados por comas)</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="javascript, react, frontend"
                defaultValue={isEditMode && course ? course.tags.join(', ') : ''}
              />
            </div>

            {message && (
              <div className={`p-3 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading 
                  ? (isEditMode ? 'Actualizando...' : 'Guardando...') 
                  : (isEditMode ? 'Actualizar Curso' : 'Guardar Curso')
                }
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}