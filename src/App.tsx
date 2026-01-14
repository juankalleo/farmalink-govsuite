import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPrefeitura } from "./pages/portal-prefeitura/DashboardPrefeitura";
import { DashboardFornecedor } from "./pages/portal-fornecedor/DashboardFornecedor";
import { DashboardAdmin } from "./pages/portal-admin/DashboardAdmin";

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
          <Route path="/portal-prefeitura" element={<DashboardPrefeitura />} />
          <Route path="/portal-prefeitura/*" element={<DashboardPrefeitura />} />

          {/* Portal do Fornecedor */}
          <Route path="/portal-fornecedor" element={<DashboardFornecedor />} />
          <Route path="/portal-fornecedor/*" element={<DashboardFornecedor />} />

          {/* Portal do Administrador */}
          <Route path="/portal-admin" element={<DashboardAdmin />} />
          <Route path="/portal-admin/*" element={<DashboardAdmin />} />

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
