import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Search, ChevronDown } from 'lucide-react';
import { rankingOrgaos } from '@/lib/mock-dados';
import { formatarNumero, formatarMoedaCompacta } from '@/lib/formatadores';
import { useMemo, useState } from 'react';

export default function Orgaos() {

  const [q, setQ] = useState('');
  const [minVolume, setMinVolume] = useState<number | ''>('');
  const [maxVolume, setMaxVolume] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'posicao' | 'volume' | 'cotacoes' | 'nome'>('posicao');
  const [desc, setDesc] = useState(true);

  const dadosFiltrados = useMemo(() => {
    let arr = [...rankingOrgaos];
    if (q.trim()) {
      const term = q.toLowerCase();
      arr = arr.filter((r) => r.nome.toLowerCase().includes(term));
    }
    if (minVolume !== '') arr = arr.filter((r) => (r.volume as number) >= Number(minVolume));
    if (maxVolume !== '') arr = arr.filter((r) => (r.volume as number) <= Number(maxVolume));

    arr.sort((a, b) => {
      const aVal = (a as any)[sortBy];
      const bVal = (b as any)[sortBy];
      if (typeof aVal === 'string') return desc ? String(bVal).localeCompare(String(aVal)) : String(aVal).localeCompare(String(bVal));
      return desc ? Number(bVal) - Number(aVal) : Number(aVal) - Number(bVal);
    });

    return arr;
  }, [q, minVolume, maxVolume, sortBy, desc]);

  return (
    <>
      <DashboardHeader titulo="Órgãos Públicos" subtitulo="Gestão de órgãos e seus volumes" />

      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar órgão..."
                className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-secondary text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min volume"
              value={minVolume === '' ? '' : String(minVolume)}
              onChange={(e) => setMinVolume(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-28 px-3 py-2 border border-border rounded-md bg-secondary text-sm"
            />
            <input
              type="number"
              placeholder="Max volume"
              value={maxVolume === '' ? '' : String(maxVolume)}
              onChange={(e) => setMaxVolume(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-28 px-3 py-2 border border-border rounded-md bg-secondary text-sm"
            />

            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="pl-2 pr-8 py-2 border border-border rounded-md bg-secondary text-sm">
                <option value="posicao">Posição</option>
                <option value="nome">Nome</option>
                <option value="volume">Volume</option>
                <option value="cotacoes">Cotações</option>
              </select>
              <button onClick={() => setDesc((v) => !v)} className="absolute right-0 top-1/2 -translate-y-1/2 pr-2 text-muted-foreground">
                <ChevronDown className={`h-4 w-4 transition-transform ${desc ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: '48px' }} />
              <col />
              <col style={{ width: '160px' }} />
              <col style={{ width: '120px' }} />
            </colgroup>
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="py-2 text-center">#</th>
                <th className="py-2 text-left">Órgão</th>
                <th className="py-2 text-right">Volume</th>
                <th className="py-2 text-right">Cotações</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.map((r) => (
                <tr key={r.posicao} className="hover:bg-accent/5">
                  <td className="py-3 text-center">{r.posicao}</td>
                  <td className="py-3">{r.nome}</td>
                  <td className="py-3 text-right font-medium">{formatarMoedaCompacta(r.volume)}</td>
                  <td className="py-3 text-right">{formatarNumero(r.cotacoes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
