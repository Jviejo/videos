'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Mail, Shield } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const { requestLogin, verifyLogin, loading } = useAuth();
  const router = useRouter();

  // Debug: Monitorear cambios en el AuthContext
  useEffect(() => {
    console.log('AuthContext loading changed:', loading);
  }, [loading]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await requestLogin(email);
      console.log('Login result:', result); // Debug log
      if (result.success) {
        console.log('Setting step to code and message'); // Debug log
        setMessage(result.message || 'Código enviado a tu email');
        setStep('code');
        console.log('Step should now be code'); // Debug log
      } else {
        setError(result.error || 'Error al enviar el código');
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await verifyLogin(email, code);
      console.log('Verify login result:', result);
      if (result.success) {
        console.log('Login successful, redirecting to dashboard...');
        // Pequeño delay para asegurar que el estado se actualice
       
        router.push('/dashboard');
       
        // setTimeout(() => {
        //   console.log('Executing redirect now...');
        //   router.push('/dashboard');
        // }, 500);
      } else {
        setError(result.error || 'Código inválido');
      }
    } catch (error) {
      console.error('Error in handleCodeSubmit:', error);
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setCode('');
    setMessage('');
    setError('');
  };

  // Debug: Mostrar el estado actual
  console.log('LoginForm render - step:', step, 'email:', email, 'isLoading:', isLoading);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">
          {step === 'email' ? 'Acceder' : 'Verificar código'}
        </h2>
        <p className="text-gray-600 mt-2">
          {step === 'email' 
            ? 'Te enviaremos un código de verificación a tu email'
            : 'Ingresa el código que enviamos a tu email'
          }
        </p>
      </div>

      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando código...' : 'Acceder'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Código de verificación
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={6}
              required
              disabled={isLoading}
            />
            <p className="text-sm text-gray-600 mt-1">
              Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
            </p>
          </div>

          {message && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              {message}
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Verificar código'}
            </button>
            
            <button 
              type="button" 
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 disabled:opacity-50"
              onClick={handleBackToEmail}
              disabled={isLoading}
            >
              Cambiar email
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 