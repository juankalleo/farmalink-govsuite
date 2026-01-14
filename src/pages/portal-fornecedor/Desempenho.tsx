import { useEffect, useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/card';
import { formatarMoeda, formatarNumero } from '@/lib/formatadores';

type Proposta = {
  id: string;
  valorProposto: string;
  status: string;
  dataEnvio: string;
  cotacaoNumero: string;
};

export default function DesempenhoFornecedor() {
  const propostasKey = 'minhas_propostas';
  const [propostas, setPropostas] = useState<Proposta[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(propostasKey) || '[]';
    try { setPropostas(JSON.parse(raw)); } catch { setPropostas([]); }
  }, []);

  const resumo = useMemo(() => {
    const total = propostas.length;
    const enviadas = propostas.filter(p => p.status === 'enviada').length;
    const aceitas = propostas.filter(p => p.status === 'aceito').length;
    const concluidas = propostas.filter(p => p.status === 'concluida').length;
    const retiradas = propostas.filter(p => p.status === 'retirada').length;
    const faturado = propostas.reduce((s, p) => s + (Number(String(p.valorProposto).replace(/[^0-9.-]+/g, '')) || 0), 0);
    return { total, enviadas, aceitas, concluidas, retiradas, faturado };
  }, [propostas]);

  const recentes = useMemo(() => {
    return propostas.slice(0, 6);
  }, [propostas]);

  return (
    <div>
      <DashboardHeader titulo="Desempenho" subtitulo="Resumo das suas propostas e resultados" />

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Propostas enviadas</div>
            <div className="text-2xl font-semibold">{formatarNumero(resumo.enviadas)}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Aceitas</div>
            <div className="text-2xl font-semibold">{formatarNumero(resumo.aceitas)}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Concluídas</div>
            <div className="text-2xl font-semibold">{formatarNumero(resumo.concluidas)}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Faturamento estimado</div>
            <div className="text-2xl font-semibold">{formatarMoeda(resumo.faturado)}</div>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Propostas recentes</h3>
          <div className="overflow-auto mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="pb-2">ID</th>
                  <th className="pb-2">Cotação</th>
                  <th className="pb-2">Valor</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Enviada em</th>
                </tr>
              </thead>
              <tbody>
                {recentes.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="py-2">{p.id}</td>
                    <td className="py-2">{p.cotacaoNumero}</td>
                    <td className="py-2">{formatarMoeda(Number(p.valorProposto) || 0)}</td>
                    <td className="py-2">{p.status}</td>
                    <td className="py-2">{new Date(p.dataEnvio).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
