import { test, assert } from 'poku';
import { formatBRL, parseBRL } from '@/shared/utils/currency';
import { runSequentialTests } from '@/test/setup/run';

const normalizeWhitespace = (formatted: string) => formatted.replace(/\s/g, ' ');

runSequentialTests(async () => {
  await test('formatBRL formata numero positivo', () => {
    assert.strictEqual(normalizeWhitespace(formatBRL(1234.56)), 'R$ 1.234,56');
  });

  await test('formatBRL formata zero', () => {
    assert.strictEqual(normalizeWhitespace(formatBRL(0)), 'R$ 0,00');
  });

  await test('formatBRL formata negativo', () => {
    assert.strictEqual(normalizeWhitespace(formatBRL(-99.9)), '-R$ 99,90');
  });

  await test('formatBRL trata null como zero', () => {
    assert.strictEqual(normalizeWhitespace(formatBRL(null)), 'R$ 0,00');
  });

  await test('formatBRL trata undefined como zero', () => {
    assert.strictEqual(normalizeWhitespace(formatBRL(undefined)), 'R$ 0,00');
  });

  await test('formatBRL trata NaN como zero', () => {
    assert.strictEqual(normalizeWhitespace(formatBRL(Number.NaN)), 'R$ 0,00');
  });

  await test('parseBRL aceita string com R$ e separadores', () => {
    assert.strictEqual(parseBRL('R$ 1.234,56'), 1234.56);
  });

  await test('parseBRL aceita string apenas com virgula', () => {
    assert.strictEqual(parseBRL('99,90'), 99.9);
  });

  await test('parseBRL aceita number direto', () => {
    assert.strictEqual(parseBRL(42), 42);
  });

  await test('parseBRL retorna 0 para entrada nao numerica', () => {
    assert.strictEqual(parseBRL('xyz'), 0);
  });

  await test('parseBRL retorna 0 para null e undefined', () => {
    assert.strictEqual(parseBRL(null), 0);
    assert.strictEqual(parseBRL(undefined), 0);
  });

  await test('parseBRL retorna 0 para Infinity', () => {
    assert.strictEqual(parseBRL(Number.POSITIVE_INFINITY), 0);
  });
});
