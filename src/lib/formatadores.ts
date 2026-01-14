// FARMALINK - Funções de Formatação

/**
 * Formata valor monetário em Real brasileiro
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Formata valor monetário compacto (K, M, B)
 */
export function formatarMoedaCompacta(valor: number): string {
  if (valor >= 1000000000) {
    return `R$ ${(valor / 1000000000).toFixed(1)}B`;
  }
  if (valor >= 1000000) {
    return `R$ ${(valor / 1000000).toFixed(1)}M`;
  }
  if (valor >= 1000) {
    return `R$ ${(valor / 1000).toFixed(0)}K`;
  }
  return formatarMoeda(valor);
}

/**
 * Formata número com separador de milhar
 */
export function formatarNumero(valor: number): string {
  return new Intl.NumberFormat('pt-BR').format(valor);
}

/**
 * Formata número compacto
 */
export function formatarNumeroCompacto(valor: number): string {
  if (valor >= 1000000) {
    return `${(valor / 1000000).toFixed(1)}M`;
  }
  if (valor >= 1000) {
    return `${(valor / 1000).toFixed(0)}K`;
  }
  return formatarNumero(valor);
}

/**
 * Formata percentual
 */
export function formatarPercentual(valor: number, casasDecimais: number = 1): string {
  return `${valor.toFixed(casasDecimais)}%`;
}

/**
 * Formata data no padrão brasileiro
 */
export function formatarData(data: Date | string): string {
  const d = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/**
 * Formata data e hora no padrão brasileiro
 */
export function formatarDataHora(data: Date | string): string {
  const d = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Formata CNPJ
 */
export function formatarCNPJ(cnpj: string): string {
  const numeros = cnpj.replace(/\D/g, '');
  return numeros.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

/**
 * Formata telefone
 */
export function formatarTelefone(telefone: string): string {
  const numeros = telefone.replace(/\D/g, '');
  if (numeros.length === 11) {
    return numeros.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }
  return numeros.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
}

/**
 * Calcula variação percentual
 */
export function calcularVariacao(atual: number, anterior: number): number {
  if (anterior === 0) return 0;
  return ((atual - anterior) / anterior) * 100;
}

/**
 * Retorna classe CSS baseada no valor da variação
 */
export function classeVariacao(variacao: number): string {
  if (variacao > 0) return 'text-success';
  if (variacao < 0) return 'text-destructive';
  return 'text-muted-foreground';
}

/**
 * Retorna ícone baseado no status
 */
export function iconeStatus(status: string): 'positivo' | 'negativo' | 'neutro' {
  const positivos = ['concluida', 'adjudicada', 'aprovado', 'ativo', 'vencedora'];
  const negativos = ['cancelada', 'recusada', 'inativo', 'perdida'];
  
  if (positivos.includes(status)) return 'positivo';
  if (negativos.includes(status)) return 'negativo';
  return 'neutro';
}
