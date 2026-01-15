import { Outlet } from 'react-router-dom';
import { SidebarLayout } from '@/components/layout/SidebarLayout';

export default function AdminLayout() {
  const usuario = { nome: 'Admin Sistema', email: 'admin@nextfarma.gov.br' };
  return (
    <SidebarLayout portal="admin" usuario={usuario}>
      <Outlet />
    </SidebarLayout>
  );
}
