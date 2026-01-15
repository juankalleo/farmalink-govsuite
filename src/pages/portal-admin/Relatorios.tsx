import { useCallback, useRef, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { CardIndicador } from '@/components/indicadores/CardIndicador';
import { ContainerGrafico } from '@/components/graficos/ContainerGrafico';
import { GraficoLinha } from '@/components/graficos/GraficoLinha';
import { GraficoBarras } from '@/components/graficos/GraficoBarras';
import { GraficoPizza } from '@/components/graficos/GraficoPizza';
import { GraficoArea } from '@/components/graficos/GraficoArea';
import { TabelaRanking } from '@/components/tabelas/TabelaRanking';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import {
  crescimentoMensal,
  receitaPorTipo,
  distribuicaoUsuarios,
  retencaoFornecedores,
  comparativoPrecos,
  rankingOrgaos,
  precoVsEntrega,
} from '@/lib/mock-dados';
import { formatarMoeda, formatarNumero } from '@/lib/formatadores';

type ReportType = 'geral' | 'crescimento' | 'receita' | 'usuarios' | 'retencao' | 'comparativo' | 'precos' | 'ranking';
type ReportPeriod = 'hoje' | '3m' | '6m' | '1y';

export default function RelatoriosAdmin() {
  const [reportType, setReportType] = useState<ReportType>('geral');
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('3m');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const totalOrgaos = rankingOrgaos.reduce((s, r) => s + (r.volume || 0), 0);

  const exportCSV = useCallback((data: any[], baseName: string) => {
    if (!data || data.length === 0) { alert('Sem dados para exportar'); return; }
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
    a.href = url; a.download = `${baseName}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }, []);

  const exportCurrentCSV = useCallback(() => {
    switch (reportType) {
      case 'crescimento':
        exportCSV(crescimentoMensal as any, `crescimento_${reportPeriod}`);
        break;
      case 'receita':
        exportCSV(receitaPorTipo as any, `receita_${reportPeriod}`);
        break;
      case 'usuarios':
        exportCSV(distribuicaoUsuarios as any, `usuarios_${reportPeriod}`);
        break;
      case 'retencao':
        exportCSV(retencaoFornecedores as any, `retencao_${reportPeriod}`);
        break;
      case 'comparativo':
      case 'precos':
        exportCSV(comparativoPrecos as any, `comparativo_${reportPeriod}`);
        break;
      case 'ranking':
        exportCSV(rankingOrgaos as any, `ranking_orgaos_${reportPeriod}`);
        break;
      case 'geral':
      default:
        exportCSV(rankingOrgaos as any, `relatorio_geral_${reportPeriod}`);
        break;
    }
  }, [reportType, reportPeriod, exportCSV]);

  const exportPDF = useCallback(() => {
    const now = new Date();
    const title = `Relatório - NextFarma - ${now.toLocaleDateString()}`;
    const headerHtml = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div><strong>NextFarma</strong><div style="color:#6b7280;font-size:12px">Relatório — ${now.toLocaleString()}</div></div><h2>Relatório: ${reportType}</h2></div>`;
    const styles = `body{font-family:Arial,sans-serif;margin:20px;color:#111827}table{width:100%;border-collapse:collapse}th,td{border:1px solid #e5e7eb;padding:6px;text-align:left;font-size:12px}th{background:#f9fafb}`;
    let bodyHtml = '';
    if (reportType === 'ranking') {
      bodyHtml = `<h3>Ranking de Órgãos por Volume</h3><table><thead><tr><th>#</th><th>Órgão</th><th>Volume</th><th>Cotações</th></tr></thead><tbody>${rankingOrgaos.map(r=>`<tr><td>${r.posicao}</td><td>${r.nome}</td><td>${formatarMoeda(r.volume)}</td><td>${r.cotacoes}</td></tr>`).join('')}</tbody></table>`;
    } else if (reportType === 'crescimento') {
      bodyHtml = `<h3>Crescimento Mensal</h3><table><thead><tr><th>Mês</th><th>Órgãos</th><th>Fornecedores</th></tr></thead><tbody>${crescimentoMensal.map(d=>`<tr><td>${d.nome}</td><td>${d.orgaos}</td><td>${d.fornecedores}</td></tr>`).join('')}</tbody></table>`;
    } else {
      bodyHtml = `<div><strong>Resumo</strong><div>Total volume (amostra): ${formatarMoeda(totalOrgaos)}</div></div>`;
    }

    const html = `<html><head><meta charset="utf-8"/><title>${title}</title><style>${styles}</style></head><body>${headerHtml}${bodyHtml}</body></html>`;
    setPreviewHtml(html); setPreviewOpen(true);
  }, [reportType, totalOrgaos]);

  return (
    <div>
      <DashboardHeader titulo="Relatórios (Admin)" subtitulo="Relatórios e exportações administrativas" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">Exportar</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 max-w-[92vw]">
                <DropdownMenuLabel>Exportar relatório</DropdownMenuLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Relatório</div>
                    <div className="max-h-[36vh] overflow-auto pr-1">
                      {([
                        ['geral','Geral'],['crescimento','Crescimento Mensal'],['receita','Receita por Tipo'],['usuarios','Distribuição de Usuários'],['retencao','Retenção Fornecedores'],['comparativo','Comparativo Preços'],['precos','Preço vs Entrega'],['ranking','Ranking Órgãos']
                      ] as [ReportType,string][]).map(([k,l])=> (
                        <div key={k} onClick={(e)=>{ e.stopPropagation(); setReportType(k); }} className={`px-2 py-1 rounded cursor-pointer hover:bg-accent/20 ${reportType===k ? 'bg-accent/25 font-semibold' : ''}`}>{l}</div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Período</div>
                    <div className="max-h-[36vh] overflow-auto pr-1">
                      {([['hoje','Hoje'],['3m','Últimos 3 meses'],['6m','Últimos 6 meses'],['1y','Último ano']] as [ReportPeriod,string][]).map(([k,l])=> (
                        <div key={k} onClick={(e)=>{ e.stopPropagation(); setReportPeriod(k); }} className={`px-2 py-1 rounded cursor-pointer hover:bg-accent/20 ${reportPeriod===k ? 'bg-accent/25 font-semibold' : ''}`}>{l}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <DropdownMenuSeparator />
                <div className="p-2 flex gap-2 justify-end">
                  <Button size="sm" onClick={(e)=>{ e.stopPropagation(); exportCurrentCSV(); }}>Planilha (CSV)</Button>
                  <Button size="sm" onClick={(e)=>{ e.stopPropagation(); exportPDF(); }}>PDF</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="indicadores-grid">
          <CardIndicador titulo="Volume Amostra" valor={totalOrgaos} tipo="moeda" />
          <CardIndicador titulo="Receita (últimos meses)" valor={formatarMoeda(receitaPorTipo.reduce((s,d)=>s + (d.takeRate as number || 0),0))} tipo="moeda" destaque />
          <CardIndicador titulo="Fornecedores Retidos" valor={retencaoFornecedores[retencaoFornecedores.length-1].retencao} tipo="numero" />
          <CardIndicador titulo="Categorias" valor={distribuicaoUsuarios.length} tipo="numero" />
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ContainerGrafico titulo="Crescimento Mensal" subtitulo="Órgãos vs Fornecedores">
            <GraficoLinha dados={crescimentoMensal} linhas={[{ chave: 'orgaos', nome: 'Órgãos', cor: 'hsl(var(--chart-4))' },{ chave: 'fornecedores', nome: 'Fornecedores', cor: 'hsl(var(--chart-2))' }]} />
          </ContainerGrafico>

          <ContainerGrafico titulo="Receita por Tipo" subtitulo="Composição da receita">
            <GraficoBarras dados={receitaPorTipo} barras={[{ chave: 'taxaAdm', nome: 'Taxa Adm', cor: 'hsl(var(--chart-1))' },{ chave: 'takeRate', nome: 'Take Rate', cor: 'hsl(var(--chart-2))' },{ chave: 'outros', nome: 'Outros', cor: 'hsl(var(--chart-4))' }]} />
          </ContainerGrafico>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ContainerGrafico titulo="Distribuição de Usuários" subtitulo="Por perfil">
            <GraficoPizza dados={distribuicaoUsuarios as any} tipoValor="numero" />
          </ContainerGrafico>

          <ContainerGrafico titulo="Retenção de Fornecedores" subtitulo="Cohort simplificado">
            <GraficoArea dados={retencaoFornecedores} chave="retencao" nome="Retenção" cor="hsl(var(--chart-2))" />
          </ContainerGrafico>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ContainerGrafico titulo="Comparativo Preços (Amostra)" subtitulo="Ofertado vs Vencedor">
            <GraficoBarras dados={comparativoPrecos} barras={[{ chave: 'ofertado', nome: 'Ofertado', cor: 'hsl(var(--chart-4))' },{ chave: 'vencedor', nome: 'Vencedor', cor: 'hsl(var(--chart-2))' }]} />
          </ContainerGrafico>

          <ContainerGrafico titulo="Preço vs Tempo de Entrega" subtitulo="Médias por fornecedor">
            <GraficoBarras dados={precoVsEntrega as any} barras={[{ chave: 'precoMedio', nome: 'Preço Médio', cor: 'hsl(var(--chart-3))' },{ chave: 'tempoEntrega', nome: 'Tempo Entrega', cor: 'hsl(var(--chart-5))' }]} />
          </ContainerGrafico>
        </div>

        <div>
          <TabelaRanking titulo="Maiores Órgãos por Volume" dados={rankingOrgaos} colunas={[{ chave: 'posicao', titulo: '#', alinhamento: 'center' },{ chave: 'nome', titulo: 'Órgão' },{ chave: 'volume', titulo: 'Volume', formatador: (v)=> formatarMoeda(v as number), alinhamento: 'right' },{ chave: 'cotacoes', titulo: 'Cotações', formatador: (v)=> formatarNumero(v as number), alinhamento: 'right' }]} />
        </div>

        <Dialog open={previewOpen} onOpenChange={(v)=>{ if(!v) setPreviewHtml(null); setPreviewOpen(v); }}>
          <DialogContent className="w-full max-w-2xl">
            <DialogTitle>Preview do Relatório</DialogTitle>
            <div className="mt-2 h-[60vh]">
              {previewHtml ? (<iframe ref={iframeRef} title="rel-preview" srcDoc={previewHtml} className="w-full h-full border" />) : null}
            </div>
            <DialogFooter>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.print(); }}>Salvar / Imprimir</Button>
                <Button size="sm" variant="outline" onClick={() => {
                  if (!previewHtml) return; const w = window.open('', '_blank'); if (!w) { alert('Permita popups'); return; } w.document.open(); w.document.write(previewHtml); w.document.close();
                }}>Abrir em nova aba</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
