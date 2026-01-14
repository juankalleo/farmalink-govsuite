import { useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Usuario } from '@/types';
import { formatarData } from '@/lib/formatadores';
import { PlusCircle, Edit, Trash } from 'lucide-react';

function sampleId() { return Math.random().toString(36).slice(2, 9); }

const initial: Usuario[] = [
  { id: 'u1', nome: 'Mariana Silva', email: 'mariana.silva@prefeitura.gov.br', papel: 'prefeitura', ativo: true, criadoEm: new Date('2024-01-10') },
  { id: 'u2', nome: 'João Pereira', email: 'joao.pereira@prefeitura.gov.br', papel: 'prefeitura', ativo: true, criadoEm: new Date('2024-02-02') },
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(initial);
  const [query, setQuery] = useState('');

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [papel, setPapel] = useState<Usuario['papel']>('prefeitura');
  const [ativo, setAtivo] = useState(true);

  function reset() { setEditing(null); setNome(''); setEmail(''); setPapel('prefeitura'); setAtivo(true); }
  function openCreate() { reset(); setOpen(true); }

  function save() {
    if (!nome.trim() || !email.trim()) {
      alert('Nome e e-mail são obrigatórios');
      return;
    }
    const payload: Usuario = editing ? { ...editing, nome, email, papel, ativo } : { id: sampleId(), nome, email, papel, ativo, criadoEm: new Date() };
    if (editing) setUsuarios(s => s.map(u => u.id === editing.id ? payload : u)); else setUsuarios(s => [payload, ...s]);
    setOpen(false); reset();
  }

  function handleEdit(u: Usuario) { setEditing(u); setNome(u.nome); setEmail(u.email); setPapel(u.papel); setAtivo(u.ativo); setOpen(true); }
  function handleDelete(id: string) { if (!confirm('Remover usuário?')) return; setUsuarios(s => s.filter(u => u.id !== id)); }
  function toggleAtivo(id: string) { setUsuarios(s => s.map(u => u.id === id ? { ...u, ativo: !u.ativo } : u)); }

  const lista = useMemo(() => usuarios.filter(u => u.nome.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())), [usuarios, query]);

  return (
    <div>
      <DashboardHeader titulo="Usuários" subtitulo="Gerenciamento de usuários" />

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input placeholder="Buscar por nome ou e-mail" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Button size="sm" onClick={openCreate}><PlusCircle className="mr-2" />Novo Usuário</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Criado Em</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lista.map(u => (
              <TableRow key={u.id}>
                <TableCell>{u.nome}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell className="capitalize">{u.papel}</TableCell>
                <TableCell><Switch checked={u.ativo} onCheckedChange={() => toggleAtivo(u.id)} /></TableCell>
                <TableCell>{formatarData(u.criadoEm)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(u)}><Edit className="mr-1" />Editar</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}><Trash /></Button>
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
            <DialogTitle>{editing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription>Adicione ou edite um usuário do sistema.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 mt-4">
            <label className="text-sm">Nome</label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />

            <label className="text-sm">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />

            <label className="text-sm">Papel</label>
            <Select defaultValue={papel} onValueChange={(v) => setPapel(v as Usuario['papel'])}>
              <SelectTrigger>
                <SelectValue>{papel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prefeitura">Prefeitura</SelectItem>
                <SelectItem value="fornecedor">Fornecedor</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>

            <label className="text-sm">Ativo</label>
            <Switch checked={ativo} onCheckedChange={(v) => setAtivo(Boolean(v))} />
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
