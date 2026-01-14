import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerGraficoProps {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
  acoes?: ReactNode;
  className?: string;
  altura?: string;
}

export function ContainerGrafico({
  titulo,
  subtitulo,
  children,
  acoes,
  className,
  altura = 'h-80',
}: ContainerGraficoProps) {
  return (
    <div className={cn('grafico-container animate-fade-in', className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="grafico-titulo mb-0">{titulo}</h3>
          {subtitulo && (
            <p className="text-xs text-muted-foreground">{subtitulo}</p>
          )}
        </div>
        {acoes && <div className="flex items-center gap-2">{acoes}</div>}
      </div>
      <div className={cn(altura, 'w-full')}>{children}</div>
    </div>
  );
}
