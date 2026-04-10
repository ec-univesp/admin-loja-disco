'use client';

import ExcelJS from 'exceljs';
import type { AppState } from '@/types/models';

/**
 * Salva o workbook como .xlsx e dispara o download no navegador.
 */
async function downloadWorkbook(workbook: ExcelJS.Workbook, filename: string) {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const linkDownload = document.createElement('a');
  linkDownload.href = url;
  linkDownload.download = filename;
  document.body.appendChild(linkDownload);
  linkDownload.click();
  document.body.removeChild(linkDownload);
  URL.revokeObjectURL(url);
}

const LARGURA_MINIMA_COLUNA = 12;

/**
 * Adiciona uma aba a partir de um array de objetos. Inferência simples
 * de colunas: chaves do primeiro item viram cabeçalho.
 */
function appendSheet(
  workbook: ExcelJS.Workbook,
  nomeAba: string,
  linhas: Array<Record<string, unknown>>
) {
  const aba = workbook.addWorksheet(nomeAba);
  if (linhas.length === 0) {
    aba.addRow(['(sem dados)']);
    return;
  }
  const cabecalhos = Object.keys(linhas[0]);
  aba.columns = cabecalhos.map((cabecalho) => ({
    header: cabecalho,
    key: cabecalho,
    width: Math.max(LARGURA_MINIMA_COLUNA, cabecalho.length + 2),
  }));
  aba.getRow(1).font = { bold: true };
  linhas.forEach((linha) => aba.addRow(linha));
}

/**
 * Gera um arquivo .xlsx consolidado com todas as entidades do app
 * (uma aba por entidade) e dispara o download.
 */
export async function exportarBackupCompleto(state: Partial<AppState>) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Admin Loja de Disco';
  workbook.created = new Date();

  const paraLinhasExcel = (colecao: unknown) =>
    (colecao ?? []) as Array<Record<string, unknown>>;

  const abasParaExportar: Array<[string, Array<Record<string, unknown>>]> = [
    ['Generos', paraLinhasExcel(state.generosMusical)],
    ['Artistas', paraLinhasExcel(state.artistas)],
    ['Discos', paraLinhasExcel(state.discos)],
    ['Clientes', paraLinhasExcel(state.clientes)],
    ['Enderecos', paraLinhasExcel(state.enderecos)],
    ['ClienteEnderecos', paraLinhasExcel(state.clientesEnderecos)],
    ['Vendas', paraLinhasExcel(state.vendas)],
    ['ItensVenda', paraLinhasExcel(state.itensVenda)],
    ['Compras', paraLinhasExcel(state.compras)],
    ['ItensCompra', paraLinhasExcel(state.itensCompra)],
    ['CanaisVenda', paraLinhasExcel(state.canaisVenda)],
  ];

  abasParaExportar.forEach(([nomeAba, linhas]) => appendSheet(workbook, nomeAba, linhas));

  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  await downloadWorkbook(workbook, `backup-loja-disco-${stamp}.xlsx`);
}

/**
 * Exporta apenas o relatório financeiro (vendas + agregados)
 */
export async function exportarRelatorioFinanceiro(params: {
  resumoMensal: Array<{ mes: string; receita: number; despesas: number; lucro: number }>;
  topProdutos: Array<{ album: string; artista: string; qtd: number; receita: number }>;
  formasPagamento: Array<{ forma: string; total: number; percentual: number }>;
  vendasDetalhe: Array<Record<string, unknown>>;
}) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Admin Loja de Disco';
  workbook.created = new Date();

  appendSheet(workbook, 'Resumo Mensal', params.resumoMensal);
  appendSheet(workbook, 'Top Produtos', params.topProdutos);
  appendSheet(workbook, 'Formas Pagamento', params.formasPagamento);
  appendSheet(workbook, 'Vendas', params.vendasDetalhe);

  const stamp = new Date().toISOString().slice(0, 10);
  await downloadWorkbook(workbook, `relatorio-financeiro-${stamp}.xlsx`);
}
