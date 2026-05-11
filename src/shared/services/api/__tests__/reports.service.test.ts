import { test, assert } from 'poku';
import { runSequentialTests } from '@/test/setup/run';
import { setupApiMock } from '@/test/setup/lifecycle';
import { reportsService } from '@/shared/services/api';

setupApiMock();

runSequentialTests(async () => {
  await test('reportsService.detailedRevenue envia ano e mes na query', async () => {
    const rows = await reportsService.detailedRevenue({ ano: 2026, mes: 5 });
    assert.strictEqual(rows.length, 1);
    assert.strictEqual(rows[0].ano, 2026);
    assert.strictEqual(rows[0].mes, 5);
    assert.strictEqual(rows[0].nomeArtista, 'Stevie Wonder');
  });

  await test('reportsService.revenueSummary retorna receita-despesa', async () => {
    const rows = await reportsService.revenueSummary({ ano: 2026, mes: 1 });
    assert.strictEqual(rows[0].lucro, 225);
    assert.strictEqual(rows[0].totalDespesa, 275);
  });

  await test('reportsService.channelRevenue retorna agregado por canal', async () => {
    const rows = await reportsService.channelRevenue({ ano: 2026, mes: 3 });
    assert.strictEqual(rows[0].nomeCanal, 'Site');
    assert.strictEqual(rows[0].receita, 500);
  });

  await test('reportsService.profitPerItem retorna linhas com lucro calculado', async () => {
    const rows = await reportsService.profitPerItem({ ano: 2026, mes: 5 });
    assert.strictEqual(rows.length, 1);
    const firstRow = rows[0];
    assert.strictEqual(firstRow.ano, 2026);
    assert.strictEqual(firstRow.mes, 5);
    assert.strictEqual(firstRow.precoVenda, 450);
    assert.strictEqual(firstRow.custoDisco, 20.5);
    assert.strictEqual(firstRow.totalDespesa, 40.5);
    assert.strictEqual(firstRow.lucro, 409.5);
  });

  await test('reportsService.profitPerItem propaga ano/mes na query string', async () => {
    const rows = await reportsService.profitPerItem({ ano: 2025, mes: 12 });
    assert.strictEqual(rows[0].ano, 2025);
    assert.strictEqual(rows[0].mes, 12);
    assert.strictEqual(rows[0].dataVenda, '2025-12-15');
  });
});