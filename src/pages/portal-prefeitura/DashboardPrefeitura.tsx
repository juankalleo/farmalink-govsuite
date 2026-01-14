import { Outlet } from 'react-router-dom';
import { SidebarLayout } from '@/components/layout/SidebarLayout';

export function DashboardPrefeitura() {
  const usuario = {
    nome: 'Maria Silva',
    email: 'maria.silva@prefeitura.gov.br',
  };

  return (
    <SidebarLayout portal="prefeitura" usuario={usuario}>
      <Outlet />
    </SidebarLayout>
  );
}
