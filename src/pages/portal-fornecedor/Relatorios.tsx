import { useEffect, useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { GraficoBarras } from '@/components/graficos/GraficoBarras';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { formatarMoeda, formatarNumero } from '@/lib/formatadores';

type ProposalRaw = any;

function groupByMonth(items: ProposalRaw[]) {
  const map: Record<string, { nome: string; faturamento: number; count: number }> = {};
  items.forEach(p => {
    const d = new Date(p.dataEnvio);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`;
    const nome = d.toLocaleString('pt-BR', { month: 'short', year: 'numeric' });
    const valor = Number(String(p.valorProposto).replace(/[^0-9.-]+/g, '')) || 0;
    if (!map[key]) map[key] = { nome, faturamento: 0, count: 0 };
    map[key].faturamento += valor;
    map[key].count += 1;
  });
  const keys = Object.keys(map).sort();
  return keys.map(k => ({ nome: map[k].nome, faturamento: Math.round(map[k].faturamento), propostas: map[k].count }));
}

export default function RelatoriosFornecedor() {
  const propostasKey = 'minhas_propostas';
  const [propostas, setPropostas] = useState<ProposalRaw[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportType, setReportType] = useState<'faturamento' | 'resumo' | 'status'>('faturamento');

  useEffect(() => {
    const raw = localStorage.getItem(propostasKey) || '[]';
    try { setPropostas(JSON.parse(raw)); } catch { setPropostas([]); }
  }, []);

  const filtered = useMemo(() => {
    return propostas.filter(p => {
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (new Date(p.dataEnvio) < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23,59,59,999);
        if (new Date(p.dataEnvio) > to) return false;
      }
      return true;
    });
  }, [propostas, dateFrom, dateTo]);

  const mensal = useMemo(() => groupByMonth(filtered), [filtered]);

  function exportCSV() {
    const headers = ['ID','Cotação','Título','Órgão','Valor','Prazo(dias)','Data','Status'];
    const rows = filtered.map(p => [p.id, p.cotacaoNumero, p.cotacaoTitulo, p.orgaoNome, (Number(String(p.valorProposto).replace(/[^0-9.-]+/g,''))||0).toString(), p.prazoDias, new Date(p.dataEnvio).toLocaleString(), p.status]);
    const csv = [headers, ...rows].map(r => r.map(cell => '"' + String(cell).replace(/"/g,'""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `relatorio_propostas_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function gerarHtmlPrint() {
    const now = new Date().toLocaleString();
    const rows = filtered.map(p => `
      <tr>
        <td style="padding:6px;border:1px solid #ddd">${p.id}</td>
        <td style="padding:6px;border:1px solid #ddd">${p.cotacaoNumero}</td>
        <td style="padding:6px;border:1px solid #ddd">${p.cotacaoTitulo}</td>
        <td style="padding:6px;border:1px solid #ddd">${p.orgaoNome}</td>
        <td style="padding:6px;border:1px solid #ddd;text-align:right">${formatarMoeda(Number(String(p.valorProposto).replace(/[^0-9.-]+/g,''))||0)}</td>
        <td style="padding:6px;border:1px solid #ddd">${p.prazoDias}</td>
        <td style="padding:6px;border:1px solid #ddd">${new Date(p.dataEnvio).toLocaleString()}</td>
        <td style="padding:6px;border:1px solid #ddd">${p.status}</td>
      </tr>
    `).join('');

    const mensalRows = mensal.map(m => `<tr><td style="padding:6px;border:1px solid #ddd">${m.nome}</td><td style="padding:6px;border:1px solid #ddd;text-align:right">${formatarMoeda(m.faturamento)}</td><td style="padding:6px;border:1px solid #ddd;text-align:right">${m.propostas}</td></tr>`).join('');

    return `<!doctype html><html><head><meta charset="utf-8"><title>Relatório Fornecedor</title><style>body{font-family:Inter,Arial,Helvetica,sans-serif;padding:20px}table{border-collapse:collapse;width:100%}th{background:#f7fafc;padding:8px;border:1px solid #ddd;text-align:left}td{padding:6px;border:1px solid #ddd}</style></head><body><header style="display:flex;justify-content:space-between"><div><h2>Relatório de Propostas</h2><div>Gerado em ${now}</div></div><div><strong>Período</strong><div>${dateFrom || '—'} → ${dateTo || '—'}</div></div></header><section style="margin-top:18px"><h3>Resumo Mensal</h3><table><thead><tr><th>Mês</th><th style="text-align:right">Faturamento</th><th style="text-align:right">Propostas</th></tr></thead><tbody>${mensalRows}</tbody></table></section><section style="margin-top:18px"><h3>Detalhes</h3><table><thead><tr><th>ID</th><th>Cotação</th><th>Título</th><th>Órgão</th><th style="text-align:right">Valor</th><th>Prazo</th><th>Data</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></section></body></html>`;
  }

  function printReport() {
    const html = gerarHtmlPrint();
    const w = window.open('', '_blank');
    if (!w) return alert('Não foi possível abrir nova aba.');
    w.document.write(html); w.document.close(); w.print();
  }

  const dadosGrafico = mensal.map(m => ({ nome: m.nome, faturamento: m.faturamento, propostas: m.propostas }));

  return (
    <div>
      <DashboardHeader titulo="Relatórios" subtitulo="Relatórios do fornecedor" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <label className="text-sm">Tipo:</label>
          <select className="px-2 py-1 border border-border rounded-md bg-secondary text-sm" value={reportType} onChange={(e) => setReportType(e.target.value as any)}>
            <option value="faturamento">Faturamento Mensal</option>
            <option value="resumo">Resumo</option>
            <option value="status">Propostas por Status</option>
          </select>

          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />

          <Button variant="secondary" size="sm" onClick={() => { setDateFrom(''); setDateTo(''); }}>Limpar</Button>
          <div className="flex-1" />
          <Button size="sm" onClick={exportCSV}>Exportar CSV</Button>
          <Button size="sm" variant="outline" onClick={printReport}>Imprimir / PDF</Button>
        </div>

        <div className="h-80">
          {reportType === 'faturamento' && (
            <GraficoBarras dados={dadosGrafico} barras={[{ chave: 'faturamento', nome: 'Faturamento', cor: '#4f46e5' }]} />
          )}
          {reportType === 'resumo' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-card rounded shadow-sm"><div className="text-sm text-muted-foreground">Total Propostas</div><div className="text-xl font-semibold">{formatarNumero(propostas.length)}</div></div>
              <div className="p-4 bg-card rounded shadow-sm"><div className="text-sm text-muted-foreground">Período Selecionado</div><div className="text-xl font-semibold">{dateFrom || '—'} → {dateTo || '—'}</div></div>
              <div className="p-4 bg-card rounded shadow-sm"><div className="text-sm text-muted-foreground">Faturamento Estimado</div><div className="text-xl font-semibold">{formatarMoeda(filtered.reduce((s, p) => s + (Number(String(p.valorProposto).replace(/[^0-9.-]+/g,''))||0), 0))}</div></div>
            </div>
          )}
          {reportType === 'status' && (
            <div className="space-y-2">
              {['enviada','aceito','concluida','retirada'].map(s => (
                <div key={s} className="p-3 bg-secondary rounded flex justify-between"><div>{s}</div><div>{filtered.filter(p=>p.status===s).length}</div></div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium">Detalhes</h4>
          <div className="overflow-auto mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cotação</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Órgão</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.cotacaoNumero}</TableCell>
                    <TableCell>{p.cotacaoTitulo}</TableCell>
                    <TableCell>{p.orgaoNome}</TableCell>
                    <TableCell>{formatarMoeda(Number(String(p.valorProposto).replace(/[^0-9.-]+/g,''))||0)}</TableCell>
                    <TableCell>{p.prazoDias}</TableCell>
                    <TableCell>{new Date(p.dataEnvio).toLocaleString()}</TableCell>
                    <TableCell>{p.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
