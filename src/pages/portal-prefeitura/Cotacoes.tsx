import { useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Cotacao, Proposta } from '@/types';
import { format } from 'date-fns';
import { PlusCircle, Eye, Check } from 'lucide-react';

function sampleId() {
  return Math.random().toString(36).slice(2, 9);
}

const initial: Cotacao[] = [
  {
    id: 'c1',
    numero: 'CT-2026-001',
    titulo: 'Compra de Dipirona 500mg',
    status: 'publicada',
    dataCriacao: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    dataLimite: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    valorEstimado: 50000,
    orgaoId: 'o1',
    orgaoNome: 'Prefeitura Municipal',
    quantidadeItens: 3,
    propostas: 2,
  },
  {
    id: 'c2',
    numero: 'CT-2026-002',
    titulo: 'Suprimentos hospitalares básicos',
    status: 'em_analise',
    dataCriacao: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    dataLimite: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    valorEstimado: 120000,
    orgaoId: 'o1',
    orgaoNome: 'Prefeitura Municipal',
    quantidadeItens: 8,
    propostas: 1,
  },
];

type PropostaEx = Proposta & { attachments?: { id: string; nome: string; tipo: string; url?: string }[] };

const sampleProposals: Record<string, PropostaEx[]> = {
  c1: [
    { id: 'p1', cotacaoId: 'c1', fornecedorId: 'f1', fornecedorNome: 'Distribuidora A', valorTotal: 48000, dataEnvio: new Date(), status: 'enviada', prazoEntrega: 5, attachments: [{ id: 'a1', nome: 'PlanilhaOrcamento.xlsx', tipo: 'planilha' }, { id: 'a2', nome: 'TermoDeReferencia.pdf', tipo: 'termo' }] },
    { id: 'p2', cotacaoId: 'c1', fornecedorId: 'f2', fornecedorNome: 'Farmacia B', valorTotal: 49500, dataEnvio: new Date(), status: 'enviada', prazoEntrega: 7, attachments: [{ id: 'a3', nome: 'PropostaDetalhada.pdf', tipo: 'contrato' }] },
  ],
  c2: [
    { id: 'p3', cotacaoId: 'c2', fornecedorId: 'f3', fornecedorNome: 'Fornecedor C', valorTotal: 118000, dataEnvio: new Date(), status: 'enviada', prazoEntrega: 10, attachments: [] },
  ],
};

