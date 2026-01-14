import { ReactNode, useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  titulo: string;
  subtitulo?: string;
  acoes?: ReactNode;
}

export function DashboardHeader({ titulo, subtitulo, acoes }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">{titulo}</h1>
          {subtitulo && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitulo}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* Busca interativa: colapsa e expande ao passar o mouse; mostra sugestões ao clicar/focar */}
          <HeaderSearch />

          {acoes}
        </div>
      </div>
    </header>
  );
}

function HeaderSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const closeTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeout.current) window.clearTimeout(closeTimeout.current);
    };
  }, []);

  function scheduleClose() {
    closeTimeout.current = window.setTimeout(() => setShowSuggestions(false), 150);
  }

  // detect role from localStorage (fallback to prefeitura). Adjust integration as needed.
  const role = (typeof window !== 'undefined' && (localStorage.getItem('userRole') || localStorage.getItem('role'))) || 'prefeitura';

  const routes = ROUTES_BY_ROLE[role] || ROUTES_BY_ROLE['prefeitura'];

  const filteredRoutes = routes.filter((r) => r.label.toLowerCase().includes(query.toLowerCase()));

  function handleNavigate(path: string) {
    setShowSuggestions(false);
    navigate(path);
  }

  return (
    <div className="relative hidden md:block">
      <div className="group">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="header-search"
            type="text"
            placeholder="Buscar..."
            className="w-12 group-hover:w-64 focus:w-64 transition-all duration-200 pl-9 pr-4 py-2 text-sm bg-secondary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => scheduleClose()}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputRef}
          />
        </div>

        {showSuggestions && (
          <div ref={suggestionsRef} className="absolute mt-2 w-64 bg-popover border border-border rounded-md shadow-md z-50">
            <div className="p-2">
              <input
                className="w-full px-2 py-1 text-sm border border-border rounded-md"
                placeholder="Pesquisar rotas..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
              />
            </div>
            <ul className="max-h-56 overflow-auto">
              {filteredRoutes.length === 0 && (
                <li className="px-3 py-2 text-sm text-muted-foreground">Nenhuma sugestão</li>
              )}
              {filteredRoutes.map((r) => (
                <li
                  key={r.path}
                  className="px-3 py-2 hover:bg-accent/50 cursor-pointer text-sm"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleNavigate(r.path)}
                >
                  {r.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const ROUTES_BY_ROLE: Record<string, Array<{ label: string; path: string }>> = {
  prefeitura: [
    { label: 'Painel', path: '/portal-prefeitura' },
    { label: 'Cotações', path: '/portal-prefeitura/cotacoes' },
    { label: 'Centros de Custo', path: '/portal-prefeitura/centros-custo' },
    { label: 'Relatórios', path: '/portal-prefeitura/relatorios' },
    { label: 'Usuários', path: '/portal-prefeitura/usuarios' },
    { label: 'Configurações', path: '/portal-prefeitura/configuracoes' },
  ],
  fornecedor: [
    { label: 'Painel Fornecedor', path: '/portal-fornecedor' },
    { label: 'Fornecedores', path: '/portal-fornecedor/fornecedores' },
    { label: 'Financeiro', path: '/portal-fornecedor/financeiro' },
    { label: 'Configurações', path: '/portal-fornecedor/configuracoes' },
  ],
  admin: [
    { label: 'Admin', path: '/portal-admin' },
    { label: 'Relatórios (Admin)', path: '/portal-admin/relatorios' },
  ],
};
