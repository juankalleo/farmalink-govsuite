import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CardIndicador } from '@/components/indicadores/CardIndicador';
import { UploadCloud, Save, RotateCw } from 'lucide-react';

type AdminConfig = {
  siteTitle: string;
  logoDataUrl?: string;
  primaryColor?: string;
  emailFrom?: string;
  smtpHost?: string;
  maintenanceMode: boolean;
};

const DEFAULTS: AdminConfig = {
  siteTitle: 'NextFarma',
  logoDataUrl: '/iconfarmalink.png',
  primaryColor: '#ef4444',
  emailFrom: 'no-reply@nextfarma.gov.br',
  smtpHost: '',
  maintenanceMode: false,
};

export default function ConfiguracoesAdmin() {
  const [cfg, setCfg] = useState<AdminConfig>(DEFAULTS);

  useEffect(() => {
    try { const raw = localStorage.getItem('admin_config'); if (raw) setCfg(JSON.parse(raw)); } catch {}
  }, []);

  function save() { localStorage.setItem('admin_config', JSON.stringify(cfg)); alert('Configurações salvas (local)'); }
  function resetDefaults() { if (!confirm('Restaurar padrões?')) return; setCfg(DEFAULTS); localStorage.removeItem('admin_config'); }

  function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader(); reader.onload = () => setCfg(c => ({ ...c, logoDataUrl: String(reader.result) })); reader.readAsDataURL(f);
  }

  return (
    <>
      <DashboardHeader titulo="Configurações" subtitulo="Ajustes globais do sistema" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardIndicador titulo="Modo Manutenção" valor={cfg.maintenanceMode ? 'Ativo' : 'Desativado'} tipo="texto" />
          <CardIndicador titulo="E-mail padrão" valor={cfg.emailFrom || '-'} tipo="texto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-4">
            <h3 className="text-lg font-medium">E-mail / SMTP</h3>
            <p className="text-sm text-muted-foreground mt-1">Configurações usadas para envios automáticos.</p>

            <div className="mt-4 space-y-3">
              <label className="text-sm">E-mail remetente</label>
              <Input value={cfg.emailFrom} onChange={(e) => setCfg(s => ({ ...s, emailFrom: e.target.value }))} />

              <label className="text-sm">SMTP host</label>
              <Input value={cfg.smtpHost} onChange={(e) => setCfg(s => ({ ...s, smtpHost: e.target.value }))} />

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm">Modo manutenção</label>
                  <div className="text-sm text-muted-foreground">Bloqueia acesso público quando ativado.</div>
                </div>
                <Switch checked={cfg.maintenanceMode} onCheckedChange={(v) => setCfg(s => ({ ...s, maintenanceMode: Boolean(v) }))} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={save}><Save className="mr-2" />Salvar</Button>
          <Button variant="ghost" onClick={resetDefaults}><RotateCw className="mr-2" />Restaurar padrões</Button>
        </div>
      </div>
    </>
  );
}
