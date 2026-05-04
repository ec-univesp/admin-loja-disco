import { test, assert } from 'poku';
import { runSequentialTests } from '@/test/setup/run';
import { http, HttpResponse } from 'msw';
import { setupApiMock } from '@/test/setup/lifecycle';
import { server } from '@/test/setup/server';
import { db } from '@/test/setup/db';
import { makeArtist } from '@/test/factories';
import { artistsService } from '@/shared/services/api';
import { ApiError } from '@/shared/services/api/client';

setupApiMock();

runSequentialTests(async () => {
  await test('artistsService.list retorna todos os artistas', async () => {
    db.artists.push(makeArtist({ artistaId: 1 }), makeArtist({ artistaId: 2, nomeArtista: 'Caetano' }));
    const list = await artistsService.list();
    assert.strictEqual(list.length, 2);
    assert.strictEqual(list[1].nomeArtista, 'Caetano');
  });

  await test('artistsService.getById retorna o artista correto', async () => {
    db.artists.push(makeArtist({ artistaId: 7, nomeArtista: 'Gil' }));
    const artist = await artistsService.getById(7);
    assert.strictEqual(artist.nomeArtista, 'Gil');
  });

  await test('artistsService.getById lanca ApiError 404 para id inexistente', async () => {
    await assert.rejects(() => artistsService.getById(999), ApiError);
  });

  await test('artistsService.create persiste o artista no db', async () => {
    await artistsService.create({ nomeArtista: 'Novo' });
    assert.strictEqual(db.artists.length, 1);
    assert.strictEqual(db.artists[0].nomeArtista, 'Novo');
    assert.ok(db.artists[0].artistaId !== undefined);
  });

  await test('artistsService.update aplica modificacoes', async () => {
    db.artists.push(makeArtist({ artistaId: 5, nomeArtista: 'Antigo' }));
    await artistsService.update({ artistaId: 5, nomeArtista: 'Novo Nome' });
    assert.strictEqual(db.artists[0].nomeArtista, 'Novo Nome');
  });

  await test('artistsService.delete remove do db', async () => {
    db.artists.push(makeArtist({ artistaId: 1 }));
    await artistsService.delete(1);
    assert.strictEqual(db.artists.length, 0);
  });

  await test('artistsService propaga erros 500 como ApiError', async () => {
    server.use(
      http.get('http://localhost:8080/artistas/lista', () => new HttpResponse(null, { status: 500 }))
    );
    await assert.rejects(() => artistsService.list(), ApiError);
  });
});