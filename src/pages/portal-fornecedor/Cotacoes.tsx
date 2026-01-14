import { useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cotacoesMock, rankingMedicamentos } from '@/lib/mock-dados';
import { Cotacao } from '@/types';
import { formatarMoeda } from '@/lib/formatadores';
import { Eye, Send, Paperclip, X } from 'lucide-react';

export default function CotacoesFornecedor() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orgaoFilter, setOrgaoFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [valorMin, setValorMin] = useState('');
  const [valorMax, setValorMax] = useState('');
  const [selected, setSelected] = useState<Cotacao | null>(null);
  const [propostaOpen, setPropostaOpen] = useState(false);
  const [valor, setValor] = useState('');
  const [prazo, setPrazo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [attachments, setAttachments] = useState<Array<{ name: string; type: string; size: number; dataUrl: string }>>([]);

  // fornecedores see only published or em_analise
  const disponiveis = useMemo(() => cotacoesMock.filter(c => ['publicada','em_analise'].includes(c.status)), []);

  const filtered = useMemo(() => {
    return disponiveis.filter(c => {
      if (query && !(c.numero.includes(query) || c.titulo.toLowerCase().includes(query.toLowerCase()) || c.orgaoNome.toLowerCase().includes(query.toLowerCase()))) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (orgaoFilter && !c.orgaoNome.toLowerCase().includes(orgaoFilter.toLowerCase())) return false;
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (c.dataLimite < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        // include full day
        to.setHours(23,59,59,999);
        if (c.dataLimite > to) return false;
      }
      if (valorMin) {
        const min = Number(valorMin);
        if ((c.valorEstimado || 0) < min) return false;
      }
      if (valorMax) {
        const max = Number(valorMax);
        if ((c.valorEstimado || 0) > max) return false;
      }
      return true;
    });
  }, [disponiveis, query, statusFilter, orgaoFilter, dateFrom, dateTo, valorMin, valorMax]);

  function openDetalhes(c: Cotacao) {
    // toggle details: close if clicking the same cotação again
    setSelected((prev) => (prev && prev.id === c.id ? null : c));
  }

  function openProposta(c: Cotacao) {
    setSelected(c); setPropostaOpen(true); setValor(''); setPrazo(''); setMensagem('');
    setAttachments([]);
  }

  function enviarProposta() {
    if (!selected) return;
    const propostasKey = 'minhas_propostas';
    const existing = JSON.parse(localStorage.getItem(propostasKey) || '[]');
    const proposal = {
      id: `PR-${Date.now()}`,
      cotacaoId: selected.id,
      cotacaoNumero: selected.numero,
      cotacaoTitulo: selected.titulo,
      orgaoNome: selected.orgaoNome,
      valorProposto: valor,
      prazoDias: prazo,
      mensagem,
      dataEnvio: new Date().toISOString(),
      status: 'enviada',
      cotacaoSnapshot: {
        id: selected.id,
        numero: selected.numero,
        titulo: selected.titulo,
        orgaoNome: selected.orgaoNome,
        quantidadeItens: selected.quantidadeItens,
        valorEstimado: selected.valorEstimado,
        dataLimite: selected.dataLimite,
      }
    ,
      attachments
    };
    existing.unshift(proposal);
    localStorage.setItem(propostasKey, JSON.stringify(existing));
    // reflect locally
    setSelected((prev) => prev ? { ...prev, propostas: (prev.propostas || 0) + 1 } : prev);
    alert('Proposta enviada com sucesso.');
    setPropostaOpen(false);
  }

  function generateItems(c?: Cotacao) {
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

  function handleFiles(files?: FileList | null) {
    if (!files) return;
    const arr = Array.from(files);
    const readers = arr.map(f => new Promise<{ name:string; type:string; size:number; dataUrl:string }>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res({ name: f.name, type: f.type, size: f.size, dataUrl: String(r.result) });
      r.onerror = rej;
      r.readAsDataURL(f);
    }));
    Promise.all(readers).then(results => setAttachments(prev => [...prev, ...results]));
  }

  function removeAttachment(idx: number) {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  }

  function gerarEditalHtml(c: Cotacao, items: any[]) {
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

    return `<!doctype html><html><head><meta charset="utf-8"><title>Edital ${c.numero}</title><style>body{font-family:Inter,Arial,Helvetica,sans-serif;padding:28px;color:#111}h1{font-size:22px;margin:0}h2{margin-top:18px}table{border-collapse:collapse;width:100%;margin-top:12px}th{background:#f7fafc;padding:10px;border:1px solid #ddd;text-align:left}footer{margin-top:28px;font-size:13px;color:#555}</style></head><body><header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div><img src='/iconfarmalink.png' style='height:40px;object-fit:contain' alt='NextFarma' /><div style="font-size:12px;color:#666;margin-top:6px">Edital gerado em ${agora}</div></div><div style="text-align:right"><strong>Cotação:</strong> ${c.numero}<br/><strong>Órgão:</strong> ${c.orgaoNome}<br/><strong>Data Limite:</strong> ${c.dataLimite.toLocaleDateString()}</div></header><h1>${c.titulo}</h1><p style="margin-top:8px">Este é um edital mockup gerado para demonstração. Contém especificações técnicas resumidas, itens estimados e condições comerciais. Os valores são estimativas para fins de teste.</p><section><h2>Dados da Cotação</h2><p><strong>Valor estimado:</strong> R$ ${c.valorEstimado.toLocaleString('pt-BR')} • <strong>Quantidade de itens estimada:</strong> ${c.quantidadeItens}</p></section><section><h2>Itens</h2><table><thead><tr><th>Código</th><th>Item</th><th>Apresentação</th><th style="text-align:right">Qtd.</th><th style="text-align:right">Valor Unit.</th><th style="text-align:right">Valor Total</th><th>Observação</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="5" style="padding:8px;border:1px solid #ddd;text-align:right"><strong>Total Geral</strong></td><td style="padding:8px;border:1px solid #ddd;text-align:right"><strong>R$ ${totalGeral.toLocaleString('pt-BR')}</strong></td><td style="border:1px solid #ddd"></td></tr></tfoot></table></section><section><h2>Especificações Técnicas</h2><p>Os produtos deverão atender às normas da Anvisa e apresentar registro quando aplicável. Embalagens devem estar adequadas ao transporte e ao armazenamento, com rotulagem legível e lote.</p></section><section><h2>Criterios de Julgamento</h2><ol><li>Menor preço por item, atendendo às especificações.</li><li>Prazo de entrega compatível com necessidades do órgão.</li><li>Condições de garantia e assistência técnica.</li></ol></section><section><h2>Anexos</h2><p>Documentos contratuais e termo de referência (mock) disponíveis mediante solicitação.</p></section><footer><div style="display:flex;justify-content:space-between;align-items:center"><div><strong>Informações de contato</strong><div>Setor de Compras - ${c.orgaoNome}<br/>Email: compras@${(c.orgaoNome||'orgao').toLowerCase().replace(/\s+/g,'')}.gov.br • Telefone: (00) 0000-0000</div></div><div style="text-align:right">Assinatura responsável<br/><br/>_________________________<br/>Gestor de Compras</div></div></footer></body></html>`;
  }

  const items = generateItems(selected || undefined);

  function downloadEdital() {
    if (!selected) return;
    const html = gerarEditalHtml(selected, items);
    const w = window.open('', '_blank');
    if (!w) return alert('Não foi possível abrir nova aba.');
    w.document.write(html);
    w.document.close();
  }

  return (
    <div>
      <DashboardHeader titulo="Cotações Disponíveis" subtitulo="Participe das cotações públicas" />

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Input placeholder="Buscar por número, título ou órgão" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <div className="flex items-center gap-2">
            <select className="px-2 py-1 border border-border rounded-md bg-secondary text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos</option>
              <option value="publicada">Publicada</option>
              <option value="em_analise">Em Análise</option>
              <option value="adjudicada">Adjudicada</option>
              <option value="concluida">Concluída</option>
            </select>

            <Input placeholder="Órgão" value={orgaoFilter} onChange={(e) => setOrgaoFilter(e.target.value)} className="w-48" />

            <input type="date" className="px-2 py-1 border border-border rounded-md bg-secondary text-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <input type="date" className="px-2 py-1 border border-border rounded-md bg-secondary text-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />

            <Input placeholder="Valor mín." value={valorMin} onChange={(e) => setValorMin(e.target.value)} className="w-28" />
            <Input placeholder="Valor máx." value={valorMax} onChange={(e) => setValorMax(e.target.value)} className="w-28" />

            <Button size="sm" variant="secondary" onClick={() => { setStatusFilter('all'); setOrgaoFilter(''); setDateFrom(''); setDateTo(''); setValorMin(''); setValorMax(''); }}>Limpar</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Órgão</TableHead>
              <TableHead>Valor Estimado</TableHead>
              <TableHead>Data Limite</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.numero}</TableCell>
                <TableCell>{c.titulo}</TableCell>
                <TableCell>{c.orgaoNome}</TableCell>
                <TableCell>{formatarMoeda(c.valorEstimado)}</TableCell>
                <TableCell>{c.dataLimite.toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openDetalhes(c)}><Eye className="mr-1" />Detalhes</Button>
                    <Button size="sm" onClick={() => openProposta(c)}><Send className="mr-1" />Propor</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detalhes ricos abaixo da tabela */}
      {selected && (
        <div className="p-6 border-t space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{selected.numero} — {selected.titulo}</h3>
              <p className="text-sm text-muted-foreground">Órgão: {selected.orgaoNome} • Itens estimados: {selected.quantidadeItens} • Propostas: {selected.propostas}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => downloadEdital()}>Abrir Edital</Button>
              <Button size="sm" onClick={() => { const html = gerarEditalHtml(selected, items); const w = window.open('', '_blank'); if (!w) return alert('Não foi possível abrir nova aba.'); w.document.write(html); w.document.close(); w.print(); }}>Imprimir Edital</Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium">Descrição</h4>
            <p className="text-sm mt-1">Este é um edital mock para a cotação <strong>{selected.numero}</strong>. Contém a lista de itens estimados, condições gerais de entrega, prazos e observações técnicas que servem como exemplo para demonstração do fluxo de propostas.</p>
          </div>

          <div>
            <h4 className="font-medium">Itens</h4>
            <div className="overflow-auto mt-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="pb-2">Código</th>
                    <th className="pb-2">Item</th>
                    <th className="pb-2 text-right">Qtd.</th>
                    <th className="pb-2 text-right">Valor Est.</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(it => (
                    <tr key={it.codigo} className="border-t">
                      <td className="py-2">{it.codigo}</td>
                      <td className="py-2">{it.nome}</td>
                      <td className="py-2 text-right">{it.quantidade}</td>
                      <td className="py-2 text-right">R$ {it.valorUnit.toLocaleString('pt-BR')}</td>
                      <td className="py-2 text-right">R$ {it.valorTotal.toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <Dialog open={propostaOpen} onOpenChange={(v) => setPropostaOpen(v)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Proposta</DialogTitle>
            <DialogDescription>Envie sua proposta para a cotação {selected?.numero}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 mt-4">
            <label className="text-sm">Valor Proposto</label>
            <Input value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" />
            <label className="text-sm">Prazo de Entrega (dias)</label>
            <Input value={prazo} onChange={(e) => setPrazo(e.target.value)} placeholder="Ex: 7" />
            <label className="text-sm">Mensagem</label>
            <Textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Observações sobre a proposta" />
            <label className="text-sm">Anexos (contratos, termos, planilhas)</label>
            <div className="flex items-center gap-2">
              <input type="file" multiple onChange={(e) => handleFiles(e.target.files)} />
              <div className="text-sm text-muted-foreground flex items-center gap-2"><Paperclip /> <span>{attachments.length} anexos</span></div>
            </div>
            {attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {attachments.map((a, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 bg-secondary p-2 rounded">
                    <div className="truncate">
                      <strong className="mr-2">{a.name}</strong>
                      <span className="text-xs text-muted-foreground">{Math.round(a.size/1024)} KB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={a.dataUrl} download={a.name} className="text-sm text-primary">Download</a>
                      <button className="p-1" onClick={() => removeAttachment(i)} title="Remover anexo"><X className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="secondary" size="sm" onClick={() => setPropostaOpen(false)}>Cancelar</Button>
            <Button size="sm" onClick={enviarProposta}>Enviar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
