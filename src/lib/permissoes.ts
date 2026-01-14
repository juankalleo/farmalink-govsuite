// FARMALINK - Sistema de Permissões

import { TipoPortal } from '@/types';

interface Permissao {
  visualizar: boolean;
  criar: boolean;
  editar: boolean;
  excluir: boolean;
  aprovar: boolean;
}

interface PermissoesModulo {
  cotacoes: Permissao;
  propostas: Permissao;
  fornecedores: Permissao;
  orgaos: Permissao;
  usuarios: Permissao;
  relatorios: Permissao;
  financeiro: Permissao;
  configuracoes: Permissao;
}

const permissoesPadrao: Permissao = {
  visualizar: false,
  criar: false,
  editar: false,
  excluir: false,
  aprovar: false,
};

export const permissoesPorPapel: Record<TipoPortal, PermissoesModulo> = {
  prefeitura: {
    cotacoes: { visualizar: true, criar: true, editar: true, excluir: false, aprovar: true },
    propostas: { visualizar: true, criar: false, editar: false, excluir: false, aprovar: true },
    fornecedores: { visualizar: true, criar: false, editar: false, excluir: false, aprovar: false },
    orgaos: { visualizar: true, criar: false, editar: true, excluir: false, aprovar: false },
    usuarios: { visualizar: true, criar: true, editar: true, excluir: false, aprovar: false },
    relatorios: { visualizar: true, criar: true, editar: false, excluir: false, aprovar: false },
    financeiro: { visualizar: true, criar: false, editar: false, excluir: false, aprovar: true },
    configuracoes: { visualizar: true, criar: false, editar: true, excluir: false, aprovar: false },
  },
  fornecedor: {
    cotacoes: { visualizar: true, criar: false, editar: false, excluir: false, aprovar: false },
    propostas: { visualizar: true, criar: true, editar: true, excluir: true, aprovar: false },
    fornecedores: { visualizar: false, criar: false, editar: false, excluir: false, aprovar: false },
    orgaos: { visualizar: true, criar: false, editar: false, excluir: false, aprovar: false },
    usuarios: { visualizar: true, criar: true, editar: true, excluir: false, aprovar: false },
    relatorios: { visualizar: true, criar: true, editar: false, excluir: false, aprovar: false },
    financeiro: { visualizar: true, criar: false, editar: false, excluir: false, aprovar: false },
    configuracoes: { visualizar: true, criar: false, editar: true, excluir: false, aprovar: false },
  },
  admin: {
    cotacoes: { visualizar: true, criar: true, editar: true, excluir: true, aprovar: true },
    propostas: { visualizar: true, criar: true, editar: true, excluir: true, aprovar: true },
    fornecedores: { visualizar: true, criar: true, editar: true, excluir: true, aprovar: true },
    orgaos: { visualizar: true, criar: true, editar: true, excluir: true, aprovar: true },
    usuarios: { visualizar: true, criar: true, editar: true, excluir: true, aprovar: true },
    relatorios: { visualizar: true, criar: true, editar: true, excluir: true, aprovar: true },
    financeiro: { visualizar: true, criar: true, editar: true, excluir: true, aprovar: true },
    configuracoes: { visualizar: true, criar: true, editar: true, excluir: true, aprovar: true },
  },
};

export function verificarPermissao(
  papel: TipoPortal,
  modulo: keyof PermissoesModulo,
  acao: keyof Permissao
): boolean {
  return permissoesPorPapel[papel]?.[modulo]?.[acao] ?? false;
}

export function obterPermissoesModulo(
  papel: TipoPortal,
  modulo: keyof PermissoesModulo
): Permissao {
  return permissoesPorPapel[papel]?.[modulo] ?? permissoesPadrao;
}
