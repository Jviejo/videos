'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, BookOpen, Code, Database, Ship, Box, Link as LinkIcon } from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Next.js */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mr-4">
                <Code className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Next.js</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Aprende a construir aplicaciones web modernas y escalables con React y Next.js. 
              Domina el renderizado del lado del servidor, rutas dinámicas y optimización de rendimiento.
              <span className="block mt-2 text-sm text-purple-600 font-medium">🤖 IA asistente para debugging y optimización de código</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">SSR</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">TypeScript</span>
            </div>
          </div>

          {/* SQL */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <Database className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">SQL & Bases de Datos</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Gestiona y optimiza bases de datos relacionales. Aprende consultas complejas, 
              índices, transacciones y diseño de esquemas eficientes.
              <span className="block mt-2 text-sm text-purple-600 font-medium">🤖 IA para generación y optimización de consultas SQL</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">MySQL</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">PostgreSQL</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Optimización</span>
            </div>
          </div>

          {/* Docker */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <Ship className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Docker</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Containeriza tus aplicaciones y simplifica el despliegue. Aprende Dockerfiles, 
              Docker Compose y mejores prácticas de containerización.
              <span className="block mt-2 text-sm text-purple-600 font-medium">🤖 IA para generación automática de Dockerfiles y troubleshooting</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Containers</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Docker Compose</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">CI/CD</span>
            </div>
          </div>

          {/* Kubernetes */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <Box className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Kubernetes</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Orquesta y escala aplicaciones en contenedores. Domina pods, servicios, 
              deployments y gestión de clusters en producción.
              <span className="block mt-2 text-sm text-purple-600 font-medium">🤖 IA para análisis de logs y diagnóstico automático de problemas</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Pods</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Services</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Helm</span>
            </div>
          </div>

          {/* Blockchain */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                <LinkIcon className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Blockchain</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Explora el futuro de la tecnología descentralizada. Aprende smart contracts, 
              DeFi, NFTs y desarrollo de aplicaciones blockchain.
              <span className="block mt-2 text-sm text-purple-600 font-medium">🤖 IA para auditoría de smart contracts y detección de vulnerabilidades</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Smart Contracts</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">DeFi</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Web3</span>
            </div>
          </div>

          {/* DevOps */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <BookOpen className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">DevOps</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Integra desarrollo y operaciones. Automatiza despliegues, monitoreo 
              y gestión de infraestructura como código.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">CI/CD</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Terraform</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Monitoring</span>
            </div>
          </div>
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
      </div>
    </div>
  );
}
