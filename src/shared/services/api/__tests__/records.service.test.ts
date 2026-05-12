import { test, assert } from 'poku';
import { runSequentialTests } from '@/test/setup/run';
import { http, HttpResponse } from 'msw';
import { setupApiMock } from '@/test/setup/lifecycle';
import { server } from '@/test/setup/server';
import { db } from '@/test/setup/db';
import { makeRecord } from '@/test/factories';
import { recordsService } from '@/shared/services/api';
import { ApiError } from '@/shared/services/api/client';

setupApiMock();

runSequentialTests(async () => {
  await test('recordsService.list retorna todos os discos', async () => {
    db.records.push(
      makeRecord({ discoId: 1, status: 'DISPONIVEL' }),
      makeRecord({ discoId: 2, status: 'VENDIDO', album: 'Tropicalia' })
    );
    const list = await recordsService.list();
    assert.strictEqual(list.length, 2);
  });

  await test('recordsService.listFiltered(1) exclui VENDIDO', async () => {
    db.records.push(
      makeRecord({ discoId: 1, status: 'DISPONIVEL' }),
      makeRecord({ discoId: 2, status: 'VENDIDO' }),
      makeRecord({ discoId: 3, status: 'DISPONIVEL', album: 'Outro' })
    );
    const list = await recordsService.listFiltered(1);
    assert.strictEqual(list.length, 2);
    assert.ok(list.every((r) => r.status !== 'VENDIDO'));
  });

  await test('recordsService.listFiltered(2) exclui DISPONIVEL', async () => {
    db.records.push(
      makeRecord({ discoId: 1, status: 'DISPONIVEL' }),
      makeRecord({ discoId: 2, status: 'VENDIDO' })
    );
    const list = await recordsService.listFiltered(2);
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].status, 'VENDIDO');
  });

  await test('recordsService.search filtra por album', async () => {
    db.records.push(
      makeRecord({ discoId: 1, album: 'In Square Circle' }),
      makeRecord({ discoId: 2, album: 'Outra Coisa' })
    );
    const list = await recordsService.search({ termo: 'square' });
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].album, 'In Square Circle');
  });

  await test('recordsService.search filtra por nome do artista', async () => {
    db.records.push(
      makeRecord({ discoId: 1, artista: { artistaId: 1, nomeArtista: 'Stevie Wonder' } }),
      makeRecord({ discoId: 2, album: 'Outro', artista: { artistaId: 2, nomeArtista: 'Caetano' } })
    );
    const list = await recordsService.search({ termo: 'caetano' });
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].artista?.nomeArtista, 'Caetano');
  });

  await test('recordsService.getById retorna disco correto', async () => {
    db.records.push(makeRecord({ discoId: 42, album: 'Achado' }));
    const r = await recordsService.getById(42);
    assert.strictEqual(r.album, 'Achado');
  });

  await test('recordsService.getById 404', async () => {
    await assert.rejects(() => recordsService.getById(999), ApiError);
  });

  await test('recordsService.create persiste', async () => {
    const payload = { ...makeRecord(), discoId: undefined };
    await recordsService.create(payload);
    assert.strictEqual(db.records.length, 1);
    assert.strictEqual(db.records[0].album, 'In Square Circle');
    assert.ok(db.records[0].discoId !== undefined);
  });

  await test('recordsService.update modifica disco', async () => {
    db.records.push(makeRecord({ discoId: 5, status: 'DISPONIVEL' }));
    await recordsService.update({ ...makeRecord({ discoId: 5 }), status: 'VENDIDO' });
    assert.strictEqual(db.records[0].status, 'VENDIDO');
  });

  await test('recordsService.delete remove do db', async () => {
    db.records.push(makeRecord({ discoId: 1 }));
    await recordsService.delete(1);
    assert.strictEqual(db.records.length, 0);
  });

  await test('recordsService.list aceita campos null vindos do backend (Spring Optional vazio)', async () => {
    server.use(
      http.get('http://localhost:8080/discos/lista', () =>
        HttpResponse.json([
          {
            discoId: 99,
            album: 'Vazio',
            artista: { artistaId: 1, nomeArtista: 'X' },
            encarte: null,
            custoDisco: null,
            gravadora: null,
            condicaoDisco: null,
            generosMusicais: null,
            status: 'DISPONIVEL',
          },
        ])
      )
    );
    const list = await recordsService.list();
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].album, 'Vazio');
    assert.strictEqual(list[0].encarte, undefined);
    assert.strictEqual(list[0].custoDisco, undefined);
    assert.strictEqual(list[0].generosMusicais, undefined);
  });
});