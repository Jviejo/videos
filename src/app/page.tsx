'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, BookOpen, Code, Database, Ship, Box, Link as LinkIcon, Plus, Edit, Trash2 } from 'lucide-react';
import ModuleForm from '@/components/ModuleForm';
import { deleteModule } from '@/actions/modules';

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

// Icon mapping
const iconMap = {
  Code,
  Database,
  Ship,
  Box,
  LinkIcon,
  BookOpen,
};

export default function Home() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

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
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleModuleAdded = () => {
    const fetchModules = async () => {
      try {
        const response = await fetch('/api/modules');
        if (response.ok) {
          const data = await response.json();
          setModules(data);
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };
    fetchModules();
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setShowModuleForm(true);
  };

  const handleCloseModuleForm = () => {
    setShowModuleForm(false);
    setEditingModule(null);
  };

  const handleDeleteModule = async (module: Module) => {
    const confirmDelete = window.confirm(
      `⚠️ ADVERTENCIA: Esta acción no se puede deshacer.\n\n¿Estás seguro de que quieres eliminar el módulo "${module.title}"?`
    );
    
    if (!confirmDelete) return;

    try {
      const result = await deleteModule(module._id);
      
      if (result.success) {
        // Refresh the modules list
        handleModuleAdded();
        alert('✅ ' + result.message);
      } else {
        alert('❌ ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      alert('❌ Error al eliminar el módulo');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Formación en Tecnologías Modernas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Domina las tecnologías más demandadas del mercado con nuestro programa integral de formación
          </p>
          
          {isAuthenticated && user && (
            <Card className="max-w-md mx-auto mt-8">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <User className="h-5 w-5" />
                  Bienvenido, {user.name}
                </CardTitle>
                <CardDescription>
                  Email: {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Tu cuenta está activa y lista para comenzar tu formación
                </p>
                <div className="flex gap-2 justify-center">
                  <Link href="/dashboard">
                    <Button>
                      Ir al Dashboard
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button variant="outline" size="sm">
                      Gestionar Cuenta
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white">
            <h2 className="text-2xl font-bold mb-3">🚀 Metodología Innovadora con IA</h2>
            <p className="text-lg opacity-90">
              Utilizamos inteligencia artificial avanzada para resolver problemas de código en tiempo real, 
              acelerando tu aprendizaje y desarrollo profesional
            </p>
          </div>
        </div>

        {/* Technologies Grid */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-900">Módulos de Formación</h2>
            {isAdmin && (
              <Button 
                onClick={() => setShowModuleForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar Módulo
              </Button>
            )}
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-18"></div>
                </div>
              </div>
            ))
          ) : (
            modules.map((module) => {
              const IconComponent = iconMap[module.icon as keyof typeof iconMap] || Code;
              const tagColorClasses = {
                'Next.js': 'bg-blue-100 text-blue-800',
                'SQL & Bases de Datos': 'bg-green-100 text-green-800',
                'Docker': 'bg-blue-100 text-blue-800',
                'Kubernetes': 'bg-blue-100 text-blue-800',
                'Blockchain': 'bg-orange-100 text-orange-800',
                'DevOps': 'bg-purple-100 text-purple-800'
              };
              const defaultTagColor = 'bg-gray-100 text-gray-800';
              const tagColor = tagColorClasses[module.title as keyof typeof tagColorClasses] || defaultTagColor;

              return (
                <div key={module._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow relative">
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditModule(module)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteModule(module)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${module.iconColor} rounded-lg flex items-center justify-center mr-4`}>
                      <IconComponent className="text-white h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 pr-20">{module.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {module.description}
                    <span className="block mt-2 text-sm text-purple-600 font-medium">{module.aiFeature}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {module.tags.map((tag, index) => (
                      <span key={index} className={`px-3 py-1 ${tagColor} rounded-full text-sm`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* AI-Powered Learning Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🤖 Aprendizaje Potenciado por IA
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nuestra plataforma utiliza inteligencia artificial avanzada para revolucionar tu experiencia de aprendizaje
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Debugging Inteligente</h3>
              <p className="text-gray-600 text-sm">
                La IA analiza tu código en tiempo real, identificando errores y sugiriendo soluciones optimizadas
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generación de Código</h3>
              <p className="text-gray-600 text-sm">
                Automatiza tareas repetitivas con IA que genera código limpio y bien documentado
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aprendizaje Personalizado</h3>
              <p className="text-gray-600 text-sm">
                Contenido adaptado a tu nivel y estilo de aprendizaje con recomendaciones inteligentes
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl mb-3">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimización Automática</h3>
              <p className="text-gray-600 text-sm">
                Mejora el rendimiento de tu código con sugerencias de optimización basadas en IA
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl mb-3">🛡️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Seguridad Avanzada</h3>
              <p className="text-gray-600 text-sm">
                Detección automática de vulnerabilidades y mejores prácticas de seguridad
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Análisis de Progreso</h3>
              <p className="text-gray-600 text-sm">
                Seguimiento inteligente de tu evolución con métricas detalladas y recomendaciones
              </p>
            </div>
          </div>
        </div>

        {/* Module Form Modal */}
        {showModuleForm && (
          <ModuleForm
            onClose={handleCloseModuleForm}
            onSuccess={handleModuleAdded}
            module={editingModule || undefined}
            mode={editingModule ? 'edit' : 'add'}
          />
        )}
      </div>
    </div>
  );
}
