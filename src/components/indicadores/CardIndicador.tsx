import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatarMoeda, formatarNumero, formatarPercentual } from '@/lib/formatadores';

interface CardIndicadorProps {
  titulo: string;
  valor: number | string;
  tipo?: 'moeda' | 'percentual' | 'numero' | 'texto';
  variacao?: number;
  icone?: ReactNode;
  destaque?: boolean;
  className?: string;
}

export function CardIndicador({
  titulo,
  valor,
  tipo = 'texto',
  variacao,
  icone,
  destaque = false,
  className,
}: CardIndicadorProps) {
  const formatarValor = () => {
    if (typeof valor === 'string') return valor;
    
    switch (tipo) {
      case 'moeda':
        return formatarMoeda(valor);
      case 'percentual':
        return formatarPercentual(valor);
      case 'numero':
        return formatarNumero(valor);
      default:
        return String(valor);
    }
  };

  const renderVariacao = () => {
    if (variacao === undefined) return null;

    const isPositivo = variacao > 0;
    const isNegativo = variacao < 0;

    return (
      <div
        className={cn(
          'flex items-center gap-1 text-xs font-medium',
          isPositivo && 'text-success',
          isNegativo && 'text-destructive',
          !isPositivo && !isNegativo && 'text-muted-foreground'
        )}
      >
        {isPositivo && <TrendingUp className="h-3 w-3" />}
        {isNegativo && <TrendingDown className="h-3 w-3" />}
        {!isPositivo && !isNegativo && <Minus className="h-3 w-3" />}
        <span>{isPositivo ? '+' : ''}{variacao.toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div
      className={cn(
        destaque ? 'indicador-card-destaque' : 'indicador-card',
        'animate-fade-in',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            {titulo}
          </p>
          <p className="text-2xl font-bold text-foreground leading-none">
            {formatarValor()}
          </p>
        </div>
        {icone && (
          <div className="flex-shrink-0 p-2 rounded-md bg-primary/10 text-primary">
            {icone}
          </div>
        )}
      </div>
      {variacao !== undefined && (
        <div className="mt-2 pt-2 border-t border-border">
          {renderVariacao()}
          <span className="text-xs text-muted-foreground ml-1">vs. período anterior</span>
        </div>
      )}
    </div>
  );
}
