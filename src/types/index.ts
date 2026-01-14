// FARMALINK - Tipos do Sistema Enterprise

export type TipoPortal = 'prefeitura' | 'fornecedor' | 'admin';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: TipoPortal;
  ativo: boolean;
  criadoEm: Date;
  ultimoAcesso?: Date;
}

export interface Cotacao {
  id: string;
  numero: string;
  titulo: string;
  status: 'rascunho' | 'publicada' | 'em_analise' | 'adjudicada' | 'cancelada' | 'concluida';
  dataCriacao: Date;
  dataLimite: Date;
  valorEstimado: number;
  valorFinal?: number;
  orgaoId: string;
  orgaoNome: string;
  quantidadeItens: number;
  propostas: number;
}

export interface Proposta {
  id: string;
  cotacaoId: string;
  fornecedorId: string;
  fornecedorNome: string;
  valorTotal: number;
  dataEnvio: Date;
  status: 'enviada' | 'em_analise' | 'vencedora' | 'recusada';
  prazoEntrega: number;
}

export interface Medicamento {
  id: string;
  nome: string;
  principioAtivo: string;
  apresentacao: string;
  unidade: string;
  categoria: string;
}

export interface ItemCotacao {
  id: string;
  medicamentoId: string;
  medicamento: Medicamento;
  quantidade: number;
  precoUnitarioEstimado: number;
  precoUnitarioFinal?: number;
}

export interface CentroCusto {
  id: string;
  codigo: string;
  nome: string;
  orcamentoAnual: number;
  orcamentoExecutado: number;
  ativo: boolean;
}

export interface OrgaoPublico {
  id: string;
  nome: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  uf: string;
  responsavel: string;
  email: string;
  telefone: string;
}

export interface Fornecedor {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  uf: string;
  email: string;
  telefone: string;
  categoria: string;
  avaliacaoMedia: number;
  ativo: boolean;
}

export interface IndicadorDashboard {
  titulo: string;
  valor: string | number;
  variacao?: number;
  icone?: string;
  tipo?: 'moeda' | 'percentual' | 'numero' | 'texto';
}

export interface DadosGrafico {
  nome: string;
  [key: string]: string | number;
}

export interface Transacao {
  id: string;
  tipo: 'entrada' | 'saida';
  descricao: string;
  valor: number;
  data: Date;
  status: 'pendente' | 'processada' | 'cancelada';
  referencia?: string;
}
