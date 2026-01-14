import { ReactNode } from 'react';
import { Bell, Search, User } from 'lucide-react';

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
          {/* Busca */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-64 pl-9 pr-4 py-2 text-sm bg-secondary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          {/* Notificações */}
          <button className="relative p-2 rounded-md hover:bg-secondary text-muted-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
          </button>
          
          {/* Avatar */}
          <button className="p-2 rounded-md hover:bg-secondary text-muted-foreground">
            <User className="h-5 w-5" />
          </button>

          {acoes}
        </div>
      </div>
    </header>
  );
}
