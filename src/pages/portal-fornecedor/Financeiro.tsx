import { useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { CardIndicador } from '@/components/indicadores/CardIndicador';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatarMoeda } from '@/lib/formatadores';
import { Wallet, ArrowUpRight } from 'lucide-react';

export default function Financeiro() {
  const [saldoDisponivel, setSaldoDisponivel] = useState(125000); // R$
  const [recebiveis, setRecebiveis] = useState(42000);
  const [antecipacaoValor, setAntecipacaoValor] = useState('');
  const [antecipacoes, setAntecipacoes] = useState<Array<{ id: string; valor: number; data: Date }>>([]);

  function solicitarAntecipacao() {
    const v = Number(antecipacaoValor) || 0;
    if (v <= 0) return alert('Informe um valor válido');
    if (v > recebiveis) return alert('Valor maior que recebíveis');
    // simula taxa fixa de 2%
    const taxa = 0.02;
    const liquido = Math.round(v * (1 - taxa));
    setSaldoDisponivel(s => s + liquido);
    setRecebiveis(r => r - v);
    setAntecipacoes(a => [{ id: Math.random().toString(36).slice(2, 8), valor: v, data: new Date() }, ...a]);
    setAntecipacaoValor('');
  }

  const totalDisponivel = useMemo(() => saldoDisponivel, [saldoDisponivel]);

  return (
    <div>
      <DashboardHeader titulo="Financeiro" subtitulo="Visão financeira e antecipações" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CardIndicador titulo="Saldo Disponível" valor={totalDisponivel} tipo="moeda" icone={<Wallet className="h-5 w-5" />} destaque />
          <CardIndicador titulo="Recebíveis" valor={recebiveis} tipo="moeda" icone={<ArrowUpRight className="h-5 w-5" />} />
          <CardIndicador titulo="Antecipações" valor={antecipacoes.reduce((s, a) => s + a.valor, 0)} tipo="moeda" icone={<ArrowUpRight className="h-5 w-5" />} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grafico-container">
            <h4 className="grafico-titulo">Solicitar Antecipação</h4>
            <div className="grid gap-2">
              <label className="text-sm">Valor (R$)</label>
              <Input value={antecipacaoValor} onChange={(e) => setAntecipacaoValor(e.target.value)} type="number" />
              <div className="flex items-center gap-2 mt-2">
                <Button size="sm" onClick={solicitarAntecipacao}>Solicitar</Button>
                <Button size="sm" variant="secondary" onClick={() => setAntecipacaoValor('')}>Limpar</Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Taxa simulada: 2% sobre o valor solicitado (liquido creditado).</p>
            </div>
          </div>

          <div className="grafico-container">
            <h4 className="grafico-titulo">Últimas Antecipações</h4>
            <div className="space-y-2">
              {antecipacoes.length === 0 && <div className="text-sm text-muted-foreground">Nenhuma antecipação realizada.</div>}
              {antecipacoes.map(a => (
                <div key={a.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div>
                    <div className="font-medium">R$ {a.valor.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{a.data.toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Confirmada</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
