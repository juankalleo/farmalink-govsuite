import { useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardIndicador } from '@/components/indicadores/CardIndicador';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, Edit2, PlusCircle } from 'lucide-react';

type Role = { id: string; nome: string; descricao?: string };
type Session = { id: string; usuario: string; ip: string; device: string; inicio: string };
type Audit = { id: string; usuario: string; acao: string; when: string };

function sampleId() { return Math.random().toString(36).slice(2, 9); }

export default function SegurancaAdmin() {
  const [twoFA, setTwoFA] = useState<boolean>(() => {
    try { return localStorage.getItem('admin_twofa') === '1'; } catch { return false; }
  });

  const [roles, setRoles] = useState<Role[]>([
    { id: 'r1', nome: 'admin', descricao: 'Acesso total' },
    { id: 'r2', nome: 'prefeitura', descricao: 'Usuário prefeitura' },
    { id: 'r3', nome: 'fornecedor', descricao: 'Usuário fornecedor' },
  ]);

  const [sessions, setSessions] = useState<Session[]>([
    { id: 's1', usuario: 'ana.souza', ip: '192.168.0.3', device: 'Chrome • Windows', inicio: new Date().toISOString() },
    { id: 's2', usuario: 'carlos.pereira', ip: '10.0.0.12', device: 'Firefox • Mac', inicio: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  ]);

  const [audits, setAudits] = useState<Audit[]>(() => [
    { id: sampleId(), usuario: 'ana.souza', acao: 'Criou usuário carlos.pereira', when: new Date().toISOString() },
  ]);

  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [editingRole, setEditingRole] = useState<string | null>(null);

  function toggle2fa() { setTwoFA(v => { const nv = !v; try { localStorage.setItem('admin_twofa', nv ? '1' : '0'); } catch {} return nv; }); }

  function addRole(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!roleName.trim()) return;
    const novo = { id: sampleId(), nome: roleName.trim(), descricao: roleDesc.trim() };
    setRoles(r => [novo, ...r]);
    setRoleName(''); setRoleDesc('');
    setAudits(a => [{ id: sampleId(), usuario: 'admin', acao: `Criou papel ${novo.nome}`, when: new Date().toISOString() }, ...a]);
  }

  function revokeSession(id: string) { setSessions(s => s.filter(x => x.id !== id)); setAudits(a => [{ id: sampleId(), usuario: 'admin', acao: `Revogou sessão ${id}`, when: new Date().toISOString() }, ...a]); }

  function exportAuditsCSV() {
    const rows = audits.map(a => [a.usuario, a.acao, a.when]);
    const csv = ['usuario,acao,quando', ...rows.map(r => r.map(c => '"' + String(c).replace(/"/g,'""') + '"').join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'audits.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  function clearAudits() {
    if (!confirm('Limpar todos os logs de auditoria?')) return;
    setAudits([]);
  }

  const indicadores = useMemo(() => ({ roles: roles.length, sessions: sessions.length, eventos: audits.length }), [roles, sessions, audits]);

  return (
    <>
      <DashboardHeader titulo="Segurança" subtitulo="Configurações de autenticação e auditoria" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardIndicador titulo="Papéis" valor={indicadores.roles} tipo="numero" />
          <CardIndicador titulo="Sessões Ativas" valor={indicadores.sessions} tipo="numero" />
          <CardIndicador titulo="Eventos" valor={indicadores.eventos} tipo="numero" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-4">
            <h3 className="text-lg font-medium">Autenticação</h3>
            <p className="text-sm text-muted-foreground mt-1">Configurações de autenticação do painel administrativo.</p>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="font-medium">Autenticação em 2 fatores (2FA)</div>
                <div className="text-sm text-muted-foreground">Requer 2FA para administradores e operações sensíveis.</div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={twoFA} onCheckedChange={toggle2fa} />
                <Badge variant={twoFA ? 'default' : 'secondary'}>{twoFA ? 'Ativado' : 'Desativado'}</Badge>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-lg font-medium">Sessões Ativas</h3>
            <p className="text-sm text-muted-foreground mt-1">Revogue sessões ativas manualmente.</p>

            <div className="mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>IP / Device</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map(s => (
                    <TableRow key={s.id}>
                      <TableCell>{s.usuario}</TableCell>
                      <TableCell>{s.ip} · {s.device}</TableCell>
                      <TableCell>{new Date(s.inicio).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive" onClick={() => revokeSession(s.id)}>Revogar</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(sessions, null, 2)); }}>Copiar sessões</Button>
              <Button size="sm" variant="ghost" onClick={() => { setSessions([]); setAudits(a => [{ id: sampleId(), usuario: 'admin', acao: 'Revogou todas sesiões', when: new Date().toISOString() }, ...a]); }}>Revogar todas</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-4">
            <h3 className="text-lg font-medium">Papéis e Permissões</h3>
            <p className="text-sm text-muted-foreground mt-1">Adicione papéis usados para controle de acesso.</p>

            <form onSubmit={addRole} className="mt-4 flex gap-2">
              <Input placeholder="Nome do papel" value={roleName} onChange={(e) => setRoleName(e.target.value)} />
              <Input placeholder="Descrição" value={roleDesc} onChange={(e) => setRoleDesc(e.target.value)} />
              <Button type="submit" size="sm"><PlusCircle className="mr-2" />Adicionar</Button>
            </form>

            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Papel</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map(r => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="font-medium">{r.nome}</div>
                      </TableCell>
                      <TableCell>{r.descricao}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => { setEditingRole(editingRole === r.id ? null : r.id); }}>{editingRole === r.id ? <span>Fechar</span> : <><Edit2 className="mr-2" />Editar</>}</Button>
                          <Button size="sm" variant="destructive" onClick={() => { if (!confirm('Remover papel?')) return; setRoles(rs => rs.filter(x => x.id !== r.id)); setAudits(a => [{ id: sampleId(), usuario: 'admin', acao: `Removeu papel ${r.nome}`, when: new Date().toISOString() }, ...a]); }}>Remover</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {editingRole && (
              <div className="mt-3 p-3 border border-border rounded bg-card">
                <div className="text-sm font-medium">Editando papel</div>
                {(() => {
                  const r = roles.find(x => x.id === editingRole); if (!r) return null;
                  return (
                    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const nome = String(fd.get('nome') || '').trim(); const desc = String(fd.get('desc') || '').trim(); setRoles(rs => rs.map(x => x.id === r.id ? { ...x, nome, descricao: desc } : x)); setAudits(a => [{ id: sampleId(), usuario: 'admin', acao: `Editou papel ${nome}`, when: new Date().toISOString() }, ...a]); setEditingRole(null); }} className="mt-2 flex gap-2">
                      <Input name="nome" defaultValue={r.nome} />
                      <Input name="desc" defaultValue={r.descricao} />
                      <Button type="submit" size="sm">Salvar</Button>
                    </form>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="card p-4">
            <h3 className="text-lg font-medium">Logs de Auditoria</h3>
            <p className="text-sm text-muted-foreground mt-1">Amostra de eventos recentes do sistema.</p>

            <div className="mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Quando</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audits.map(a => (
                    <TableRow key={a.id}>
                      <TableCell>{a.usuario}</TableCell>
                      <TableCell>{a.acao}</TableCell>
                      <TableCell>{new Date(a.when).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(audits, null, 2)); }}>Copiar JSON</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
