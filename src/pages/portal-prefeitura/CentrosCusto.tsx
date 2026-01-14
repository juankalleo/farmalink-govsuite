import { useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { CardIndicador } from '@/components/indicadores/CardIndicador';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CentroCusto } from '@/types';
import { formatarMoeda } from '@/lib/formatadores';
import { PlusCircle, Edit, Trash } from 'lucide-react';

function sampleId() {
  return Math.random().toString(36).slice(2, 9);
}

const initial: CentroCusto[] = [
  { id: 'cc1', codigo: 'CC-001', nome: 'Farmácia Municipal', orcamentoAnual: 200000, orcamentoExecutado: 85000, ativo: true },
  { id: 'cc2', codigo: 'CC-002', nome: 'Hospital Regional', orcamentoAnual: 500000, orcamentoExecutado: 320000, ativo: true },
  { id: 'cc3', codigo: 'CC-003', nome: 'Postos de Saúde', orcamentoAnual: 150000, orcamentoExecutado: 60000, ativo: false },
];

export default function CentrosCusto() {
  const [centros, setCentros] = useState<CentroCusto[]>(initial);
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<CentroCusto | null>(null);

  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [orcamentoAnual, setOrcamentoAnual] = useState('');
  const [orcamentoExecutado, setOrcamentoExecutado] = useState('');

  function resetForm() {
    setCodigo('');
    setNome('');
    setOrcamentoAnual('');
    setOrcamentoExecutado('');
    setEditing(null);
  }

  function handleOpenCreate() {
    resetForm();
    setOpenCreate(true);
  }

  function handleSave() {
    const payload: CentroCusto = {
      id: editing ? editing.id : sampleId(),
      codigo: codigo || `CC-${Math.floor(Math.random() * 900 + 100)}`,
      nome: nome || 'Novo Centro',
      orcamentoAnual: Number(orcamentoAnual) || 0,
      orcamentoExecutado: Number(orcamentoExecutado) || 0,
      ativo: editing ? editing.ativo : true,
    };

    if (editing) {
      setCentros((s) => s.map(c => c.id === editing.id ? payload : c));
    } else {
      setCentros((s) => [payload, ...s]);
    }

    setOpenCreate(false);
    resetForm();
  }

  function handleEdit(c: CentroCusto) {
    setEditing(c);
    setCodigo(c.codigo);
    setNome(c.nome);
    setOrcamentoAnual(String(c.orcamentoAnual));
    setOrcamentoExecutado(String(c.orcamentoExecutado));
    setOpenCreate(true);
  }

  function handleDelete(id: string) {
    if (!confirm('Remover este centro de custo?')) return;
    setCentros((s) => s.filter(c => c.id !== id));
  }

  const totalOrcamento = useMemo(() => centros.reduce((sum, c) => sum + c.orcamentoAnual, 0), [centros]);
  const totalExecutado = useMemo(() => centros.reduce((sum, c) => sum + c.orcamentoExecutado, 0), [centros]);
  const restante = totalOrcamento - totalExecutado;

  return (
    <div>
      <DashboardHeader titulo="Centros de Custo" subtitulo="Gerencie unidades e acompanhe execução orçamentária" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CardIndicador titulo="Orçamento Total" valor={totalOrcamento} tipo="moeda" icone={<PlusCircle className="h-5 w-5" />} destaque />
          <CardIndicador titulo="Executado" valor={totalExecutado} tipo="moeda" icone={<Edit className="h-5 w-5" />} />
          <CardIndicador titulo="Restante" valor={restante} tipo="moeda" icone={<Trash className="h-5 w-5" />} />
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Lista de Centros de Custo</h3>
          <Button size="sm" onClick={handleOpenCreate}><PlusCircle className="mr-2" />Novo Centro</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Orçamento Anual</TableHead>
              <TableHead>Executado</TableHead>
              <TableHead>Restante</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {centros.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.codigo}</TableCell>
                <TableCell>{c.nome}</TableCell>
                <TableCell>{formatarMoeda(c.orcamentoAnual)}</TableCell>
                <TableCell>{formatarMoeda(c.orcamentoExecutado)}</TableCell>
                <TableCell>{formatarMoeda(c.orcamentoAnual - c.orcamentoExecutado)}</TableCell>
                <TableCell>{c.ativo ? 'Sim' : 'Não'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(c)}><Edit className="mr-1" />Editar</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>Remover</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={openCreate} onOpenChange={(v) => { if (!v) resetForm(); setOpenCreate(v); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}</DialogTitle>
            <DialogDescription>{editing ? 'Altere os dados do centro de custo.' : 'Preencha os dados para criar um centro de custo.'}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 mt-4">
            <label className="text-sm">Código</label>
            <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            <label className="text-sm">Nome</label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
            <label className="text-sm">Orçamento Anual (R$)</label>
            <Input value={orcamentoAnual} onChange={(e) => setOrcamentoAnual(e.target.value)} type="number" />
            <label className="text-sm">Orçamento Executado (R$)</label>
            <Input value={orcamentoExecutado} onChange={(e) => setOrcamentoExecutado(e.target.value)} type="number" />
          </div>
          <DialogFooter>
            <Button variant="secondary" size="sm" onClick={() => { setOpenCreate(false); resetForm(); }}>Cancelar</Button>
            <Button size="sm" onClick={handleSave}>{editing ? 'Salvar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
