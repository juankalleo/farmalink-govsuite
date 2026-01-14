import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { DadosGrafico } from '@/types';
import { formatarPercentual } from '@/lib/formatadores';

interface GraficoAreaProps {
  dados: DadosGrafico[];
  chave: string;
  nome: string;
  cor: string;
  formatarValor?: (valor: number) => string;
}

export function GraficoArea({
  dados,
  chave,
  nome,
  cor,
  formatarValor = (v) => formatarPercentual(v, 0),
}: GraficoAreaProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={dados} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id={`gradient-${chave}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={cor} stopOpacity={0.3} />
            <stop offset="95%" stopColor={cor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="nome"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis
          tickFormatter={formatarValor}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
        />
        <Tooltip
          formatter={(value: number) => [formatarValor(value), nome]}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        />
        <Area
          type="monotone"
          dataKey={chave}
          name={nome}
          stroke={cor}
          strokeWidth={2}
          fill={`url(#gradient-${chave})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
