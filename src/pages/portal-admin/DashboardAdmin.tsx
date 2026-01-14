import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { CardIndicador } from '@/components/indicadores/CardIndicador';
import { ContainerGrafico } from '@/components/graficos/ContainerGrafico';
import { GraficoLinha } from '@/components/graficos/GraficoLinha';
import { GraficoBarras } from '@/components/graficos/GraficoBarras';
import { GraficoPizza } from '@/components/graficos/GraficoPizza';
import { GraficoArea } from '@/components/graficos/GraficoArea';
import { TabelaRanking } from '@/components/tabelas/TabelaRanking';
import {
  crescimentoMensal,
  receitaPorTipo,
  distribuicaoUsuarios,
  retencaoFornecedores,
  rankingOrgaos,
} from '@/lib/mock-dados';
import { formatarMoeda, formatarMoedaCompacta, formatarNumero } from '@/lib/formatadores';
import {
  Wallet,
  TrendingUp,
  Users,
  Building2,
  Package,
  Activity,
  DollarSign,
  Percent,
} from 'lucide-react';

export function DashboardAdmin() {
  const usuario = {
    nome: 'Admin Sistema',
    email: 'admin@farmalink.gov.br',
  };

  return (
    <SidebarLayout portal="admin" usuario={usuario}>
      <DashboardHeader
        titulo="Dashboard Estratégico"
        subtitulo="Visão executiva da plataforma FarmaLink"
      />

      <div className="p-6 space-y-6">
        {/* Indicadores Principais */}
        <div className="indicadores-grid">
          <CardIndicador
            titulo="Volume Total Transacionado"
            valor={2540000000}
            tipo="moeda"
            variacao={23.5}
            icone={<Wallet className="h-5 w-5" />}
            destaque
          />
          <CardIndicador
            titulo="Receita da Plataforma"
            valor={12700000}
            tipo="moeda"
            variacao={18.2}
            icone={<DollarSign className="h-5 w-5" />}
          />
          <CardIndicador
            titulo="Take Rate Médio"
            valor={0.5}
            tipo="percentual"
            icone={<Percent className="h-5 w-5" />}
          />
          <CardIndicador
            titulo="Taxas Administrativas"
            valor={3800000}
            tipo="moeda"
            variacao={12.8}
            icone={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        {/* Segunda linha de indicadores */}
        <div className="indicadores-grid">
          <CardIndicador
            titulo="Órgãos Públicos"
            valor={110}
            tipo="numero"
            variacao={22.2}
            icone={<Building2 className="h-5 w-5" />}
          />
          <CardIndicador
            titulo="Fornecedores Ativos"
            valor={380}
            tipo="numero"
            variacao={45.8}
            icone={<Package className="h-5 w-5" />}
          />
          <CardIndicador
            titulo="Usuários Ativos"
            valor={637}
            tipo="numero"
            variacao={28.4}
            icone={<Users className="h-5 w-5" />}
          />
          <CardIndicador
            titulo="Saúde da Plataforma"
            valor="98.7%"
            tipo="texto"
            icone={<Activity className="h-5 w-5" />}
          />
        </div>

        {/* Gráficos - Primeira Linha */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ContainerGrafico
            titulo="Crescimento Mensal"
            subtitulo="Órgãos públicos vs fornecedores"
          >
            <GraficoLinha
              dados={crescimentoMensal}
              linhas={[
                { chave: 'orgaos', nome: 'Órgãos Públicos', cor: 'hsl(var(--chart-4))' },
                { chave: 'fornecedores', nome: 'Fornecedores', cor: 'hsl(var(--chart-2))' },
              ]}
              formatarValor={(v) => String(v)}
            />
          </ContainerGrafico>

          <ContainerGrafico
            titulo="Receita por Tipo"
            subtitulo="Composição da receita da plataforma"
          >
            <GraficoBarras
              dados={receitaPorTipo}
              barras={[
                { chave: 'taxaAdm', nome: 'Taxa Administrativa', cor: 'hsl(var(--chart-1))', empilhado: 'stack' },
                { chave: 'takeRate', nome: 'Take Rate', cor: 'hsl(var(--chart-2))', empilhado: 'stack' },
                { chave: 'outros', nome: 'Outros', cor: 'hsl(var(--chart-4))', empilhado: 'stack' },
              ]}
            />
          </ContainerGrafico>
        </div>

        {/* Gráficos - Segunda Linha */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <ContainerGrafico
            titulo="Distribuição de Usuários"
            subtitulo="Por tipo de perfil"
          >
            <GraficoPizza dados={distribuicaoUsuarios} tipoValor="numero" raioInterno={40} />
          </ContainerGrafico>

          <ContainerGrafico
            titulo="Retenção de Fornecedores"
            subtitulo="Cohort de 6 meses"
          >
            <GraficoArea
              dados={retencaoFornecedores}
              chave="retencao"
              nome="Retenção"
              cor="hsl(var(--chart-2))"
            />
          </ContainerGrafico>

          <TabelaRanking
            titulo="Maiores Órgãos por Volume"
            dados={rankingOrgaos}
            colunas={[
              { chave: 'posicao', titulo: '#', alinhamento: 'center' },
              { chave: 'nome', titulo: 'Órgão' },
              { chave: 'volume', titulo: 'Volume', formatador: (v) => formatarMoedaCompacta(v as number), alinhamento: 'right' },
              { chave: 'cotacoes', titulo: 'Cotações', formatador: (v) => formatarNumero(v as number), alinhamento: 'right' },
            ]}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
