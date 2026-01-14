import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { DadosGrafico } from '@/types';
import { formatarMoedaCompacta } from '@/lib/formatadores';

interface GraficoLinhaProps {
  dados: DadosGrafico[];
  linhas: {
    chave: string;
    nome: string;
    cor: string;
    tracejado?: boolean;
  }[];
  formatarValor?: (valor: number) => string;
}

export function GraficoLinha({ dados, linhas, formatarValor = formatarMoedaCompacta }: GraficoLinhaProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={dados} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          formatter={(value: number) => formatarValor(value)}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        {linhas.map((linha) => (
          <Line
            key={linha.chave}
            type="monotone"
            dataKey={linha.chave}
            name={linha.nome}
            stroke={linha.cor}
            strokeWidth={2}
            strokeDasharray={linha.tracejado ? '5 5' : undefined}
            dot={{ r: 3, fill: linha.cor }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
