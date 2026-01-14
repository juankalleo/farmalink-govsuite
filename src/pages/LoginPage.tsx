import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TipoPortal } from '@/types';
import { Building2, Package, Shield, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginPageProps {
  portal: TipoPortal;
}

const configPortal: Record<TipoPortal, {
  titulo: string;
  subtitulo: string;
  icone: React.ElementType;
  corIcone: string;
  rotaDashboard: string;
}> = {
  prefeitura: {
    titulo: 'Portal do Órgão Público',
    subtitulo: 'Acesso para gestores de saúde pública',
    icone: Building2,
    corIcone: 'bg-info/10 text-info',
    rotaDashboard: '/portal-prefeitura',
  },
  fornecedor: {
    titulo: 'Portal do Fornecedor',
    subtitulo: 'Acesso para distribuidoras e farmácias',
    icone: Package,
    corIcone: 'bg-success/10 text-success',
    rotaDashboard: '/portal-fornecedor',
  },
  admin: {
    titulo: 'Administração do Sistema',
    subtitulo: 'Acesso restrito a administradores',
    icone: Shield,
    corIcone: 'bg-primary/10 text-primary',
    rotaDashboard: '/portal-admin',
  },
};

export function LoginPage({ portal }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const config = configPortal[portal];
  const Icone = config.icone;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    // Simular autenticação
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email && senha) {
      navigate(config.rotaDashboard);
    } else {
      setErro('Preencha todos os campos');
    }

    setCarregando(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
              <img src="/iconfarmalink.png" alt="NextFarma" className="h-10 w-10 object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sidebar-foreground brand-font">NextFarma</h1>
              <p className="text-sm text-sidebar-foreground/60">Sistema de Gestão Farmacêutica</p>
            </div>
          </div>

          <div className="space-y-6 text-sidebar-foreground">
            <h2 className="text-3xl font-bold leading-tight">
              Gestão inteligente de<br />compras públicas em saúde
            </h2>
            <p className="text-sidebar-foreground/70 max-w-md">
              Conectando órgãos públicos e fornecedores para uma gestão eficiente,
              transparente e econômica de medicamentos e insumos hospitalares.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <p className="text-3xl font-bold text-primary">R$ 2.5B+</p>
                <p className="text-sm text-sidebar-foreground/60">Transacionados</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">380+</p>
                <p className="text-sm text-sidebar-foreground/60">Fornecedores</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">110+</p>
                <p className="text-sm text-sidebar-foreground/60">Órgãos Públicos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decoração */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/5 rounded-full" />
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Header do Portal */}
          <div className="text-center mb-8">
            <div className={cn('inline-flex p-4 rounded-xl mb-4', config.corIcone)}>
              <Icone className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">{config.titulo}</h2>
            <p className="text-muted-foreground mt-1">{config.subtitulo}</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {erro && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {erro}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="seu@email.gov.br"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-foreground mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">Lembrar de mim</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Esqueci minha senha
              </a>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Links de outros portais */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center mb-3">
              Acessar outro portal:
            </p>
            <div className="flex justify-center gap-4">
              {portal !== 'prefeitura' && (
                <a
                  href="/login/prefeitura"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Building2 className="h-4 w-4" />
                  Órgão Público
                </a>
              )}
              {portal !== 'fornecedor' && (
                <a
                  href="/login/fornecedor"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Package className="h-4 w-4" />
                  Fornecedor
                </a>
              )}
              {portal !== 'admin' && (
                <a
                  href="/login/admin"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Shield className="h-4 w-4" />
                  Administrador
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
