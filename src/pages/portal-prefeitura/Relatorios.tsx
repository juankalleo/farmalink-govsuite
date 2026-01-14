import { CardIndicador } from '@/components/indicadores/CardIndicador';
import { ContainerGrafico } from '@/components/graficos/ContainerGrafico';
import { GraficoLinha } from '@/components/graficos/GraficoLinha';
import { GraficoBarras } from '@/components/graficos/GraficoBarras';
import { GraficoPizza } from '@/components/graficos/GraficoPizza';
import { TabelaRanking } from '@/components/tabelas/TabelaRanking';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import {
  dadosOrcamentoMensal,
  dadosPorCentroCusto,
  consumoMedicamentosPeriodo,
  rankingMedicamentos,
  participacaoPorOrgao,
  comparativoPrecos,
} from '@/lib/mock-dados';
import { formatarMoeda, formatarNumero } from '@/lib/formatadores';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { useCallback, useState, useRef } from 'react';

export default function Relatorios() {
  type ReportType = 'geral' | 'ranking' | 'comparativo' | 'orcamento' | 'centros' | 'consumo';
  const [reportType, setReportType] = useState<ReportType>('geral');
  type ReportPeriod = 'hoje' | '3m' | '6m' | '1y';
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('3m');
  const totalPrevisto = dadosOrcamentoMensal.reduce((s, d) => s + (d.previsto as number), 0);
  const totalExecutado = dadosOrcamentoMensal.reduce((s, d) => s + (d.executado as number), 0);
  const economiaTotal = dadosPorCentroCusto.reduce((s, d) => s + (d.economia as number), 0);

  const exportCSV = useCallback((data: any[], baseName: string) => {
    if (!data || data.length === 0) {
      alert('Sem dados para exportar');
      return;
    }
    const keys = Array.from(new Set(data.flatMap(d => Object.keys(d))));
    const rows = [keys.join(',')];
    data.forEach((item) => {
      const row = keys.map(k => {
        const v = item[k];
        if (v === null || v === undefined) return '';
        const s = typeof v === 'number' ? String(v) : String(v).replace(/"/g, '""');
        return `"${s}"`;
      }).join(',');
      rows.push(row);
    });
    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const exportCurrentCSV = useCallback(() => {
    switch (reportType) {
      case 'ranking':
        exportCSV(rankingMedicamentos, `ranking_medicamentos_${reportPeriod}`);
        break;
      case 'comparativo':
        exportCSV(comparativoPrecos as any, `comparativo_precos_${reportPeriod}`);
        break;
      case 'orcamento':
        exportCSV(dadosOrcamentoMensal as any, `orcamento_mensal_${reportPeriod}`);
        break;
      case 'centros':
        exportCSV(dadosPorCentroCusto as any, `centros_custo_${reportPeriod}`);
        break;
      case 'consumo':
        exportCSV(consumoMedicamentosPeriodo as any, `consumo_medicamentos_${reportPeriod}`);
        break;
      case 'geral':
      default:
        exportCSV(rankingMedicamentos, `relatorio_geral_ranking_${reportPeriod}`);
        break;
    }
  }, [reportType, exportCSV]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const exportPDF = useCallback((type?: ReportType, period?: ReportPeriod) => {
    const t: ReportType = (type ?? reportType) as ReportType;
    const p: ReportPeriod = (period ?? reportPeriod) as ReportPeriod;
    const now = new Date();
    const title = `Relatório - NextFarma - ${now.toLocaleDateString()}`;
    const headerHtml = `
      <div class="header">
        <div>
          <div class="brand">NextFarma</div>
          <div class="meta">Relatório — ${now.toLocaleString()}</div>
          <div class="meta">Período: ${p}</div>
        </div>
        <div>
          <h1>${t === 'geral' ? 'Relatórios Financeiros & Operacionais' : 'Relatório: ' + t}</h1>
        </div>
      </div>
    `;

    const styles = `
      body { font-family: Arial, sans-serif; margin: 24px; color: #111827 }
      .header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px }
      .brand { font-family: Poppins, sans-serif; font-size:20px; font-weight:700 }
      h1 { margin:0; font-size:18px }
      .meta { color:#6b7280; font-size:12px }
      .section { margin-top:18px }
      .card { border:1px solid #e5e7eb; padding:12px; border-radius:8px; background:#fff; min-width:160px }
      table { width:100%; border-collapse:collapse; margin-top:8px }
      th, td { border:1px solid #e5e7eb; padding:8px; text-align:left; font-size:12px }
      th { background:#f9fafb; font-weight:600 }
    `;

    let bodyHtml = '';

    switch (t) {
      case 'ranking':
        bodyHtml = `
          <div class="section">
            <h3>Ranking de Medicamentos mais Comprados</h3>
            <table>
              <thead><tr><th>#</th><th>Medicamento</th><th>Quantidade</th><th>Valor (R$)</th></tr></thead>
              <tbody>
                ${rankingMedicamentos.map(r => `<tr><td>${r.posicao}</td><td>${r.nome}</td><td>${formatarNumero(r.quantidade)}</td><td>${formatarMoeda(r.valor)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;

      case 'comparativo':
        bodyHtml = `
          <div class="section">
            <h3>Comparativo de Preços por Cotação</h3>
            <table>
              <thead><tr><th>Cotação</th><th>Ofertado</th><th>Vencedor</th></tr></thead>
              <tbody>
                ${comparativoPrecos.map(c => `<tr><td>${c.nome}</td><td>${formatarMoeda(c.ofertado as number)}</td><td>${formatarMoeda(c.vencedor as number)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;

      case 'orcamento':
        bodyHtml = `
          <div class="section">
            <h3>Orçamento Mensal</h3>
            <table>
              <thead><tr><th>Mês</th><th>Previsto</th><th>Executado</th></tr></thead>
              <tbody>
                ${dadosOrcamentoMensal.map(d => `<tr><td>${d.mes}</td><td>${formatarMoeda(d.previsto as number)}</td><td>${formatarMoeda(d.executado as number)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;

      case 'centros':
        bodyHtml = `
          <div class="section">
            <h3>Economia por Centro de Custo</h3>
            <table>
              <thead><tr><th>Centro</th><th>Previsto</th><th>Executado</th><th>Economia</th></tr></thead>
              <tbody>
                ${dadosPorCentroCusto.map(c => `<tr><td>${c.centro}</td><td>${formatarMoeda(c.previsto as number)}</td><td>${formatarMoeda(c.executado as number)}</td><td>${formatarMoeda(c.economia as number)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;

      case 'consumo':
        bodyHtml = `
          <div class="section">
            <h3>Consumo de Medicamentos (Últimos 6 meses)</h3>
            <table>
              <thead><tr><th>Categoria</th><th>Total (6m)</th></tr></thead>
              <tbody>
                ${consumoMedicamentosPeriodo.map(item => {
                  const total = ['jan','fev','mar','abr','mai','jun'].reduce((s,k) => s + (Number((item as any)[k])||0), 0);
                  return `<tr><td>${(item as any).categoria || (item as any).nome || ''}</td><td>${formatarNumero(total)}</td></tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;

      case 'geral':
      default:
        bodyHtml = `
          <div class="section">
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <div class="card"><strong>Orçamento Previsto (ano)</strong><div>${formatarMoeda(totalPrevisto)}</div></div>
              <div class="card"><strong>Executado (ano)</strong><div>${formatarMoeda(totalExecutado)}</div></div>
              <div class="card"><strong>Economia por Centros</strong><div>${formatarMoeda(economiaTotal)}</div></div>
            </div>
          </div>

          <div class="section">
            <h3>Ranking de Medicamentos mais Comprados</h3>
            <table>
              <thead><tr><th>#</th><th>Medicamento</th><th>Quantidade</th><th>Valor (R$)</th></tr></thead>
              <tbody>
                ${rankingMedicamentos.map(r => `<tr><td>${r.posicao}</td><td>${r.nome}</td><td>${formatarNumero(r.quantidade)}</td><td>${formatarMoeda(r.valor)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;
    }

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>${styles}</style>
        </head>
        <body>
          ${headerHtml}
          ${bodyHtml}
        </body>
      </html>
    `;

    // show preview in dialog iframe; user can print/save from browser
    setPreviewHtml(html);
    setPreviewOpen(true);
  }, [reportType, totalPrevisto, totalExecutado, economiaTotal, rankingMedicamentos, comparativoPrecos, dadosOrcamentoMensal, dadosPorCentroCusto, consumoMedicamentosPeriodo]);

  return (
    <div>
      <DashboardHeader titulo="Relatórios" subtitulo="Relatórios e exportações" />

      <div className="p-6 space-y-6">
          <div className="flex items-center justify-between gap-2">
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm">Exportar</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-96 max-w-[92vw]">
                    <DropdownMenuLabel>Exportar relatório</DropdownMenuLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Relatório</div>
                        <div className="max-h-[48vh] overflow-auto pr-1">
                          {(
                            [
                              ['geral', 'Geral'],
                              ['ranking', 'Ranking'],
                              ['comparativo', 'Comparativo de Preços'],
                              ['orcamento', 'Orçamento'],
                              ['centros', 'Centros de Custo'],
                              ['consumo', 'Consumo'],
                            ] as [ReportType, string][]
                          ).map(([key, label]) => (
                            <div
                              key={key}
                              onClick={(e) => { e.stopPropagation(); setReportType(key); }}
                              className={`px-2 py-1 rounded cursor-pointer hover:bg-accent/20 ${reportType === key ? 'bg-accent/25 font-semibold' : ''}`}
                            >
                              {label}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Período</div>
                        <div className="max-h-[48vh] overflow-auto pr-1">
                          {(
                            [['hoje', 'Hoje'], ['3m', 'Últimos 3 meses'], ['6m', 'Últimos 6 meses'], ['1y', 'Último ano']] as [ReportPeriod, string][]
                          ).map(([key, label]) => (
                            <div
                              key={key}
                              onClick={(e) => { e.stopPropagation(); setReportPeriod(key); }}
                              className={`px-2 py-1 rounded cursor-pointer hover:bg-accent/20 ${reportPeriod === key ? 'bg-accent/25 font-semibold' : ''}`}
                            >
                              {label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <div className="p-2 flex gap-2 justify-end">
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); exportCurrentCSV(); }}>
                        Planilha (CSV)
                      </Button>
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); exportPDF(); }}>
                        PDF
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
          </div>

        <div className="indicadores-grid">
          <CardIndicador titulo="Orçamento Previsto (ano)" valor={formatarMoeda(totalPrevisto)} tipo="moeda" />
          <CardIndicador titulo="Executado (ano)" valor={formatarMoeda(totalExecutado)} tipo="moeda" destaque />
          <CardIndicador titulo="Economia por Centros" valor={formatarMoeda(economiaTotal)} tipo="moeda" />
          <CardIndicador titulo="Categorias" valor={consumoMedicamentosPeriodo.length} tipo="numero" />
        </div>

        <Dialog open={previewOpen} onOpenChange={(v) => { if (!v) setPreviewHtml(null); setPreviewOpen(v); }}>
          <DialogContent className="w-full max-w-2xl">
              <DialogTitle>Visualização do Relatório</DialogTitle>
              <div className="mt-2 h-[60vh]">
                {previewHtml ? (
                  <iframe ref={iframeRef} title="relatorio-preview" srcDoc={previewHtml} className="w-full h-full border" />
                ) : null}
              </div>
            <DialogFooter>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.print(); }}>
                  Salvar / Imprimir
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  if (!previewHtml) return;
                  const w = window.open('', '_blank');
                  if (!w) { alert('Permita popups para abrir em nova aba'); return; }
                  w.document.open();
                  w.document.write(previewHtml);
                  w.document.close();
                }}>
                  Abrir em nova aba
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ContainerGrafico titulo="Execução Orçamentária Mensal" subtitulo="Previsto vs Executado">
            <GraficoLinha
              dados={dadosOrcamentoMensal}
              linhas={[
                { chave: 'previsto', nome: 'Previsto', cor: 'hsl(var(--chart-2))' },
                { chave: 'executado', nome: 'Executado', cor: 'hsl(var(--chart-1))' },
              ]}
            />
          </ContainerGrafico>

          <ContainerGrafico titulo="Distribuição por Órgão" subtitulo="Participação no volume de compras">
            <GraficoPizza dados={participacaoPorOrgao as any} tipoValor="percentual" />
          </ContainerGrafico>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ContainerGrafico titulo="Consumo de Medicamentos (Últimos 6 meses)" subtitulo="Categorias com maior consumo" altura="h-64">
            <GraficoBarras
              dados={consumoMedicamentosPeriodo}
              barras={[
                { chave: 'jan', nome: 'Jan', cor: 'hsl(var(--chart-1))' },
                { chave: 'fev', nome: 'Fev', cor: 'hsl(var(--chart-2))' },
                { chave: 'mar', nome: 'Mar', cor: 'hsl(var(--chart-3))' },
                { chave: 'abr', nome: 'Abr', cor: 'hsl(var(--chart-4))' },
                { chave: 'mai', nome: 'Mai', cor: 'hsl(var(--chart-5))' },
                { chave: 'jun', nome: 'Jun', cor: 'hsl(var(--chart-6))' },
              ]}
              layout="vertical"
            />
          </ContainerGrafico>

          <ContainerGrafico titulo="Comparativo de Preços por Cotação" subtitulo="Ofertado vs Vencedor">
            <GraficoBarras
              dados={comparativoPrecos}
              barras={[
                { chave: 'ofertado', nome: 'Ofertado', cor: 'hsl(var(--chart-4))' },
                { chave: 'vencedor', nome: 'Vencedor', cor: 'hsl(var(--chart-2))' },
              ]}
            />
          </ContainerGrafico>
        </div>

        <div>
          <TabelaRanking
            titulo="Ranking de Medicamentos mais Comprados"
            dados={rankingMedicamentos}
            colunas={[
              { chave: 'posicao', titulo: '#', alinhamento: 'center' },
              { chave: 'nome', titulo: 'Medicamento' },
              { chave: 'quantidade', titulo: 'Quantidade', formatador: (v) => formatarNumero(v as number), alinhamento: 'right' },
              { chave: 'valor', titulo: 'Valor', formatador: (v) => formatarMoeda(v as number), alinhamento: 'right' },
            ]}
            colunaVariacao="variacao"
          />
        </div>
      </div>
    </div>
  );
}
