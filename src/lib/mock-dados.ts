// FARMALINK - Dados Mock Realistas

import { Cotacao, CentroCusto, Fornecedor, DadosGrafico, Transacao } from '@/types';

// Dados de execução orçamentária mensal
export const dadosOrcamentoMensal: DadosGrafico[] = [
  { nome: 'Jan', previsto: 1200000, executado: 1150000 },
  { nome: 'Fev', previsto: 1200000, executado: 1180000 },
  { nome: 'Mar', previsto: 1300000, executado: 1250000 },
  { nome: 'Abr', previsto: 1250000, executado: 1200000 },
  { nome: 'Mai', previsto: 1400000, executado: 1350000 },
  { nome: 'Jun', previsto: 1350000, executado: 1280000 },
  { nome: 'Jul', previsto: 1500000, executado: 1420000 },
  { nome: 'Ago', previsto: 1450000, executado: 1380000 },
  { nome: 'Set', previsto: 1600000, executado: 1520000 },
  { nome: 'Out', previsto: 1550000, executado: 1480000 },
  { nome: 'Nov', previsto: 1700000, executado: 1620000 },
  { nome: 'Dez', previsto: 1800000, executado: 1750000 },
];

// Dados por centro de custo
export const dadosPorCentroCusto: DadosGrafico[] = [
  { nome: 'UBS Central', orcamento: 2500000, executado: 2150000, economia: 350000 },
  { nome: 'Hospital Municipal', orcamento: 5800000, executado: 5200000, economia: 600000 },
  { nome: 'CAPS', orcamento: 1200000, executado: 980000, economia: 220000 },
  { nome: 'UPA Norte', orcamento: 1800000, executado: 1650000, economia: 150000 },
  { nome: 'UPA Sul', orcamento: 1600000, executado: 1480000, economia: 120000 },
  { nome: 'Farmácia Central', orcamento: 3200000, executado: 2900000, economia: 300000 },
];

// Consumo de medicamentos por período (heatmap data)
export const consumoMedicamentosPeriodo: DadosGrafico[] = [
  { nome: 'Antibióticos', jan: 85, fev: 78, mar: 92, abr: 88, mai: 75, jun: 82 },
  { nome: 'Anti-hipertensivos', jan: 120, fev: 115, mar: 125, abr: 130, mai: 135, jun: 128 },
  { nome: 'Analgésicos', jan: 200, fev: 185, mar: 210, abr: 195, mai: 220, jun: 205 },
  { nome: 'Antidiabéticos', jan: 95, fev: 98, mar: 102, abr: 105, mai: 108, jun: 110 },
  { nome: 'Anti-inflamatórios', jan: 150, fev: 145, mar: 160, abr: 155, mai: 170, jun: 165 },
];

// Ranking medicamentos mais comprados
export const rankingMedicamentos = [
  { posicao: 1, nome: 'Dipirona 500mg', quantidade: 125000, valor: 187500, variacao: 5.2 },
  { posicao: 2, nome: 'Losartana 50mg', quantidade: 98000, valor: 294000, variacao: 12.3 },
  { posicao: 3, nome: 'Metformina 850mg', quantidade: 87500, valor: 175000, variacao: -3.1 },
  { posicao: 4, nome: 'Omeprazol 20mg', quantidade: 76000, valor: 228000, variacao: 8.7 },
  { posicao: 5, nome: 'Enalapril 10mg', quantidade: 65000, valor: 130000, variacao: 2.4 },
  { posicao: 6, nome: 'Amoxicilina 500mg', quantidade: 54000, valor: 162000, variacao: -1.8 },
  { posicao: 7, nome: 'Sinvastatina 20mg', quantidade: 48000, valor: 144000, variacao: 6.9 },
  { posicao: 8, nome: 'AAS 100mg', quantidade: 42000, valor: 42000, variacao: 0.5 },
];

// Preço médio vs tempo de entrega (dispersão)
export const precoVsEntrega = [
  { fornecedor: 'Distribuidora A', precoMedio: 15.50, tempoEntrega: 3, volume: 2500 },
  { fornecedor: 'Distribuidora B', precoMedio: 14.20, tempoEntrega: 5, volume: 3200 },
  { fornecedor: 'Distribuidora C', precoMedio: 16.80, tempoEntrega: 2, volume: 1800 },
  { fornecedor: 'Distribuidora D', precoMedio: 13.90, tempoEntrega: 7, volume: 4100 },
  { fornecedor: 'Distribuidora E', precoMedio: 15.10, tempoEntrega: 4, volume: 2900 },
  { fornecedor: 'Distribuidora F', precoMedio: 17.50, tempoEntrega: 1, volume: 1200 },
];

// === PORTAL FORNECEDOR ===

