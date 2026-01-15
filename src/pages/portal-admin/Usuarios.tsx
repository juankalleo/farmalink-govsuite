import { useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Search } from 'lucide-react';

type Usuario = {
  id: string;
  nome: string;
  email: string;
  papel: 'admin' | 'prefeitura' | 'fornecedor';
  ativo: boolean;
};

const initialUsuarios: Usuario[] = [
  { id: 'u1', nome: 'Ana Souza', email: 'ana.souza@nextfarma.gov.br', papel: 'admin', ativo: true },
  { id: 'u2', nome: 'Carlos Pereira', email: 'carlos.pereira@municipio.gov.br', papel: 'prefeitura', ativo: true },
  { id: 'u3', nome: 'João Silva', email: 'joao@fornecedor.com', papel: 'fornecedor', ativo: false },
];

export default function UsuariosAdmin() {

  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [q, setQ] = useState('');
  const [papelFiltro, setPapelFiltro] = useState<string>('');
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtrados = useMemo(() => {
    return usuarios.filter(u => {
      if (q && !(u.nome + u.email).toLowerCase().includes(q.toLowerCase())) return false;
      if (papelFiltro && u.papel !== papelFiltro) return false;
      return true;
    });
  }, [usuarios, q, papelFiltro]);

  function startEdit(u?: Usuario) {
    setEditing(u ?? null);
    setShowForm(true);
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const payload: Usuario = {
      id: editing?.id ?? String(Date.now()),
      nome: String(fd.get('nome') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      papel: (fd.get('papel') as Usuario['papel']) || 'prefeitura',
      ativo: fd.get('ativo') === 'on',
    };

    setUsuarios((prev) => {
      if (editing) return prev.map(p => p.id === editing.id ? payload : p);
      return [payload, ...prev];
    });
    setShowForm(false);
    setEditing(null);
  }

  function remover(id: string) {
    if (!confirm('Remover usuário?')) return;
    setUsuarios((s) => s.filter(u => u.id !== id));
  }

  function toggleAtivo(id: string) {
    setUsuarios((s) => s.map(u => u.id === id ? { ...u, ativo: !u.ativo } : u));
  }

  return (
    <>
      <DashboardHeader titulo="Usuários" subtitulo="Gerencie contas e permissões" />

      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou e-mail" className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-secondary text-sm" />
          </div>

          <div className="flex items-center gap-2">
            <select value={papelFiltro} onChange={(e) => setPapelFiltro(e.target.value)} className="px-3 py-2 border border-border rounded-md bg-secondary text-sm">
              <option value="">Todos os papéis</option>
              <option value="admin">Admin</option>
              <option value="prefeitura">Prefeitura</option>
              <option value="fornecedor">Fornecedor</option>
            </select>

            <button onClick={() => startEdit()} className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">Adicionar usuário</button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={salvar} className="p-4 border border-border rounded-md bg-card space-y-3 max-w-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input name="nome" defaultValue={editing?.nome} placeholder="Nome completo" className="px-3 py-2 border border-border rounded-md bg-secondary text-sm" required />
              <input name="email" type="email" defaultValue={editing?.email} placeholder="email@exemplo.com" className="px-3 py-2 border border-border rounded-md bg-secondary text-sm" required />
            </div>
            <div className="flex items-center gap-3">
              <select name="papel" defaultValue={editing?.papel || 'prefeitura'} className="px-3 py-2 border border-border rounded-md bg-secondary text-sm">
                <option value="admin">Admin</option>
                <option value="prefeitura">Prefeitura</option>
                <option value="fornecedor">Fornecedor</option>
              </select>
              <label className="inline-flex items-center gap-2 text-sm">
                <input name="ativo" type="checkbox" defaultChecked={editing?.ativo ?? true} className="h-4 w-4" />
                Ativo
              </label>
              <div className="ml-auto flex gap-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-3 py-2 border border-border rounded-md text-sm">Cancelar</button>
                <button type="submit" className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">Salvar</button>
              </div>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
                <col style={{ width: '40px' }} />
                <col style={{ width: '180px' }} />
                <col style={{ width: '420px' }} />
                <col style={{ width: '120px' }} />
              </colgroup>
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="py-2 text-center">#</th>
                <th className="py-2 text-left">Nome</th>
                <th className="py-2 text-left">E-mail</th>
                <th className="py-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u, i) => (
                <tr key={u.id} className="hover:bg-accent/5">
                  <td className="py-3 text-center">{i + 1}</td>
                  <td className="py-3 max-w-[180px] truncate">
                    <div className="font-medium truncate">{u.nome}</div>
                    <div className="text-xs text-muted-foreground truncate">{u.papel}</div>
                  </td>
                  <td className="py-3 break-words whitespace-normal max-w-[420px]">{u.email}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(u)} className="text-sm text-primary hover:underline">Editar</button>
                      <button onClick={() => toggleAtivo(u.id)} className={`px-2 py-1 text-sm rounded ${u.ativo ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{u.ativo ? 'Ativo' : 'Inativo'}</button>
                      <button onClick={() => remover(u.id)} className="text-sm text-destructive">Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
