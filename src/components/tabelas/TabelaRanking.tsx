import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabelaRankingProps<T> {
  titulo: string;
  dados: T[];
  colunas: {
    chave: keyof T;
    titulo: string;
    formatador?: (valor: unknown) => string;
    alinhamento?: 'left' | 'center' | 'right';
  }[];
  colunaVariacao?: keyof T;
  acaoLinha?: (item: T) => void;
}

export function TabelaRanking<T extends Record<string, unknown>>({
  titulo,
  dados,
  colunas,
  colunaVariacao,
  acaoLinha,
}: TabelaRankingProps<T>) {
  return (
    <div className="grafico-container">
      <h3 className="grafico-titulo">{titulo}</h3>
      <div className="overflow-x-auto">
        <table className="tabela-institucional">
          <thead>
            <tr>
              {colunas.map((coluna) => (
                <th
                  key={String(coluna.chave)}
                  className={cn(
                    coluna.alinhamento === 'right' && 'text-right',
                    coluna.alinhamento === 'center' && 'text-center'
                  )}
                >
                  {coluna.titulo}
                </th>
              ))}
              {colunaVariacao && <th className="text-right">Variação</th>}
              {acaoLinha && <th className="text-right w-10"></th>}
            </tr>
          </thead>
          <tbody>
            {dados.map((item, index) => (
              <tr
                key={index}
                className={cn(acaoLinha && 'cursor-pointer')}
                onClick={() => acaoLinha?.(item)}
              >
                {colunas.map((coluna) => {
                  const valor = item[coluna.chave];
                  const valorFormatado = coluna.formatador
                    ? coluna.formatador(valor)
                    : String(valor);
                  return (
                    <td
                      key={String(coluna.chave)}
                      className={cn(
                        coluna.alinhamento === 'right' && 'text-right',
                        coluna.alinhamento === 'center' && 'text-center'
                      )}
                    >
                      {valorFormatado}
                    </td>
                  );
                })}
                {colunaVariacao && (
                  <td className="text-right">
                    <IndicadorVariacao valor={Number(item[colunaVariacao])} />
                  </td>
                )}
                {acaoLinha && (
                  <td className="text-right">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IndicadorVariacao({ valor }: { valor: number }) {
  const isPositivo = valor > 0;
  const isNegativo = valor < 0;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium',
        isPositivo && 'text-success',
        isNegativo && 'text-destructive',
        !isPositivo && !isNegativo && 'text-muted-foreground'
      )}
    >
      {isPositivo && <TrendingUp className="h-3 w-3" />}
      {isNegativo && <TrendingDown className="h-3 w-3" />}
      {isPositivo ? '+' : ''}
      {valor.toFixed(1)}%
    </span>
  );
}
