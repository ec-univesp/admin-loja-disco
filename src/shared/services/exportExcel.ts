'use client';

import ExcelJS from 'exceljs';
import type { AppState } from '@/shared/types/models';

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

function gerarCSV(linhas: Array<Record<string, unknown>>): string {
  if (linhas.length === 0) return '';
  const cabecalhos = Object.keys(linhas[0]);
  const escapar = (val: unknown) => {
    const str = String(val ?? '');
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };
  return [
    cabecalhos.map(escapar).join(','),
    ...linhas.map((linha) => cabecalhos.map((k) => escapar(linha[k])).join(',')),
  ].join('\n');
}

function downloadCSV(conteudo: string, filename: string) {
  const bom = '\uFEFF';
  const blob = new Blob([bom + conteudo], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportarTabelaCSV(linhas: Array<Record<string, unknown>>, filename: string) {
  downloadCSV(gerarCSV(linhas), filename);
}

export async function exportarTabelaExcel(
  nomeAba: string,
  linhas: Array<Record<string, unknown>>,
  filename: string
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Admin Loja de Disco';
  workbook.created = new Date();
  appendSheet(workbook, nomeAba, linhas);
  await downloadWorkbook(workbook, filename);
}

export async function exportarBackupCompleto(state: Partial<AppState>) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Admin Loja de Disco';
  workbook.created = new Date();

  const paraLinhasExcel = (colecao: unknown) => (colecao ?? []) as Array<Record<string, unknown>>;

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

export function exportarRelatorioFinanceiroCSV(params: {
  resumoMensal: Array<{ mes: string; receita: number; despesas: number; lucro: number }>;
  vendasDetalhe: Array<Record<string, unknown>>;
}) {
  const stamp = new Date().toISOString().slice(0, 10);
  downloadCSV(gerarCSV(params.vendasDetalhe), `relatorio-financeiro-${stamp}.csv`);
}
