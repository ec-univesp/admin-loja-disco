// Utilitários para formatação de valores monetários em pt-BR.

export const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formata um número como moeda brasileira (R$ 1.234,56).
 */
export function formatBRL(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return BRL_FORMATTER.format(0);
  }
  return BRL_FORMATTER.format(value);
}

/**
 * Converte uma string digitada pelo usuário em pt-BR (ex: "1.234,56" ou "1234,56")
 * para um número. Retorna 0 se a entrada for inválida.
 */
export function parseBRL(input: string | number | null | undefined): number {
  if (input === null || input === undefined) return 0;
  if (typeof input === 'number') return Number.isFinite(input) ? input : 0;

  const normalized = input
    .replace(/\s/g, '')
    .replace(/R\$/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}
