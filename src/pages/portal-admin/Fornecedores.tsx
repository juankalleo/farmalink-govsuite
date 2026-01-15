import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Search } from 'lucide-react';
import { fornecedoresMock } from '@/lib/mock-dados';
import { formatarNumero } from '@/lib/formatadores';
import { useMemo, useState } from 'react';

export default function FornecedoresAdmin() {

  const [dados, setDados] = useState(() => fornecedoresMock);
  const [q, setQ] = useState('');
  const [categoria, setCategoria] = useState<string>('');
  const [somenteAtivos, setSomenteAtivos] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const categorias = useMemo(() => Array.from(new Set(fornecedoresMock.map(f => f.categoria))).sort(), []);

  const filtrados = useMemo(() => {
    return dados.filter(d => {
      if (q && !(d.razaoSocial + d.nomeFantasia).toLowerCase().includes(q.toLowerCase())) return false;
      if (categoria && d.categoria !== categoria) return false;
      if (somenteAtivos && !d.ativo) return false;
      return true;
    });
  }, [dados, q, categoria, somenteAtivos]);

  function toggleAtivo(id: string) {
    setDados((prev) => prev.map(p => p.id === id ? { ...p, ativo: !p.ativo } : p));
  }

  function toggleExpand(id: string) {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <>
      <DashboardHeader titulo="Fornecedores" subtitulo="Gerencie fornecedores e aprovações" />

      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou razão social" className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-secondary text-sm" />
          </div>

          <div className="flex items-center gap-2">
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="px-3 py-2 border border-border rounded-md bg-secondary text-sm">
              <option value="">Todas as categorias</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={somenteAtivos} onChange={(e) => setSomenteAtivos(e.target.checked)} className="h-4 w-4" />
              Somente ativos
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: '40px' }} />
              <col />
              <col style={{ width: '180px' }} />
              <col style={{ width: '160px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '120px' }} />
            </colgroup>
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="py-2 text-center">#</th>
                <th className="py-2 text-left">Nome / Razão</th>
                <th className="py-2 text-left">CNPJ</th>
                <th className="py-2 text-left">Local</th>
                <th className="py-2 text-left">Categoria</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((f, idx) => (
                <>
                  <tr key={f.id} className="hover:bg-accent/5 align-top">
                    <td className="py-3 text-center">{idx + 1}</td>
                    <td className="py-3">
                      <div className="font-medium">{f.nomeFantasia}</div>
                      <div className="text-xs text-muted-foreground">{f.razaoSocial}</div>
                    </td>
                    <td className="py-3">{f.cnpj}</td>
                    <td className="py-3">{f.cidade} / {f.uf}</td>
                    <td className="py-3">{f.categoria}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleExpand(f.id)} className="text-sm text-primary hover:underline">Detalhes</button>
                        <button onClick={() => toggleAtivo(f.id)} className={`px-2 py-1 text-sm rounded ${f.ativo ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                          {f.ativo ? 'Ativo' : 'Inativo'}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded[f.id] && (
                    <tr key={f.id + '-details'} className="bg-card">
                      <td />
                      <td colSpan={5} className="py-3 text-sm text-muted-foreground">
                        <div className="grid md:grid-cols-3 gap-2">
                          <div><strong>E-mail:</strong> {f.email}</div>
                          <div><strong>Telefone:</strong> {f.telefone}</div>
                          <div><strong>Endereço:</strong> {f.endereco}</div>
                          <div><strong>Avaliação média:</strong> {f.avaliacaoMedia ?? '-'} </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
