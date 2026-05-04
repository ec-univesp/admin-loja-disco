import { test, assert } from 'poku';
import { runSequentialTests } from '@/test/setup/run';
import { setupApiMock } from '@/test/setup/lifecycle';
import { db } from '@/test/setup/db';
import { makeGenre } from '@/test/factories';
import { genresService } from '@/shared/services/api';
import { ApiError } from '@/shared/services/api/client';

setupApiMock();

runSequentialTests(async () => {
  await test('genresService.list retorna todos os generos', async () => {
    db.genres.push(makeGenre({ generoMusicalId: 1 }), makeGenre({ generoMusicalId: 2, nomeGenero: 'ROCK' }));
    const list = await genresService.list();
    assert.strictEqual(list.length, 2);
  });

  await test('genresService.getById retorna o genero correto', async () => {
    db.genres.push(makeGenre({ generoMusicalId: 4, nomeGenero: 'MPB' }));
    const g = await genresService.getById(4);
    assert.strictEqual(g.nomeGenero, 'MPB');
  });

  await test('genresService.getById lanca 404 quando nao existe', async () => {
    await assert.rejects(() => genresService.getById(999), ApiError);
  });

  await test('genresService.create persiste no db', async () => {
    await genresService.create({ nomeGenero: 'PUNK' });
    assert.strictEqual(db.genres.length, 1);
    assert.strictEqual(db.genres[0].nomeGenero, 'PUNK');
  });

  await test('genresService.update aplica mudancas', async () => {
    db.genres.push(makeGenre({ generoMusicalId: 3, nomeGenero: 'Old' }));
    await genresService.update({ generoMusicalId: 3, nomeGenero: 'New' });
    assert.strictEqual(db.genres[0].nomeGenero, 'New');
  });

  await test('genresService.delete remove do db', async () => {
    db.genres.push(makeGenre({ generoMusicalId: 1 }));
    await genresService.delete(1);
    assert.strictEqual(db.genres.length, 0);
  });
});