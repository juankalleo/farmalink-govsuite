import { Link } from 'react-router-dom';
import { Building2, Package, Shield, ChevronRight, BarChart3, FileText, Users } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">FL</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">FarmaLink</h1>
                <p className="text-xs text-muted-foreground">Sistema de Gestão Farmacêutica</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#sobre" className="text-muted-foreground hover:text-foreground transition-colors">Sobre</a>
              <a href="#recursos" className="text-muted-foreground hover:text-foreground transition-colors">Recursos</a>
              <a href="#portais" className="text-muted-foreground hover:text-foreground transition-colors">Portais</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-sidebar to-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Sistema Enterprise de Gestão Farmacêutica
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-sidebar-foreground mb-6 leading-tight">
              Gestão inteligente de compras públicas em saúde
            </h2>
            <p className="text-lg text-sidebar-foreground/70 mb-10 max-w-2xl mx-auto">
              Conectando órgãos públicos e fornecedores para uma gestão eficiente,
              transparente e econômica de medicamentos e insumos hospitalares.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login/prefeitura"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Acessar Sistema
                <ChevronRight className="h-4 w-4" />
              </Link>
              <a
                href="#recursos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-md hover:bg-secondary/80 transition-colors"
              >
                Conhecer Recursos
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">R$ 2.5B+</p>
              <p className="text-sm text-sidebar-foreground/60 mt-1">Transacionados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">380+</p>
              <p className="text-sm text-sidebar-foreground/60 mt-1">Fornecedores</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">110+</p>
              <p className="text-sm text-sidebar-foreground/60 mt-1">Órgãos Públicos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">15K+</p>
              <p className="text-sm text-sidebar-foreground/60 mt-1">Cotações/Ano</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Recursos do Sistema</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Plataforma completa para gestão de compras farmacêuticas públicas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Gestão de Cotações</h4>
              <p className="text-sm text-muted-foreground">
                Sistema completo de licitações e cotações com workflow automatizado,
                comparativo de preços e adjudicação transparente.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-success/10 text-success flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Dashboards Analíticos</h4>
              <p className="text-sm text-muted-foreground">
                Visualização em tempo real de execução orçamentária, economia gerada,
                desempenho de fornecedores e indicadores estratégicos.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-info/10 text-info flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Multiportais</h4>
              <p className="text-sm text-muted-foreground">
                Interfaces dedicadas para órgãos públicos, fornecedores e administradores
                com permissões e funcionalidades específicas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portais */}
      <section id="portais" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Escolha seu Portal</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Acesse a área correspondente ao seu perfil de usuário
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Portal Prefeitura */}
            <Link
              to="/login/prefeitura"
              className="group p-8 rounded-lg border border-border bg-card hover:border-info hover:shadow-xl transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-xl bg-info/10 text-info flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">Órgão Público</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Prefeituras, secretarias de saúde, hospitais públicos e unidades de saúde.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-info group-hover:gap-2 transition-all">
                Acessar Portal
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>

            {/* Portal Fornecedor */}
            <Link
              to="/login/fornecedor"
              className="group p-8 rounded-lg border border-border bg-card hover:border-success hover:shadow-xl transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-xl bg-success/10 text-success flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Package className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">Fornecedor</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Distribuidoras, farmácias, atacadistas e fabricantes de medicamentos.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-success group-hover:gap-2 transition-all">
                Acessar Portal
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>

            {/* Portal Admin */}
            <Link
              to="/login/admin"
              className="group p-8 rounded-lg border border-border bg-card hover:border-primary hover:shadow-xl transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">Administrador</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Gestão da plataforma, usuários, configurações e relatórios gerenciais.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Acessar Portal
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">FL</span>
              </div>
              <span className="text-sm text-muted-foreground">
                FarmaLink © 2024. Sistema de Gestão Farmacêutica.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
              <a href="#" className="hover:text-foreground transition-colors">Suporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
