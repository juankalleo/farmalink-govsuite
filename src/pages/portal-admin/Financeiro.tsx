import { useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { CardIndicador } from '@/components/indicadores/CardIndicador';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Transacao } from '@/types';
import { formatarMoeda, formatarData } from '@/lib/formatadores';
import { PlusCircle, Check, Trash, XCircle } from 'lucide-react';

function sampleId() { return Math.random().toString(36).slice(2, 9); }

const initial: Transacao[] = [
  { id: 'a1', tipo: 'entrada', descricao: 'Repasse - Fornecedor A', valor: 32000, data: new Date(), status: 'pendente', referencia: 'REP-001' },
  { id: 'a2', tipo: 'saida', descricao: 'Reembolso funcionário', valor: 1200, data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), status: 'processada', referencia: 'RB-045' },
  { id: 'a3', tipo: 'entrada', descricao: 'Receita campanha', valor: 54000, data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40), status: 'processada' },
];

export default function FinanceiroAdmin() {
  const [transacoes, setTransacoes] = useState<Transacao[]>(initial);
  const [filtro, setFiltro] = useState<'todas' | 'entrada' | 'saida'>('todas');

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transacao | null>(null);

  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState<string>(new Date().toISOString().slice(0,10));

  function reset() { setEditing(null); setTipo('entrada'); setDescricao(''); setValor(''); setData(new Date().toISOString().slice(0,10)); }
  function openCreate() { reset(); setOpen(true); }

  function save() {
    const payload: Transacao = editing ? { ...editing, tipo, descricao, valor: Number(valor), data: new Date(data) } : { id: sampleId(), tipo, descricao, valor: Number(valor), data: new Date(data), status: 'pendente' };
    if (editing) setTransacoes(s => s.map(t => t.id === editing.id ? payload : t)); else setTransacoes(s => [payload, ...s]);
    setOpen(false); reset();
  }

  function marcarProcessada(id: string) { setTransacoes(s => s.map(t => t.id === id ? { ...t, status: 'processada' } : t)); }
  function cancelar(id: string) { setTransacoes(s => s.map(t => t.id === id ? { ...t, status: 'cancelada' } : t)); }
  function remover(id: string) { if (!confirm('Remover transação?')) return; setTransacoes(s => s.filter(t => t.id !== id)); }

  const saldo = useMemo(() => transacoes.reduce((acc, t) => acc + (t.tipo === 'entrada' ? t.valor : -t.valor), 0), [transacoes]);
  const contasReceber = useMemo(() => transacoes.filter(t => t.tipo === 'entrada' && t.status === 'pendente').reduce((s, t) => s + t.valor, 0), [transacoes]);
  const contasPagar = useMemo(() => transacoes.filter(t => t.tipo === 'saida' && t.status === 'pendente').reduce((s, t) => s + t.valor, 0), [transacoes]);
  const vencidas = useMemo(() => transacoes.filter(t => t.status === 'pendente' && new Date(t.data) < new Date()).length, [transacoes]);

  const listaFiltrada = transacoes.filter(t => filtro === 'todas' ? true : t.tipo === filtro);

  return (
    <div>
      <DashboardHeader titulo="Financeiro" subtitulo="Visão geral financeira do sistema" />

      <div className="p-6 space-y-6">
        <div className="indicadores-grid">
          <CardIndicador titulo="Saldo Disponível" valor={formatarMoeda(saldo)} tipo="moeda" destaque />
          <CardIndicador titulo="Contas a Receber" valor={formatarMoeda(contasReceber)} tipo="moeda" />
          <CardIndicador titulo="Contas a Pagar" valor={formatarMoeda(contasPagar)} tipo="moeda" />
          <CardIndicador titulo="Vencidas" valor={vencidas} tipo="numero" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm">Filtrar</label>
            <select value={filtro} onChange={(e) => setFiltro(e.target.value as any)} className="input">
              <option value="todas">Todas</option>
              <option value="entrada">Entradas</option>
              <option value="saida">Saídas</option>
            </select>
          </div>

          <Button size="sm" onClick={openCreate}><PlusCircle className="mr-2" />Nova Transação</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listaFiltrada.map(t => (
              <TableRow key={t.id}>
                <TableCell>{t.tipo === 'entrada' ? 'Entrada' : 'Saída'}</TableCell>
                <TableCell>{t.descricao}</TableCell>
                <TableCell>{formatarMoeda(t.valor)}</TableCell>
                <TableCell>{formatarData(t.data)}</TableCell>
                <TableCell>{t.status}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {t.status === 'pendente' && <Button size="sm" variant="outline" onClick={() => marcarProcessada(t.id)}><Check className="mr-1" />Marcar Paga</Button>}
                    {t.status === 'pendente' && <Button size="sm" variant="destructive" onClick={() => cancelar(t.id)}><XCircle className="mr-1" />Cancelar</Button>}
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(t); setTipo(t.tipo); setDescricao(t.descricao); setValor(String(t.valor)); setData(new Date(t.data).toISOString().slice(0,10)); setOpen(true); }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 0 0-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 0 0 0-2.828z" /><path d="M2 15a1 1 0 0 0 1 1h3v-1H3v-2H2v2z" /></svg>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => remover(t.id)}><Trash /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); setOpen(v); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
            <DialogDescription>Registre uma entrada ou saída financeira.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 mt-4">
            <label className="text-sm">Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value as any)} className="input">
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>

            <label className="text-sm">Descrição</label>
            <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} />

            <label className="text-sm">Valor (R$)</label>
            <Input type="number" value={valor} onChange={(e) => setValor(e.target.value)} />

            <label className="text-sm">Data</label>
            <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </div>

          <DialogFooter>
            <Button variant="secondary" size="sm" onClick={() => { reset(); setOpen(false); }}>Cancelar</Button>
            <Button size="sm" onClick={save}>{editing ? 'Salvar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
