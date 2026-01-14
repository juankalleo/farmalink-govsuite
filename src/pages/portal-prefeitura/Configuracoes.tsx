import { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

export default function Configuracoes() {
  // mock do usuário autenticado
  const [usuario, setUsuario] = useState({
    nome: 'Mariana Silva',
    email: 'mariana.silva@prefeitura.gov.br',
    idioma: 'pt-BR',
    notificacoesEmail: true,
    notificacoesSMS: false,
    tema: 'sistema',
  });

  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [idioma, setIdioma] = useState(usuario.idioma);
  const [notEmail, setNotEmail] = useState(usuario.notificacoesEmail);
  const [notSMS, setNotSMS] = useState(usuario.notificacoesSMS);
  const [tema, setTema] = useState(usuario.tema);

  // senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [senhaConf, setSenhaConf] = useState('');

  function salvarPerfil() {
    if (!nome.trim() || !email.trim()) { alert('Nome e e-mail são obrigatórios'); return; }
    setUsuario(u => ({ ...u, nome, email, idioma, notificacoesEmail: notEmail, notificacoesSMS: notSMS, tema }));
    alert('Perfil salvo (mock)');
  }

  function alterarSenha() {
    if (!senhaNova) { alert('Informe a nova senha'); return; }
    if (senhaNova.length < 8) { alert('A senha precisa ter ao menos 8 caracteres'); return; }
    if (senhaNova !== senhaConf) { alert('Senha de confirmação não confere'); return; }
    // mock: não validamos senha atual
    setSenhaAtual(''); setSenhaNova(''); setSenhaConf('');
    alert('Senha alterada (mock)');
  }

  function restaurarPadrao() {
    setNome(usuario.nome);
    setEmail(usuario.email);
    setIdioma('pt-BR');
    setNotEmail(true);
    setNotSMS(false);
    setTema('sistema');
    alert('Padrões restaurados (somente local)');
  }

  return (
    <div>
      <DashboardHeader titulo="Configurações do Usuário" subtitulo="Ajuste seu perfil e preferências" />

      <div className="p-6 space-y-6">
        <section className="card p-4">
          <h4 className="font-semibold mb-2">Perfil</h4>
          <div className="grid gap-2">
            <label className="text-sm">Nome</label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />

            <label className="text-sm">E-mail</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />

            <label className="text-sm">Idioma</label>
            <Select defaultValue={idioma} onValueChange={(v) => setIdioma(v)}>
              <SelectTrigger>
                <SelectValue>{idioma}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Notificações por E-mail</div>
                <div className="text-xs text-muted-foreground">Receber alertas e atualizações</div>
              </div>
              <Switch checked={notEmail} onCheckedChange={(v) => setNotEmail(Boolean(v))} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Notificações por SMS</div>
                <div className="text-xs text-muted-foreground">Alertas críticos via SMS</div>
              </div>
              <Switch checked={notSMS} onCheckedChange={(v) => setNotSMS(Boolean(v))} />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={restaurarPadrao}>Restaurar Padrões</Button>
            <Button onClick={salvarPerfil}>Salvar Perfil</Button>
          </div>
        </section>

        <section className="card p-4">
          <h4 className="font-semibold mb-2">Segurança</h4>
          <div className="grid gap-2">
            <label className="text-sm">Senha Atual</label>
            <Input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} />

            <label className="text-sm">Nova Senha</label>
            <Input type="password" value={senhaNova} onChange={(e) => setSenhaNova(e.target.value)} />

            <label className="text-sm">Confirmar Nova Senha</label>
            <Input type="password" value={senhaConf} onChange={(e) => setSenhaConf(e.target.value)} />
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={() => { setSenhaAtual(''); setSenhaNova(''); setSenhaConf(''); }}>Limpar</Button>
            <Button onClick={alterarSenha}>Alterar Senha</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