// Faturamento mensal do fornecedor
export const faturamentoMensal: DadosGrafico[] = [
  { nome: 'Jan', bruto: 320000, liquido: 288000 },
  { nome: 'Fev', bruto: 280000, liquido: 252000 },
  { nome: 'Mar', bruto: 420000, liquido: 378000 },
  { nome: 'Abr', bruto: 380000, liquido: 342000 },
  { nome: 'Mai', bruto: 450000, liquido: 405000 },
  { nome: 'Jun', bruto: 520000, liquido: 468000 },
  { nome: 'Jul', bruto: 480000, liquido: 432000 },
  { nome: 'Ago', bruto: 550000, liquido: 495000 },
  { nome: 'Set', bruto: 620000, liquido: 558000 },
  { nome: 'Out', bruto: 580000, liquido: 522000 },
  { nome: 'Nov', bruto: 680000, liquido: 612000 },
  { nome: 'Dez', bruto: 750000, liquido: 675000 },
];

// Propostas ganhas vs perdidas
export const propostasResultado: DadosGrafico[] = [
  { nome: 'Jan', ganhas: 12, perdidas: 8 },
  { nome: 'Fev', ganhas: 10, perdidas: 12 },
  { nome: 'Mar', ganhas: 15, perdidas: 7 },
  { nome: 'Abr', ganhas: 18, perdidas: 5 },
  { nome: 'Mai', ganhas: 14, perdidas: 9 },
  { nome: 'Jun', ganhas: 20, perdidas: 6 },
];

// Participação por órgão
export const participacaoPorOrgao = [
  { nome: 'Prefeitura Municipal A', valor: 35, cor: 'hsl(var(--chart-1))' },
  { nome: 'Secretaria de Saúde B', valor: 28, cor: 'hsl(var(--chart-2))' },
  { nome: 'Hospital Regional C', valor: 20, cor: 'hsl(var(--chart-3))' },
  { nome: 'UPA Municipal D', valor: 12, cor: 'hsl(var(--chart-4))' },
  { nome: 'Outros', valor: 5, cor: 'hsl(var(--chart-5))' },
];

// Comparativo preço ofertado x vencedor
export const comparativoPrecos: DadosGrafico[] = [
  { nome: 'Cotação #001', ofertado: 125000, vencedor: 118000 },
  { nome: 'Cotação #002', ofertado: 89000, vencedor: 89000 },
  { nome: 'Cotação #003', ofertado: 156000, vencedor: 142000 },
  { nome: 'Cotação #004', ofertado: 78000, vencedor: 78000 },
  { nome: 'Cotação #005', ofertado: 234000, vencedor: 220000 },
  { nome: 'Cotação #006', ofertado: 67000, vencedor: 67000 },
];

// === PORTAL ADMIN ===

// Crescimento mensal (órgãos x fornecedores)
export const crescimentoMensal: DadosGrafico[] = [
  { nome: 'Jan', orgaos: 45, fornecedores: 120 },
  { nome: 'Fev', orgaos: 48, fornecedores: 135 },
  { nome: 'Mar', orgaos: 52, fornecedores: 158 },
  { nome: 'Abr', orgaos: 58, fornecedores: 175 },
  { nome: 'Mai', orgaos: 62, fornecedores: 198 },
  { nome: 'Jun', orgaos: 68, fornecedores: 220 },
  { nome: 'Jul', orgaos: 75, fornecedores: 245 },
  { nome: 'Ago', orgaos: 82, fornecedores: 268 },
  { nome: 'Set', orgaos: 88, fornecedores: 295 },
  { nome: 'Out', orgaos: 95, fornecedores: 320 },
  { nome: 'Nov', orgaos: 102, fornecedores: 348 },
  { nome: 'Dez', orgaos: 110, fornecedores: 380 },
];

// Receita por tipo
export const receitaPorTipo: DadosGrafico[] = [
  { nome: 'Jan', taxaAdm: 45000, takeRate: 120000, outros: 15000 },
  { nome: 'Fev', taxaAdm: 48000, takeRate: 135000, outros: 18000 },
  { nome: 'Mar', taxaAdm: 52000, takeRate: 158000, outros: 22000 },
  { nome: 'Abr', taxaAdm: 55000, takeRate: 175000, outros: 25000 },
  { nome: 'Mai', taxaAdm: 60000, takeRate: 198000, outros: 28000 },
  { nome: 'Jun', taxaAdm: 65000, takeRate: 220000, outros: 32000 },
];

// Distribuição de usuários
export const distribuicaoUsuarios = [
  { nome: 'Administradores', valor: 12, cor: 'hsl(var(--chart-1))' },
  { nome: 'Gestores Públicos', valor: 156, cor: 'hsl(var(--chart-2))' },
  { nome: 'Fornecedores', valor: 380, cor: 'hsl(var(--chart-3))' },
  { nome: 'Analistas', valor: 89, cor: 'hsl(var(--chart-4))' },
];

// Retenção de fornecedores (cohort simplificado)
export const retencaoFornecedores: DadosGrafico[] = [
  { nome: 'Mês 1', retencao: 100 },
  { nome: 'Mês 2', retencao: 85 },
  { nome: 'Mês 3', retencao: 72 },
  { nome: 'Mês 4', retencao: 68 },
  { nome: 'Mês 5', retencao: 65 },
  { nome: 'Mês 6', retencao: 62 },
];

