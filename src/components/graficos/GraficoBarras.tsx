import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { DadosGrafico } from '@/types';
import { formatarMoedaCompacta } from '@/lib/formatadores';

interface GraficoBarrasProps {
  dados: DadosGrafico[];
  barras: {
    chave: string;
    nome: string;
    cor: string;
    empilhado?: string;
  }[];
  formatarValor?: (valor: number) => string;
  layout?: 'horizontal' | 'vertical';
}

export function GraficoBarras({
  dados,
  barras,
  formatarValor = formatarMoedaCompacta,
  layout = 'horizontal',
}: GraficoBarrasProps) {
  const isVertical = layout === 'vertical';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={dados}
        layout={layout}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        {isVertical ? (
          <>
            <XAxis
              type="number"
              tickFormatter={formatarValor}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              type="category"
              dataKey="nome"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              width={100}
            />
          </>
        ) : (
          <>
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
          </>
        )}
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
        {barras.map((barra) => (
          <Bar
            key={barra.chave}
            dataKey={barra.chave}
            name={barra.nome}
            fill={barra.cor}
            stackId={barra.empilhado}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
