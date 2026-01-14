import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Package,
  ShoppingCart,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { TipoPortal } from '@/types';
import { useState } from 'react';

interface ItemMenu {
  titulo: string;
  href: string;
  icone: ReactNode;
}

const menusPortal: Record<TipoPortal, ItemMenu[]> = {
  prefeitura: [
    { titulo: 'Dashboard', href: '/portal-prefeitura', icone: <LayoutDashboard className="h-4 w-4" /> },
    { titulo: 'Cotações', href: '/portal-prefeitura/cotacoes', icone: <FileText className="h-4 w-4" /> },
    { titulo: 'Centros de Custo', href: '/portal-prefeitura/centros-custo', icone: <Building2 className="h-4 w-4" /> },
    { titulo: 'Fornecedores', href: '/portal-prefeitura/fornecedores', icone: <Package className="h-4 w-4" /> },
    { titulo: 'Financeiro', href: '/portal-prefeitura/financeiro', icone: <Wallet className="h-4 w-4" /> },
    { titulo: 'Relatórios', href: '/portal-prefeitura/relatorios', icone: <BarChart3 className="h-4 w-4" /> },
    { titulo: 'Usuários', href: '/portal-prefeitura/usuarios', icone: <Users className="h-4 w-4" /> },
    { titulo: 'Configurações', href: '/portal-prefeitura/configuracoes', icone: <Settings className="h-4 w-4" /> },
  ],
  fornecedor: [
    { titulo: 'Dashboard', href: '/portal-fornecedor', icone: <LayoutDashboard className="h-4 w-4" /> },
    { titulo: 'Cotações Disponíveis', href: '/portal-fornecedor/cotacoes', icone: <FileText className="h-4 w-4" /> },
    { titulo: 'Minhas Propostas', href: '/portal-fornecedor/propostas', icone: <ShoppingCart className="h-4 w-4" /> },
    { titulo: 'Desempenho', href: '/portal-fornecedor/desempenho', icone: <TrendingUp className="h-4 w-4" /> },
    { titulo: 'Financeiro', href: '/portal-fornecedor/financeiro', icone: <Wallet className="h-4 w-4" /> },
    { titulo: 'Relatórios', href: '/portal-fornecedor/relatorios', icone: <BarChart3 className="h-4 w-4" /> },
    { titulo: 'Configurações', href: '/portal-fornecedor/configuracoes', icone: <Settings className="h-4 w-4" /> },
  ],
  admin: [
    { titulo: 'Dashboard', href: '/portal-admin', icone: <LayoutDashboard className="h-4 w-4" /> },
    { titulo: 'Órgãos Públicos', href: '/portal-admin/orgaos', icone: <Building2 className="h-4 w-4" /> },
    { titulo: 'Fornecedores', href: '/portal-admin/fornecedores', icone: <Package className="h-4 w-4" /> },
    { titulo: 'Usuários', href: '/portal-admin/usuarios', icone: <Users className="h-4 w-4" /> },
    { titulo: 'Financeiro', href: '/portal-admin/financeiro', icone: <Wallet className="h-4 w-4" /> },
    { titulo: 'Relatórios', href: '/portal-admin/relatorios', icone: <BarChart3 className="h-4 w-4" /> },
    { titulo: 'Segurança', href: '/portal-admin/seguranca', icone: <Shield className="h-4 w-4" /> },
    { titulo: 'Configurações', href: '/portal-admin/configuracoes', icone: <Settings className="h-4 w-4" /> },
  ],
};

const titulosPortal: Record<TipoPortal, string> = {
  prefeitura: 'Portal do Órgão Público',
  fornecedor: 'Portal do Fornecedor',
  admin: 'Administração do Sistema',
};

interface SidebarLayoutProps {
  children: ReactNode;
  portal: TipoPortal;
  usuario?: { nome: string; email: string };
}

export function SidebarLayout({ children, portal, usuario }: SidebarLayoutProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const menuItems = menusPortal[portal];

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md overflow-hidden bg-sidebar-primary flex items-center justify-center">
                <img src="/iconfarmalink.png" alt="NextFarma" className="h-8 w-8 object-cover" />
              </div>
              <span className="brand-font text-2xl font-semibold text-sidebar-foreground">NextFarma</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Título do Portal */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
              {titulosPortal[portal]}
            </p>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  isActive ? 'sidebar-link-active' : 'sidebar-link',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.titulo : undefined}
              >
                {item.icone}
                {!collapsed && <span>{item.titulo}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Usuário */}
        <div className="p-2 border-t border-sidebar-border">
          {usuario && !collapsed && (
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{usuario.nome}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{usuario.email}</p>
            </div>
          )}
          <Link
            to="/"
            className={cn(
              'sidebar-link text-destructive hover:text-destructive',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sair</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
