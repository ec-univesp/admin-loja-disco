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
});