'use client';

import ExcelJS from 'exceljs';
import type { AppState } from '@/shared/types/index';
import type { MusicGenreDTO } from '@/shared/services/api';

async function downloadWorkbook(workbook: ExcelJS.Workbook, filename: string) {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const MIN_COLUMN_WIDTH = 12;

function appendSheet(
  workbook: ExcelJS.Workbook,
  sheetName: string,
  rows: Array<Record<string, unknown>>
) {
  const sheet = workbook.addWorksheet(sheetName);
  if (rows.length === 0) {
    sheet.addRow(['(no data)']);
    return;
  }
  const headers = Object.keys(rows[0]);
  sheet.columns = headers.map((header) => ({
    header,
    key: header,
    width: Math.max(MIN_COLUMN_WIDTH, header.length + 2),
  }));
  sheet.getRow(1).font = { bold: true };
  rows.forEach((row) => sheet.addRow(row));
}

function generateCSV(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (val: unknown) => {
    const str = String(val ?? '');
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };
  return [
    headers.map(escape).join(','),
    ...rows.map((row) => headers.map((k) => escape(row[k])).join(',')),
  ].join('\n');
}

function downloadCSV(content: string, filename: string) {
  const bom = '﻿';
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportTableToExcel(
  sheetName: string,
  rows: Array<Record<string, unknown>>,
  filename: string
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Admin Loja de Disco';
  workbook.created = new Date();
  appendSheet(workbook, sheetName, rows);
  await downloadWorkbook(workbook, filename);
}

export async function exportFullBackup(
  state: Partial<AppState>,
  genres: MusicGenreDTO[] = []
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Admin Loja de Disco';
  workbook.created = new Date();

  const toRows = (collection: unknown) => (collection ?? []) as Array<Record<string, unknown>>;

  const sheets: Array<[string, Array<Record<string, unknown>>]> = [
    ['Genres', toRows(genres)],
    ['Artists', toRows(state.artists)],
    ['Records', toRows(state.records)],
    ['Customers', toRows(state.customers)],
    ['Addresses', toRows(state.addresses)],
    ['CustomerAddresses', toRows(state.customerAddresses)],
    ['Sales', toRows(state.sales)],
    ['SaleItems', toRows(state.saleItems)],
    ['Purchases', toRows(state.purchases)],
    ['PurchaseItems', toRows(state.purchaseItems)],
    ['SalesChannels', toRows(state.salesChannels)],
  ];

  sheets.forEach(([name, rows]) => appendSheet(workbook, name, rows));

  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  await downloadWorkbook(workbook, `vinyl-store-backup-${stamp}.xlsx`);
}

export async function exportFinancialReport(params: {
  monthlySummary: Array<{ month: string; revenue: number; expenses: number; profit: number }>;
  topProducts: Array<{ album: string; artista: string; qtd: number; receita: number }>;
  paymentMethods: Array<{ forma: string; total: number; percentual: number }>;
  salesDetails: Array<Record<string, unknown>>;
}) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Admin Loja de Disco';
  workbook.created = new Date();

  appendSheet(workbook, 'Monthly Summary', params.monthlySummary);
  appendSheet(workbook, 'Top Products', params.topProducts);
  appendSheet(workbook, 'Payment Methods', params.paymentMethods);
  appendSheet(workbook, 'Sales', params.salesDetails);

  const stamp = new Date().toISOString().slice(0, 10);
  await downloadWorkbook(workbook, `financial-report-${stamp}.xlsx`);
}

export function exportFinancialReportCSV(params: {
  monthlySummary: Array<{ month: string; revenue: number; expenses: number; profit: number }>;
  salesDetails: Array<Record<string, unknown>>;
}) {
  const stamp = new Date().toISOString().slice(0, 10);
  downloadCSV(generateCSV(params.salesDetails), `financial-report-${stamp}.csv`);
}
