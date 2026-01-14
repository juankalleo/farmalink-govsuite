import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { CardIndicador } from '@/components/indicadores/CardIndicador';
import { ContainerGrafico } from '@/components/graficos/ContainerGrafico';
import { GraficoLinha } from '@/components/graficos/GraficoLinha';
import { GraficoBarras } from '@/components/graficos/GraficoBarras';
import { GraficoPizza } from '@/components/graficos/GraficoPizza';
import { TabelaRanking } from '@/components/tabelas/TabelaRanking';
import {
  faturamentoMensal,
  propostasResultado,
  participacaoPorOrgao,
  comparativoPrecos,
} from '@/lib/mock-dados';
import { formatarMoeda, formatarMoedaCompacta, formatarNumero } from '@/lib/formatadores';
import {
  Wallet,
  TrendingUp,
  FileText,
  Clock,
  Target,
  Award,
  DollarSign,
  Calendar,
} from 'lucide-react';

// Ranking de produtos mais vendidos
const rankingProdutos = [
  { posicao: 1, nome: 'Losartana 50mg', quantidade: 45000, valor: 135000, variacao: 18.5 },
  { posicao: 2, nome: 'Metformina 850mg', quantidade: 38000, valor: 76000, variacao: 12.3 },
  { posicao: 3, nome: 'Omeprazol 20mg', quantidade: 32000, valor: 96000, variacao: -2.1 },
  { posicao: 4, nome: 'Dipirona 500mg', quantidade: 28000, valor: 42000, variacao: 5.8 },
  { posicao: 5, nome: 'Enalapril 10mg', quantidade: 25000, valor: 50000, variacao: 8.9 },
];

export function DashboardFornecedor() {
  const usuario = {
    nome: 'Carlos Mendes',
    email: 'carlos@pharmabrasil.com.br',
  };

  return (
    <SidebarLayout portal="fornecedor" usuario={usuario}>
      <DashboardHeader
        titulo="Dashboard Comercial"
        subtitulo="Acompanhe seu desempenho de vendas e propostas"
      />

      <div className="p-6 space-y-6">
        {/* Indicadores Principais */}
        <div className="indicadores-grid">
          <CardIndicador
            titulo="Faturamento Bruto"
            valor={6030000}
            tipo="moeda"
            variacao={15.8}
            icone={<Wallet className="h-5 w-5" />}
            destaque
          />
          <CardIndicador
            titulo="Faturamento Líquido"
            valor={5427000}
            tipo="moeda"
            variacao={14.2}
            icone={<DollarSign className="h-5 w-5" />}
          />
          <CardIndicador
            titulo="Propostas Enviadas"
            valor={156}
            tipo="numero"
            variacao={22.4}
            icone={<FileText className="h-5 w-5" />}
          />
          <CardIndicador
            titulo="Propostas Vencidas"
            valor={89}
            tipo="numero"
            variacao={18.7}
            icone={<Award className="h-5 w-5" />}
          />
        </div>

        {/* Segunda linha de indicadores */}
        <div className="indicadores-grid">
          <CardIndicador
            titulo="Taxa de Conversão"
            valor={57.1}
            tipo="percentual"
            variacao={5.3}
            icone={<Target className="h-5 w-5" />}
          />
          <CardIndicador
            titulo="Ticket Médio"
            valor={67753}
            tipo="moeda"
            variacao={-2.4}
            icone={<TrendingUp className="h-5 w-5" />}
          />
          <CardIndicador
            titulo="Prazo Médio de Pagamento"
            valor="28 dias"
            tipo="texto"
            icone={<Calendar className="h-5 w-5" />}
          />
          <CardIndicador
            titulo="Tempo Médio de Proposta"
            valor="2.5 dias"
            tipo="texto"
            icone={<Clock className="h-5 w-5" />}
          />
        </div>

        {/* Gráficos - Primeira Linha */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ContainerGrafico
            titulo="Faturamento Mensal"
            subtitulo="Comparativo bruto vs líquido"
          >
            <GraficoLinha
              dados={faturamentoMensal}
              linhas={[
                { chave: 'bruto', nome: 'Faturamento Bruto', cor: 'hsl(var(--chart-1))' },
                { chave: 'liquido', nome: 'Faturamento Líquido', cor: 'hsl(var(--chart-2))' },
              ]}
            />
          </ContainerGrafico>

          <ContainerGrafico
            titulo="Propostas: Ganhas vs Perdidas"
            subtitulo="Desempenho mensal de licitações"
          >
            <GraficoBarras
              dados={propostasResultado}
              barras={[
                { chave: 'ganhas', nome: 'Ganhas', cor: 'hsl(var(--chart-2))' },
                { chave: 'perdidas', nome: 'Perdidas', cor: 'hsl(var(--chart-1))' },
              ]}
              formatarValor={(v) => String(v)}
            />
          </ContainerGrafico>
        </div>

        {/* Gráficos - Segunda Linha */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <ContainerGrafico
            titulo="Participação por Órgão"
            subtitulo="Distribuição do faturamento"
          >
            <GraficoPizza dados={participacaoPorOrgao} tipoValor="percentual" />
          </ContainerGrafico>

          <ContainerGrafico
            titulo="Comparativo de Preços"
            subtitulo="Preço ofertado vs vencedor"
            className="lg:col-span-2"
          >
            <GraficoBarras
              dados={comparativoPrecos}
              barras={[
                { chave: 'ofertado', nome: 'Preço Ofertado', cor: 'hsl(var(--chart-4))' },
                { chave: 'vencedor', nome: 'Preço Vencedor', cor: 'hsl(var(--chart-2))' },
              ]}
            />
          </ContainerGrafico>
        </div>

        {/* Ranking de Produtos */}
        <TabelaRanking
          titulo="Produtos Mais Vendidos"
          dados={rankingProdutos}
          colunas={[
            { chave: 'posicao', titulo: '#', alinhamento: 'center' },
            { chave: 'nome', titulo: 'Produto' },
            { chave: 'quantidade', titulo: 'Qtd. Vendida', formatador: (v) => formatarNumero(v as number), alinhamento: 'right' },
            { chave: 'valor', titulo: 'Valor Total', formatador: (v) => formatarMoedaCompacta(v as number), alinhamento: 'right' },
          ]}
          colunaVariacao="variacao"
        />
      </div>
    </SidebarLayout>
  );
}
