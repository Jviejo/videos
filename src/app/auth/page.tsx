'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Ya se redirige en el useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isLogin 
              ? 'Inicia sesión en tu cuenta' 
              : 'Completa el formulario para crear tu cuenta'
            }
          </p>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Crea una cuenta para acceder a todas las funcionalidades'
                : 'Inicia sesión con tu cuenta existente'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              variant="outline"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full"
            >
              {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 