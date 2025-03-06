'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

type PhantomLoginButtonProps = {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
};

export function PhantomLoginButton({
  className,
  variant = 'default',
}: PhantomLoginButtonProps) {
  const { signInWithPhantom, loading } = useAuth();
  const [isConnecting, setIsConnecting] = React.useState(false);

  const handleConnect = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      // Verificar si Phantom está instalado
      const isPhantomInstalled = window.phantom?.solana?.isPhantom || false;
      
      if (!isPhantomInstalled) {
        // Abrir sitio web de Phantom para instalación
        window.open('https://phantom.app/', '_blank');
        return;
      }
      
      await signInWithPhantom();
    } catch (error) {
      console.error('Error en la conexión con Phantom:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={loading || isConnecting}
      className={className}
      variant={variant}
      type="button"
    >
      {(loading || isConnecting) ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Conectando...
        </>
      ) : (
        <>
          <img 
            src="/icons/phantom-icon.svg" 
            alt="Phantom" 
            className="mr-2 h-4 w-4" 
          />
          Conectar con Phantom
        </>
      )}
    </Button>
  );
} 