// Ranking maiores órgãos por volume
export const rankingOrgaos = [
  { posicao: 1, nome: 'Prefeitura Municipal de São Paulo', volume: 12500000, cotacoes: 145 },
  { posicao: 2, nome: 'Secretaria de Saúde - RJ', volume: 8700000, cotacoes: 98 },
  { posicao: 3, nome: 'Hospital Municipal de BH', volume: 6200000, cotacoes: 67 },
  { posicao: 4, nome: 'Prefeitura de Curitiba', volume: 4800000, cotacoes: 52 },
  { posicao: 5, nome: 'Secretaria de Saúde - RS', volume: 3900000, cotacoes: 45 },
];

// Lista de cotações mock
export const cotacoesMock: Cotacao[] = [
  {
    id: '1',
    numero: 'COT-2024-001',
    titulo: 'Aquisição de Medicamentos Básicos - 1º Trimestre',
    status: 'publicada',
    dataCriacao: new Date('2024-01-15'),
    dataLimite: new Date('2024-02-15'),
    valorEstimado: 850000,
    orgaoId: '1',
    orgaoNome: 'Prefeitura Municipal',
    quantidadeItens: 45,
    propostas: 8,
  },
  {
    id: '2',
    numero: 'COT-2024-002',
    titulo: 'Medicamentos Especializados - Oncologia',
    status: 'em_analise',
    dataCriacao: new Date('2024-01-20'),
    dataLimite: new Date('2024-02-28'),
    valorEstimado: 1200000,
    orgaoId: '1',
    orgaoNome: 'Hospital Municipal',
    quantidadeItens: 28,
    propostas: 5,
  },
  {
    id: '3',
    numero: 'COT-2024-003',
    titulo: 'Insumos Hospitalares - UTI',
    status: 'adjudicada',
    dataCriacao: new Date('2024-01-10'),
    dataLimite: new Date('2024-02-10'),
    valorEstimado: 650000,
    valorFinal: 580000,
    orgaoId: '2',
    orgaoNome: 'UPA Norte',
    quantidadeItens: 62,
    propostas: 12,
  },
  {
    id: '4',
    numero: 'COT-2024-004',
    titulo: 'Materiais de Curativo e Sutura',
    status: 'concluida',
    dataCriacao: new Date('2024-01-05'),
    dataLimite: new Date('2024-01-25'),
    valorEstimado: 320000,
    valorFinal: 298000,
    orgaoId: '3',
    orgaoNome: 'UBS Central',
    quantidadeItens: 35,
    propostas: 15,
  },
];

// Centros de custo mock
export const centrosCustoMock: CentroCusto[] = [
  { id: '1', codigo: 'CC-001', nome: 'UBS Central', orcamentoAnual: 2500000, orcamentoExecutado: 2150000, ativo: true },
  { id: '2', codigo: 'CC-002', nome: 'Hospital Municipal', orcamentoAnual: 5800000, orcamentoExecutado: 5200000, ativo: true },
  { id: '3', codigo: 'CC-003', nome: 'CAPS', orcamentoAnual: 1200000, orcamentoExecutado: 980000, ativo: true },
  { id: '4', codigo: 'CC-004', nome: 'UPA Norte', orcamentoAnual: 1800000, orcamentoExecutado: 1650000, ativo: true },
  { id: '5', codigo: 'CC-005', nome: 'UPA Sul', orcamentoAnual: 1600000, orcamentoExecutado: 1480000, ativo: true },
  { id: '6', codigo: 'CC-006', nome: 'Farmácia Central', orcamentoAnual: 3200000, orcamentoExecutado: 2900000, ativo: true },
];

// Fornecedores mock
export const fornecedoresMock: Fornecedor[] = [
  { id: '1', razaoSocial: 'Distribuidora Pharma Brasil LTDA', nomeFantasia: 'Pharma Brasil', cnpj: '12.345.678/0001-90', endereco: 'Rua das Farmácias, 100', cidade: 'São Paulo', uf: 'SP', email: 'contato@pharmabrasil.com.br', telefone: '(11) 3456-7890', categoria: 'Distribuidora', avaliacaoMedia: 4.5, ativo: true },
  { id: '2', razaoSocial: 'MedSupply Comércio de Medicamentos', nomeFantasia: 'MedSupply', cnpj: '23.456.789/0001-01', endereco: 'Av. Industrial, 500', cidade: 'Guarulhos', uf: 'SP', email: 'vendas@medsupply.com.br', telefone: '(11) 2345-6789', categoria: 'Atacadista', avaliacaoMedia: 4.2, ativo: true },
  { id: '3', razaoSocial: 'Saúde Total Distribuidora', nomeFantasia: 'Saúde Total', cnpj: '34.567.890/0001-12', endereco: 'Rod. BR-101, Km 50', cidade: 'Rio de Janeiro', uf: 'RJ', email: 'comercial@saudetotal.com.br', telefone: '(21) 3456-7890', categoria: 'Distribuidora', avaliacaoMedia: 4.8, ativo: true },
];
