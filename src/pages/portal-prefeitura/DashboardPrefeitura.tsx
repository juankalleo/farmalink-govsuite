import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { CardIndicador } from '@/components/indicadores/CardIndicador';
import { ContainerGrafico } from '@/components/graficos/ContainerGrafico';
import { GraficoLinha } from '@/components/graficos/GraficoLinha';
import { GraficoBarras } from '@/components/graficos/GraficoBarras';
import { TabelaRanking } from '@/components/tabelas/TabelaRanking';
import {
  dadosOrcamentoMensal,
  dadosPorCentroCusto,
  rankingMedicamentos,
  precoVsEntrega,
} from '@/lib/mock-dados';
import { formatarMoeda, formatarMoedaCompacta, formatarNumero } from '@/lib/formatadores';
import {
  Wallet,
  TrendingUp,
  FileText,
  Clock,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
} from 'recharts';

export function DashboardPrefeitura() {
  const usuario = {
    nome: 'Maria Silva',
    email: 'maria.silva@prefeitura.gov.br',
  };

  return (
    <SidebarLayout portal="prefeitura" usuario={usuario}>
      <DashboardHeader
        titulo="Dashboard Executivo"
        subtitulo="Visão consolidada do orçamento e execução farmacêutica"
      />

      <div className="p-6 space-y-6">
        {/* Indicadores Principais */}
        <div className="indicadores-grid">
          <CardIndicador
            titulo="Orçamento Anual"
            valor={18500000}
            tipo="moeda"
            icone={<Wallet className="h-5 w-5" />}
            destaque
          />
          <CardIndicador
            titulo="Orçamento Executado"
            valor={14580000}
            tipo="moeda"
            variacao={12.5}
            icone={<DollarSign className="h-5 w-5" />}
          />
          <CardIndicador
            titulo="Economia em Licitações"
            valor={1740000}
            tipo="moeda"
            variacao={8.3}
            icone={<TrendingUp className="h-5 w-5" />}
          />
          <CardIndicador
            titulo="Cotações em Andamento"
            valor={23}
            tipo="numero"
            icone={<FileText className="h-5 w-5" />}
          />
        </div>

        {/* Segunda linha de indicadores */}
        <div className="indicadores-grid">
          <CardIndicador
            titulo="Cotações Concluídas"
            valor={187}
            tipo="numero"
            variacao={15.2}
          />
          <CardIndicador
            titulo="Tempo Médio de Fechamento"
            valor="12 dias"
            tipo="texto"
            icone={<Clock className="h-5 w-5" />}
          />
          <CardIndicador
            titulo="Fornecedores Ativos"
            valor={45}
            tipo="numero"
            variacao={3.5}
          />
          <CardIndicador
            titulo="Taxa de Economia"
            valor={9.4}
            tipo="percentual"
            variacao={2.1}
            icone={<BarChart3 className="h-5 w-5" />}
          />
        </div>

        {/* Gráficos - Primeira Linha */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ContainerGrafico
            titulo="Execução Orçamentária Mensal"
            subtitulo="Comparativo previsto vs executado"
          >
            <GraficoLinha
              dados={dadosOrcamentoMensal}
              linhas={[
                { chave: 'previsto', nome: 'Previsto', cor: 'hsl(var(--chart-4))', tracejado: true },
                { chave: 'executado', nome: 'Executado', cor: 'hsl(var(--chart-1))' },
              ]}
            />
          </ContainerGrafico>

          <ContainerGrafico
            titulo="Orçamento por Centro de Custo"
            subtitulo="Distribuição e execução por unidade"
          >
            <GraficoBarras
              dados={dadosPorCentroCusto}
              barras={[
                { chave: 'orcamento', nome: 'Orçamento', cor: 'hsl(var(--chart-4))', empilhado: 'stack' },
                { chave: 'executado', nome: 'Executado', cor: 'hsl(var(--chart-1))', empilhado: 'stack2' },
              ]}
              layout="vertical"
            />
          </ContainerGrafico>
        </div>

        {/* Gráficos - Segunda Linha */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Gráfico de Dispersão - Preço vs Tempo de Entrega */}
          <ContainerGrafico
            titulo="Preço Médio vs Tempo de Entrega"
            subtitulo="Análise de fornecedores por desempenho"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  dataKey="tempoEntrega"
                  name="Tempo"
                  unit=" dias"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="precoMedio"
                  name="Preço"
                  unit=" R$"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="volume" range={[100, 500]} name="Volume" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'Preço') return [`R$ ${value.toFixed(2)}`, name];
                    if (name === 'Tempo') return [`${value} dias`, name];
                    return [formatarNumero(value), name];
                  }}
                />
                <Scatter
                  name="Fornecedores"
                  data={precoVsEntrega}
                  fill="hsl(var(--chart-1))"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </ContainerGrafico>

          {/* Ranking de Medicamentos */}
          <TabelaRanking
            titulo="Medicamentos Mais Comprados"
            dados={rankingMedicamentos}
            colunas={[
              { chave: 'posicao', titulo: '#', alinhamento: 'center' },
              { chave: 'nome', titulo: 'Medicamento' },
              { chave: 'quantidade', titulo: 'Qtd.', formatador: (v) => formatarNumero(v as number), alinhamento: 'right' },
              { chave: 'valor', titulo: 'Valor Total', formatador: (v) => formatarMoedaCompacta(v as number), alinhamento: 'right' },
            ]}
            colunaVariacao="variacao"
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