export default function Cotacoes() {
  const [cotacoes, setCotacoes] = useState<Cotacao[]>(initial);
  const [propostasMap, setPropostasMap] = useState<Record<string, PropostaEx[]>>(sampleProposals);

  const [openCreate, setOpenCreate] = useState(false);
  const [newTitulo, setNewTitulo] = useState('');
  const [newValor, setNewValor] = useState('');
  const [newDataLimite, setNewDataLimite] = useState('');

  const [viewPropostasFor, setViewPropostasFor] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<PropostaEx | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [valorMin, setValorMin] = useState('');
  const [valorMax, setValorMax] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  function handleCreate() {
    const id = sampleId();
    const numero = `CT-2026-${(Math.floor(Math.random() * 900) + 100).toString()}`;
    const cot: Cotacao = {
      id,
      numero,
      titulo: newTitulo || 'Nova Cotação',
      status: 'publicada',
      dataCriacao: new Date(),
      dataLimite: newDataLimite ? new Date(newDataLimite) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      valorEstimado: Number(newValor) || 0,
      orgaoId: 'o1',
      orgaoNome: 'Prefeitura Municipal',
      quantidadeItens: 1,
      propostas: 0,
    };
    setCotacoes((s) => [cot, ...s]);
    setPropostasMap((m) => ({ ...m, [id]: [] }));
    setOpenCreate(false);
    setNewTitulo('');
    setNewValor('');
    setNewDataLimite('');
  }

  function handleGenerateProposals(cotacaoId: string) {
    // generation of simulated proposals is disabled in the Prefeitura portal
    return;
  }

  function handleSelectWinner(cotacaoId: string, propostaId: string) {
    setPropostasMap((m) => {
      const arr = (m[cotacaoId] || []).map(p => p.id === propostaId ? { ...p, status: 'vencedora' } : { ...p, status: p.status === 'vencedora' ? 'recusada' : p.status });
      return { ...m, [cotacaoId]: arr };
    });
    setCotacoes((s) => s.map(c => c.id === cotacaoId ? { ...c, status: 'adjudicada', valorFinal: (propostasMap[cotacaoId] || []).find(p => p.id === propostaId)?.valorTotal } : c));
  }

  const rows = useMemo(() => {
    let out = cotacoes.slice();
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(c => c.titulo.toLowerCase().includes(q) || c.numero.toLowerCase().includes(q) || c.orgaoNome.toLowerCase().includes(q));
    }
    if (filterStatus) out = out.filter(c => c.status === filterStatus);
    if (dateFrom) out = out.filter(c => new Date(c.dataCriacao) >= new Date(dateFrom));
    if (dateTo) out = out.filter(c => new Date(c.dataCriacao) <= new Date(dateTo));
    if (valorMin && !Number.isNaN(Number(valorMin))) out = out.filter(c => (c.valorEstimado || 0) >= Number(valorMin));
    if (valorMax && !Number.isNaN(Number(valorMax))) out = out.filter(c => (c.valorEstimado || 0) <= Number(valorMax));
    return out;
  }, [cotacoes, search, filterStatus, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <DashboardHeader titulo="Cotações" subtitulo="Gerencie cotações: criar, receber propostas e adjudicar vencedores" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
            <Input placeholder="Pesquisar por número, título ou órgão" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            <select className="h-10 rounded-md border px-2" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
              <option value="">Todos os status</option>
              <option value="publicada">Publicada</option>
              <option value="em_analise">Em análise</option>
              <option value="adjudicada">Adjudicada</option>
            </select>
            <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} />
            <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} />
            <Input placeholder="Valor mínimo" type="number" value={valorMin} onChange={(e) => { setValorMin(e.target.value); setPage(1); }} className="w-36" />
            <Input placeholder="Valor máximo" type="number" value={valorMax} onChange={(e) => { setValorMax(e.target.value); setPage(1); }} className="w-36" />
          </div>
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm"><PlusCircle className="mr-2" /> Nova Cotação</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Cotação</DialogTitle>
                <DialogDescription>Preencha os dados básicos para publicar uma cotação.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 mt-4">
                <label className="text-sm">Título</label>
                <Input value={newTitulo} onChange={(e) => setNewTitulo(e.target.value)} />
                <label className="text-sm">Valor Estimado (R$)</label>
                <Input value={newValor} onChange={(e) => setNewValor(e.target.value)} type="number" />
                <label className="text-sm">Data Limite</label>
                <Input value={newDataLimite} onChange={(e) => setNewDataLimite(e.target.value)} type="date" />
              </div>
              <DialogFooter>
                <Button variant="secondary" size="sm" onClick={() => setOpenCreate(false)}>Cancelar</Button>
                <Button size="sm" onClick={handleCreate}>Criar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Órgão</TableHead>
              <TableHead>Criação</TableHead>
              <TableHead>Limite</TableHead>
              <TableHead>Estimado</TableHead>
              <TableHead>Propostas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.numero}</TableCell>
                <TableCell className="max-w-xs truncate">{r.titulo}</TableCell>
                <TableCell>{r.orgaoNome}</TableCell>
                <TableCell>{format(r.dataCriacao, 'yyyy-MM-dd')}</TableCell>
                <TableCell>{format(r.dataLimite, 'yyyy-MM-dd')}</TableCell>
                <TableCell>R$ {r.valorEstimado.toLocaleString()}</TableCell>
                <TableCell>{r.propostas}</TableCell>
                <TableCell className="capitalize">{r.status.replace('_', ' ')}</TableCell>
                <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setViewPropostasFor(r.id)}><Eye className="mr-1" />Propostas</Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">Mostrando {Math.min(rows.length, (page-1)*pageSize+1)}–{Math.min(page*pageSize, rows.length)} de {rows.length} cotações</div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" disabled={page<=1} onClick={() => setPage(p => Math.max(1, p-1))}>Anterior</Button>
            <div className="px-2">{page} / {totalPages}</div>
            <Button size="sm" variant="ghost" disabled={page>=totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>Próxima</Button>
          </div>
        </div>
      </div>

      {/* Proposals dialog */}
      <Dialog open={!!viewPropostasFor} onOpenChange={(v) => !v && setViewPropostasFor(null)}>
            <DialogContent className="w-full max-w-4xl">
              <DialogHeader>
                <DialogTitle>Propostas</DialogTitle>
                <DialogDescription>Propostas recebidas para a cotação selecionada.</DialogDescription>
              </DialogHeader>
              <div className="mt-4 flex gap-4">
                <div className="w-1/2 max-h-[60vh] overflow-auto space-y-3">
                  {viewPropostasFor && (propostasMap[viewPropostasFor] || []).length === 0 && (
                    <div className="p-4 text-sm">Nenhuma proposta recebida.</div>
                  )}

                  {viewPropostasFor && (propostasMap[viewPropostasFor] || []).length > 0 && (
                    <div className="space-y-2">
                      {(propostasMap[viewPropostasFor] || []).map(p => (
                        <div key={p.id} className={`p-3 border rounded-md cursor-pointer ${selectedProposal?.id === p.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedProposal(p)}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{p.fornecedorNome}</div>
                              <div className="text-sm text-muted-foreground">Valor: R$ {p.valorTotal.toLocaleString()} • Prazo: {p.prazoEntrega} dias</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm">{p.status}</div>
                              <div className="text-xs text-muted-foreground">Enviado: {format(p.dataEnvio, 'yyyy-MM-dd')}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-1/2 border-l pl-4">
                  {selectedProposal ? (
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{selectedProposal.fornecedorNome}</h3>
                          <div className="text-sm text-muted-foreground">Valor: R$ {selectedProposal.valorTotal.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Prazo de entrega: {selectedProposal.prazoEntrega} dias</div>
                          <div className="text-sm text-muted-foreground">Status: {selectedProposal.status}</div>
                        </div>
                        <div>
                          {selectedProposal.status === 'vencedora' ? <span className="text-success font-semibold">Vencedora</span> : (
                            <Button size="sm" onClick={() => { if (viewPropostasFor) handleSelectWinner(viewPropostasFor, selectedProposal.id); }}>Selecionar como Vencedora</Button>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium">Documentos Anexados</h4>
                        {selectedProposal.attachments && selectedProposal.attachments.length > 0 ? (
                          <ul className="mt-2 space-y-2">
                            {selectedProposal.attachments.map(a => (
                              <li key={a.id} className="flex items-center justify-between border p-2 rounded">
                                <div>
                                  <div className="font-medium">{a.nome}</div>
                                  <div className="text-xs text-muted-foreground">{a.tipo}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" onClick={() => { if (a.url) window.open(a.url, '_blank'); else alert('Arquivo de exemplo (sem URL)'); }}>Abrir</Button>
                                  <Button size="sm" variant="ghost" onClick={() => alert('Download simulado')}>Baixar</Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-3 text-sm text-muted-foreground">Nenhum documento anexado.</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground">Selecione uma proposta para ver detalhes e anexos.</div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="secondary" size="sm" onClick={() => { setViewPropostasFor(null); setSelectedProposal(null); }}>Fechar</Button>
              </DialogFooter>
            </DialogContent>
      </Dialog>
    </div>
  );
}
