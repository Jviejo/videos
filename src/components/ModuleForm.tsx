'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { addModule, updateModule, getNextModuleOrder, Module } from '@/actions/modules';
import { X } from 'lucide-react';

interface ModuleFormProps {
  onClose: () => void;
  onSuccess: () => void;
  module?: Module;
  mode?: 'add' | 'edit';
}

const iconOptions = [
  { value: 'Code', label: 'Code' },
  { value: 'Database', label: 'Database' },
  { value: 'Ship', label: 'Ship (Docker)' },
  { value: 'Box', label: 'Box (Kubernetes)' },
  { value: 'LinkIcon', label: 'Link (Blockchain)' },
  { value: 'BookOpen', label: 'Book (Learning)' },
];

const iconColorOptions = [
  { value: 'bg-black', label: 'Negro' },
  { value: 'bg-blue-600', label: 'Azul Oscuro' },
  { value: 'bg-blue-500', label: 'Azul' },
  { value: 'bg-purple-600', label: 'Morado' },
  { value: 'bg-orange-500', label: 'Naranja' },
  { value: 'bg-green-600', label: 'Verde' },
  { value: 'bg-red-600', label: 'Rojo' },
  { value: 'bg-yellow-600', label: 'Amarillo' },
];

export default function ModuleForm({ onClose, onSuccess, module, mode = 'add' }: ModuleFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [nextOrder, setNextOrder] = useState(1);
  
  const isEditMode = mode === 'edit' && module;

  useEffect(() => {
    if (mode === 'add') {
      getNextModuleOrder().then(setNextOrder);
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = isEditMode 
      ? await updateModule(module._id!, formData)
      : await addModule(formData);

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
            <CardTitle>{isEditMode ? 'Editar Módulo' : 'Agregar Nuevo Módulo'}</CardTitle>
            <CardDescription>
              {isEditMode 
                ? 'Modifica la información del módulo de formación' 
                : 'Completa la información para crear un nuevo módulo de formación'
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
                  placeholder="Next.js, Docker, etc."
                  defaultValue={isEditMode ? module.title : ''}
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
                  placeholder="Posición en la página"
                  defaultValue={isEditMode ? module.order.toString() : nextOrder.toString()}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descripción detallada del módulo"
                defaultValue={isEditMode ? module.description : ''}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aiFeature">Característica IA *</Label>
              <Input
                id="aiFeature"
                name="aiFeature"
                placeholder="🤖 IA para..."
                defaultValue={isEditMode ? module.aiFeature : ''}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icono *</Label>
                <Select name="icon" defaultValue={isEditMode ? module.icon : ''} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un icono" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="iconColor">Color del Icono *</Label>
                <Select name="iconColor" defaultValue={isEditMode ? module.iconColor : ''} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un color" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconColorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${option.value}`}></div>
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separados por comas) *</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="React, TypeScript, Docker"
                defaultValue={isEditMode ? module.tags.join(', ') : ''}
                required
              />
              <p className="text-xs text-gray-500">
                Separa cada tag con una coma. Ejemplo: React, SSR, TypeScript
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
                  : (isEditMode ? 'Actualizar Módulo' : 'Guardar Módulo')
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