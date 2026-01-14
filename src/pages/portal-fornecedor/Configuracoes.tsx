import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

export default function ConfiguracoesFornecedor() {
  const storageKey = 'fornecedor_config';

  const [config, setConfig] = useState(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) try { return JSON.parse(raw); } catch { }
    return {
      empresa: {
        razaoSocial: 'Fornecedor Exemplo LTDA',
        nomeFantasia: 'Fornecedor Exemplo',
        cnpj: '00.000.000/0000-00',
        email: 'contato@fornecedor.com.br',
        telefone: '(00) 0000-0000',
        cidade: 'Cidade',
        uf: 'SP'
      },
      usuario: {
        nome: 'Representante',
        email: 'rep@fornecedor.com.br'
      },
      preferencias: {
        idioma: 'pt-BR',
        notificacoesEmail: true,
        notificacoesSMS: false,
        visibilidadePerfil: 'publico'
      }
    };
  });

  // form fields
  const [razaoSocial, setRazaoSocial] = useState(config.empresa.razaoSocial);
  const [nomeFantasia, setNomeFantasia] = useState(config.empresa.nomeFantasia);
  const [cnpj, setCnpj] = useState(config.empresa.cnpj);
  const [email, setEmail] = useState(config.empresa.email);
  const [telefone, setTelefone] = useState(config.empresa.telefone);
  const [cidade, setCidade] = useState(config.empresa.cidade);
  const [uf, setUf] = useState(config.empresa.uf);

  const [nomeUsuario, setNomeUsuario] = useState(config.usuario.nome);
  const [emailUsuario, setEmailUsuario] = useState(config.usuario.email);

  const [idioma, setIdioma] = useState(config.preferencias.idioma);
  const [notEmail, setNotEmail] = useState(config.preferencias.notificacoesEmail);
  const [notSMS, setNotSMS] = useState(config.preferencias.notificacoesSMS);
  const [visibilidade, setVisibilidade] = useState(config.preferencias.visibilidadePerfil);

  // senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [senhaConf, setSenhaConf] = useState('');

  useEffect(() => {
    // keep form synced when config changes externally
  }, [config]);

  function salvar() {
    if (!razaoSocial.trim() || !nomeUsuario.trim()) return alert('Preencha nome da empresa e nome do usuário');
    const next = {
      empresa: { razaoSocial, nomeFantasia, cnpj, email, telefone, cidade, uf },
      usuario: { nome: nomeUsuario, email: emailUsuario },
      preferencias: { idioma, notificacoesEmail: notEmail, notificacoesSMS: notSMS, visibilidadePerfil: visibilidade }
    };
    localStorage.setItem(storageKey, JSON.stringify(next));
    setConfig(next);
    alert('Configurações salvas (mock)');
  }

  function alterarSenha() {
    if (!senhaNova) return alert('Informe a nova senha');
    if (senhaNova.length < 8) return alert('Senha precisa ter ao menos 8 caracteres');
    if (senhaNova !== senhaConf) return alert('Confirmação não confere');
    setSenhaAtual(''); setSenhaNova(''); setSenhaConf('');
    alert('Senha alterada (mock)');
  }

  function restaurarPadrao() {
    localStorage.removeItem(storageKey);
    window.location.reload();
  }

  return (
    <div>
      <DashboardHeader titulo="Configurações do Fornecedor" subtitulo="Perfil da empresa e preferências de usuário" />

      <div className="p-6 space-y-6">
        <section className="card p-4">
          <h4 className="font-semibold mb-2">Dados da Empresa</h4>
          <div className="grid gap-2">
            <label className="text-sm">Razão Social</label>
            <Input value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} />

            <label className="text-sm">Nome Fantasia</label>
            <Input value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} />

            <label className="text-sm">CNPJ</label>
            <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} />

            <label className="text-sm">E-mail de Contato</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm">Telefone</label>
                <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Cidade / UF</label>
                <div className="flex gap-2">
                  <Input value={cidade} onChange={(e) => setCidade(e.target.value)} />
                  <Input value={uf} onChange={(e) => setUf(e.target.value)} className="w-24" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={restaurarPadrao}>Restaurar Padrões</Button>
            <Button onClick={salvar}>Salvar Empresa</Button>
          </div>
        </section>

        <section className="card p-4">
          <h4 className="font-semibold mb-2">Usuário</h4>
          <div className="grid gap-2">
            <label className="text-sm">Nome</label>
            <Input value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} />

            <label className="text-sm">E-mail</label>
            <Input value={emailUsuario} onChange={(e) => setEmailUsuario(e.target.value)} />

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
                <div className="text-xs text-muted-foreground">Receber alertas sobre cotações e pagamentos</div>
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

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Visibilidade do Perfil</div>
                <div className="text-xs text-muted-foreground">Quem pode ver seu perfil de fornecedor</div>
              </div>
              <Select defaultValue={visibilidade} onValueChange={(v) => setVisibilidade(v)}>
                <SelectTrigger>
                  <SelectValue>{visibilidade}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publico">Público</SelectItem>
                  <SelectItem value="restrito">Somente órgãos</SelectItem>
                  <SelectItem value="privado">Privado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={() => { setNomeUsuario(config.usuario.nome); setEmailUsuario(config.usuario.email); setIdioma(config.preferencias.idioma); setNotEmail(config.preferencias.notificacoesEmail); setNotSMS(config.preferencias.notificacoesSMS); setVisibilidade(config.preferencias.visibilidadePerfil); }}>Restaurar</Button>
            <Button onClick={salvar}>Salvar Usuário</Button>
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
