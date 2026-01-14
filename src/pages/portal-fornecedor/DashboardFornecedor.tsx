import { CardIndicador } from '@/components/indicadores/CardIndicador';
import { ContainerGrafico } from '@/components/graficos/ContainerGrafico';
import { GraficoLinha } from '@/components/graficos/GraficoLinha';
import { GraficoBarras } from '@/components/graficos/GraficoBarras';
import { GraficoPizza } from '@/components/graficos/GraficoPizza';
import { TabelaRanking } from '@/components/tabelas/TabelaRanking';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Outlet } from 'react-router-dom';

export function DashboardFornecedor() {
  const usuario = {
    nome: 'Carlos Mendes',
    email: 'carlos@pharmabrasil.com.br',
  };

  return (
    <SidebarLayout portal="fornecedor" usuario={usuario}>
      <Outlet />
    </SidebarLayout>
  );
}
