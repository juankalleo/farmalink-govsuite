import { useState, useMemo } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Fornecedor } from '@/types';
import { formatarCNPJ } from '@/lib/formatadores';
import { PlusCircle, Edit, Trash } from 'lucide-react';

function sampleId() {
  return Math.random().toString(36).slice(2, 9);
}

const initial: Fornecedor[] = [
  { id: 'f1', razaoSocial: 'Distribuidora A Ltda', nomeFantasia: 'Distribuidora A', cnpj: '12345678000199', endereco: 'Rua A, 123', cidade: 'Cidade X', uf: 'SP', email: 'contato@dista.com', telefone: '(11) 99999-0001', categoria: 'Distribuidor', avaliacaoMedia: 4.5, ativo: true },
  { id: 'f2', razaoSocial: 'Farmácia B Comércio', nomeFantasia: 'Farmácia B', cnpj: '98765432000155', endereco: 'Av B, 45', cidade: 'Cidade Y', uf: 'RJ', email: 'vendas@farmaciab.com', telefone: '(21) 98888-1111', categoria: 'Farmácia', avaliacaoMedia: 4.2, ativo: true },
];

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Fornecedor | null>(null);

  const [razao, setRazao] = useState('');
  const [fantasia, setFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cidade, setCidade] = useState('');

  function reset() { setRazao(''); setFantasia(''); setCnpj(''); setCidade(''); setEditing(null); }

  function openCreate() { reset(); setOpen(true); }

  function save() {
    const payload: Fornecedor = editing ? { ...editing, razaoSocial: razao, nomeFantasia: fantasia, cnpj, cidade } : { id: sampleId(), razaoSocial: razao, nomeFantasia: fantasia, cnpj, endereco: '', cidade, uf: '', email: '', telefone: '', categoria: '', avaliacaoMedia: 0, ativo: true };
    if (editing) setFornecedores(s => s.map(f => f.id === editing.id ? payload : f)); else setFornecedores(s => [payload, ...s]);
    setOpen(false); reset();
  }

  function handleEdit(f: Fornecedor) { setEditing(f); setRazao(f.razaoSocial); setFantasia(f.nomeFantasia); setCnpj(f.cnpj); setCidade(f.cidade); setOpen(true); }
  function handleDelete(id: string) { if (!confirm('Remover fornecedor?')) return; setFornecedores(s => s.filter(f => f.id !== id)); }

  const total = useMemo(() => fornecedores.length, [fornecedores]);

  return (
    <div>
      <DashboardHeader titulo="Fornecedores" subtitulo="Gerencie seus fornecedores e parceiros" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Total de fornecedores: <strong>{total}</strong></div>
          <Button size="sm" onClick={openCreate}><PlusCircle className="mr-2" />Novo Fornecedor</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Razão Social</TableHead>
              <TableHead>Nome Fantasia</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fornecedores.map(f => (
              <TableRow key={f.id}>
                <TableCell>{f.razaoSocial}</TableCell>
                <TableCell>{f.nomeFantasia}</TableCell>
                <TableCell>{formatarCNPJ(f.cnpj)}</TableCell>
                <TableCell>{f.cidade}</TableCell>
                <TableCell>{f.ativo ? 'Sim' : 'Não'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(f)}><Edit className="mr-1" />Editar</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(f.id)}>Remover</Button>
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
            <DialogTitle>{editing ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
            <DialogDescription>Preencha os dados básicos do fornecedor.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 mt-4">
            <label className="text-sm">Razão Social</label>
            <Input value={razao} onChange={(e) => setRazao(e.target.value)} />
            <label className="text-sm">Nome Fantasia</label>
            <Input value={fantasia} onChange={(e) => setFantasia(e.target.value)} />
            <label className="text-sm">CNPJ</label>
            <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
            <label className="text-sm">Cidade</label>
            <Input value={cidade} onChange={(e) => setCidade(e.target.value)} />
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
