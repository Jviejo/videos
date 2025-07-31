'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { addVideo, updateVideo, getNextVideoOrder, Video } from '@/actions/videos';
import { X } from 'lucide-react';

interface VideoFormProps {
  onClose: () => void;
  onSuccess: () => void;
  courseId: string;
  video?: Video;
  mode?: 'add' | 'edit';
}

export default function VideoForm({ onClose, onSuccess, courseId, video, mode = 'add' }: VideoFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [nextOrder, setNextOrder] = useState(1);
  
  const isEditMode = mode === 'edit' && video;

  useEffect(() => {
    if (mode === 'add') {
      getNextVideoOrder(courseId).then(setNextOrder);
    }
  }, [courseId, mode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = isEditMode 
      ? await updateVideo(video._id!, formData)
      : await addVideo(courseId, formData);

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
            <CardTitle>{isEditMode ? 'Editar Video' : 'Agregar Nuevo Video'}</CardTitle>
            <CardDescription>
              {isEditMode 
                ? 'Modifica la información del video' 
                : 'Completa la información para agregar un nuevo video al curso'
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
                <Label htmlFor="title">Título del Video *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Título del video"
                  defaultValue={isEditMode ? video.title : ''}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duración *</Label>
                <Input
                  id="duration"
                  name="duration"
                  placeholder="ej: 15:30"
                  defaultValue={isEditMode ? video.duration : ''}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descripción del video"
                defaultValue={isEditMode ? video.description : ''}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL del Video *</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                defaultValue={isEditMode ? video.url : ''}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Orden *</Label>
              <Input
                id="order"
                name="order"
                type="number"
                min="1"
                placeholder="Posición del video en el curso"
                defaultValue={isEditMode ? video.order.toString() : nextOrder.toString()}
                required
              />
              <p className="text-xs text-gray-500">
                Define el orden de aparición del video en el curso
              </p>
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
                  : (isEditMode ? 'Actualizar Video' : 'Guardar Video')
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