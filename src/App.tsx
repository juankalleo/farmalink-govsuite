import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPrefeitura } from "./pages/portal-prefeitura/DashboardPrefeitura";
import PrefeituraHome from "./pages/portal-prefeitura/PrefeituraHome";
import Cotacoes from "./pages/portal-prefeitura/Cotacoes";
import CentrosCusto from "./pages/portal-prefeitura/CentrosCusto";
import Financeiro from "./pages/portal-prefeitura/Financeiro";
import Relatorios from "./pages/portal-prefeitura/Relatorios";
import Usuarios from "./pages/portal-prefeitura/Usuarios";
import Configuracoes from "./pages/portal-prefeitura/Configuracoes";
import { DashboardFornecedor } from "./pages/portal-fornecedor/DashboardFornecedor";
import Fornecedores from "./pages/portal-fornecedor/Fornecedores";
import FinanceiroFornecedor from "./pages/portal-fornecedor/Financeiro";
import CotacoesFornecedor from "./pages/portal-fornecedor/Cotacoes";
import FornecedorHome from "./pages/portal-fornecedor/FornecedorHome";
import PropostasFornecedor from "./pages/portal-fornecedor/Propostas";
import DesempenhoFornecedor from "./pages/portal-fornecedor/Desempenho";
import RelatoriosFornecedor from "./pages/portal-fornecedor/Relatorios";
import ConfiguracoesFornecedor from "./pages/portal-fornecedor/Configuracoes";
import { DashboardAdmin } from "./pages/portal-admin/DashboardAdmin";
import AdminLayout from "./pages/portal-admin/AdminLayout";
import Orgaos from "./pages/portal-admin/Orgaos";
import FornecedoresAdmin from "./pages/portal-admin/Fornecedores";
import UsuariosAdmin from "./pages/portal-admin/Usuarios";
import FinanceiroAdmin from "./pages/portal-admin/Financeiro";
import SegurancaAdmin from "./pages/portal-admin/Seguranca";
import ConfiguracoesAdmin from "./pages/portal-admin/Configuracoes";
import RelatoriosAdmin from "./pages/portal-admin/Relatorios";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Página Inicial */}
          <Route path="/" element={<Index />} />

          {/* Rotas de Login */}
          <Route path="/login/prefeitura" element={<LoginPage portal="prefeitura" />} />
          <Route path="/login/fornecedor" element={<LoginPage portal="fornecedor" />} />
          <Route path="/login/admin" element={<LoginPage portal="admin" />} />

          {/* Portal da Prefeitura */}
          <Route path="/portal-prefeitura/*" element={<DashboardPrefeitura />}>
            <Route index element={<PrefeituraHome />} />
            <Route path="cotacoes" element={<Cotacoes />} />
            <Route path="centros-custo" element={<CentrosCusto />} />
            <Route path="fornecedores" element={<Fornecedores />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="configuracoes" element={<Configuracoes />} />
          </Route>

          {/* Portal do Fornecedor */}
          <Route path="/portal-fornecedor/*" element={<DashboardFornecedor />}>
            <Route index element={<FornecedorHome />} />
            <Route path="cotacoes" element={<CotacoesFornecedor />} />
            <Route path="fornecedores" element={<Fornecedores />} />
            <Route path="propostas" element={<PropostasFornecedor />} />
            <Route path="relatorios" element={<RelatoriosFornecedor />} />
            <Route path="configuracoes" element={<ConfiguracoesFornecedor />} />
            <Route path="desempenho" element={<DesempenhoFornecedor />} />
            <Route path="financeiro" element={<FinanceiroFornecedor />} />
          </Route>

          {/* Portal do Administrador */}
          <Route path="/portal-admin/*" element={<AdminLayout />}>
            <Route index element={<DashboardAdmin />} />
            <Route path="orgaos" element={<Orgaos />} />
            <Route path="fornecedores" element={<FornecedoresAdmin />} />
            <Route path="usuarios" element={<UsuariosAdmin />} />
            <Route path="relatorios" element={<RelatoriosAdmin />} />
            <Route path="financeiro" element={<FinanceiroAdmin />} />
            <Route path="seguranca" element={<SegurancaAdmin />} />
            <Route path="configuracoes" element={<ConfiguracoesAdmin />} />
          </Route>

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
