import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { formatarPercentual, formatarMoeda } from '@/lib/formatadores';

interface DadosPizza {
  nome: string;
  valor: number;
  cor: string;
}

interface GraficoPizzaProps {
  dados: DadosPizza[];
  tipoValor?: 'percentual' | 'moeda' | 'numero';
  mostrarLegenda?: boolean;
  raioInterno?: number;
}

export function GraficoPizza({
  dados,
  tipoValor = 'percentual',
  mostrarLegenda = true,
  raioInterno = 0,
}: GraficoPizzaProps) {
  const formatarValor = (valor: number) => {
    switch (tipoValor) {
      case 'percentual':
        return formatarPercentual(valor);
      case 'moeda':
        return formatarMoeda(valor);
      default:
        return String(valor);
    }
  };

  const renderLabel = ({ nome, valor }: DadosPizza) => {
    return `${nome}: ${formatarValor(valor)}`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={dados}
          dataKey="valor"
          nameKey="nome"
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={raioInterno}
          paddingAngle={2}
          label={({ nome, percent }) => `${nome} (${(percent * 100).toFixed(0)}%)`}
          labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
        >
          {dados.map((entrada, index) => (
            <Cell key={`cell-${index}`} fill={entrada.cor} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatarValor(value)}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        />
        {mostrarLegenda && (
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value) => <span className="text-foreground">{value}</span>}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}
