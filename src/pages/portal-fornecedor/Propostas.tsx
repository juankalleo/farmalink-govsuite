import { useEffect, useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { formatarMoeda } from '@/lib/formatadores';
import { rankingMedicamentos } from '@/lib/mock-dados';
import { Eye, Trash, Printer } from 'lucide-react';

type Proposta = {
  id: string;
  cotacaoId: number;
  cotacaoNumero: string;
  cotacaoTitulo: string;
  orgaoNome: string;
  valorProposto: string;
  prazoDias: string;
  mensagem: string;
  dataEnvio: string;
  status: string;
  cotacaoSnapshot: any;
};

export default function PropostasFornecedor() {
  const propostasKey = 'minhas_propostas';
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [selected, setSelected] = useState<Proposta | null>(null);
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'todos' | string>('todos');

  useEffect(() => {
    const raw = localStorage.getItem(propostasKey) || '[]';
    try {
      const parsed = JSON.parse(raw);
      setPropostas(parsed);
    } catch (e) {
      setPropostas([]);
    }
  }, []);

  function reload() {
    const raw = localStorage.getItem(propostasKey) || '[]';
    try { setPropostas(JSON.parse(raw)); } catch { setPropostas([]); }
  }

  function openDetails(p: Proposta) {
    setSelected(p);
    setOpen(true);
  }

  function withdraw(p: Proposta) {
    const raw = localStorage.getItem(propostasKey) || '[]';
    const arr = JSON.parse(raw);
    const updated = arr.map((x: any) => x.id === p.id ? { ...x, status: 'retirada' } : x);
    localStorage.setItem(propostasKey, JSON.stringify(updated));
    reload();
    setOpen(false);
  }

  function generateItemsFromSnapshot(c: any) {
    if (!c) return [];
    const maxItems = Math.min(20, Math.max(6, Math.floor((c.quantidadeItens || 60) / 3)));
    const meds = rankingMedicamentos.map(m => m.nome);
    return Array.from({ length: maxItems }).map((_, i) => {
      const nome = meds[i % meds.length] + (Math.random() > 0.5 ? ' - 500mg' : ' - 250mg');
      const quantidade = Math.max(1, Math.round(((c.quantidadeItens || 60) * (0.6 + Math.random() * 1.4)) / maxItems));
      const valorUnit = Math.max(1, Math.round(((c.valorEstimado || 100000) / Math.max(1, c.quantidadeItens || 60)) * (0.8 + Math.random() * 1.4)));
      return {
        codigo: `IT-${c.id}-${String(i + 1).padStart(3, '0')}`,
        nome,
        apresentacao: Math.random() > 0.5 ? 'Comprimido' : 'Cápsula',
        unidade: 'un',
        quantidade,
        valorUnit,
        valorTotal: quantidade * valorUnit,
        observacao: 'Conforme especificação técnica do edital',
      };
    });
  }

  function gerarEditalHtmlFromSnapshot(c: any, items: any[], proposta: Proposta) {
    const agora = new Date().toLocaleString();
    const rows = items.map(it => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd">${it.codigo}</td>
        <td style="padding:8px;border:1px solid #ddd">${it.nome}</td>
        <td style="padding:8px;border:1px solid #ddd">${it.apresentacao || ''}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right">${it.quantidade}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right">R$ ${it.valorUnit.toLocaleString('pt-BR')}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right">R$ ${it.valorTotal.toLocaleString('pt-BR')}</td>
        <td style="padding:8px;border:1px solid #ddd">${it.observacao || ''}</td>
      </tr>
    `).join('');

    const totalGeral = items.reduce((s, it) => s + (it.valorTotal || 0), 0);
    const valorFormatado = formatarMoeda(Number(proposta.valorProposto) || 0);
    const totalFormatado = formatarMoeda(totalGeral);

    return `<!doctype html><html><head><meta charset="utf-8"><title>Proposta ${proposta.id}</title><style>
      @page { size: A4; margin: 20mm }
      body{font-family:Inter,Arial,Helvetica,sans-serif;padding:28px;color:#111}
      h1{font-size:22px;margin:0}
      h2{margin-top:18px}
      table{border-collapse:collapse;width:100%;margin-top:12px}
      th{background:#f7fafc;padding:10px;border:1px solid #ddd;text-align:left}
      footer{margin-top:28px;font-size:13px;color:#555}
      @media print { body { -webkit-print-color-adjust: exact } }
    </style></head><body><header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div><img src='/iconfarmalink.png' style='height:40px;object-fit:contain' alt='NextFarma' /><div style="font-size:12px;color:#666;margin-top:6px">Proposta gerada em ${agora}</div></div><div style="text-align:right"><strong>Proposta:</strong> ${proposta.id}<br/><strong>Cotação:</strong> ${c.numero}<br/><strong>Órgão:</strong> ${c.orgaoNome}<br/><strong>Data Envio:</strong> ${new Date(proposta.dataEnvio).toLocaleString()}</div></header><h1>${c.titulo}</h1><p style="margin-top:8px">Proposta enviada: <strong>${valorFormatado}</strong> • Prazo: ${proposta.prazoDias} dias</p><section><h2>Itens (estimados)</h2><table><thead><tr><th>Código</th><th>Item</th><th>Apresentação</th><th style="text-align:right">Qtd.</th><th style="text-align:right">Valor Unit.</th><th style="text-align:right">Valor Total</th><th>Observação</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="5" style="padding:8px;border:1px solid #ddd;text-align:right"><strong>Total Geral</strong></td><td style="padding:8px;border:1px solid #ddd;text-align:right"><strong>${totalFormatado}</strong></td><td style="border:1px solid #ddd"></td></tr></tfoot></table></section><section><h2>Mensagem do Fornecedor</h2><p>${proposta.mensagem || ''}</p></section><footer><div style="display:flex;justify-content:space-between;align-items:center"><div><strong>Informações do Fornecedor</strong><div>Empresa: (seu cadastro)<br/>Contato: (seu email)</div></div><div style="text-align:right">Assinatura<br/><br/>_________________________<br/>Representante</div></div></footer></body></html>`;
  }

  function imprimirProposta(p: Proposta) {
    const c = p.cotacaoSnapshot;
    const items = generateItemsFromSnapshot(c);
    const html = gerarEditalHtmlFromSnapshot(c, items, p);
    const w = window.open('', '_blank');
    if (!w) return alert('Não foi possível abrir nova aba.');
    w.document.write(html);
    w.document.close();
    w.print();
  }

  function downloadAttachment(a: any) {
    // dataUrl is safe to use as href
    const w = window.open(a.dataUrl, '_blank');
    if (!w) alert('Não foi possível abrir o anexo.');
  }

  return (
    <div>
      <DashboardHeader titulo="Minhas Propostas" subtitulo="Histórico de propostas enviadas" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div />
          <div className="flex items-center gap-2">
            <label className="text-sm">Filtrar por status:</label>
            <select className="px-2 py-1 border border-border rounded-md bg-secondary text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="enviada">Enviado</option>
              <option value="aceito">Aceito</option>
              <option value="concluida">Concluído</option>
              <option value="retirada">Retirado</option>
            </select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cotação</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Órgão</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Prazo (dias)</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propostas
              .filter(p => statusFilter === 'todos' ? true : p.status === statusFilter)
              .map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.cotacaoNumero}</TableCell>
                <TableCell>{p.cotacaoTitulo}</TableCell>
                <TableCell>{p.orgaoNome}</TableCell>
                <TableCell>{formatarMoeda(Number(p.valorProposto) || 0)}</TableCell>
                <TableCell>{p.prazoDias}</TableCell>
                <TableCell>{new Date(p.dataEnvio).toLocaleString()}</TableCell>
                <TableCell>{p.status}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openDetails(p)}><Eye className="mr-1" />Ver</Button>
                    <Button size="sm" variant="secondary" onClick={() => imprimirProposta(p)}><Printer className="mr-1" />Imprimir</Button>
                    {p.attachments && p.attachments.length > 0 && (
                      <div className="flex items-center gap-1">
                        {p.attachments.map((a:any, i:number) => (
                          <a key={i} href={a.dataUrl} download={a.name} className="text-sm text-primary">{a.name}</a>
                        ))}
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes da Proposta</DialogTitle>
              <DialogDescription>Visualize os dados da proposta enviada.</DialogDescription>
            </DialogHeader>

            {selected && (
              <div className="mt-4 space-y-3">
                <div>
                  <h4 className="font-medium">Proposta {selected.id} — {selected.cotacaoNumero}</h4>
                  <p className="text-sm text-muted-foreground">{selected.cotacaoTitulo}</p>
                </div>

                <div>
                  <p><strong>Órgão:</strong> {selected.orgaoNome}</p>
                  <p><strong>Valor proposto:</strong> {formatarMoeda(Number(selected.valorProposto) || 0)}</p>
                  <p><strong>Prazo:</strong> {selected.prazoDias} dias</p>
                  <p><strong>Enviada em:</strong> {new Date(selected.dataEnvio).toLocaleString()}</p>
                </div>

                <div>
                  <h5 className="font-medium">Mensagem</h5>
                  <p className="text-sm">{selected.mensagem}</p>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Fechar</Button>
                  <Button size="sm" variant="outline" onClick={() => imprimirProposta(selected)}><Printer className="mr-1" />Imprimir / PDF</Button>
                  {selected.status !== 'retirada' && <Button size="sm" variant="destructive" onClick={() => withdraw(selected)}><Trash className="mr-1" />Retirar</Button>}
                </div>

              </div>
            )}

            <DialogFooter />
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
