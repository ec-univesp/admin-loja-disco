import { test, assert } from 'poku';
import { runSequentialTests } from '@/test/setup/run';
import { http, HttpResponse } from 'msw';
import { z } from 'zod';
import { setupApiMock } from '@/test/setup/lifecycle';
import { server } from '@/test/setup/server';
import { apiClient, ApiError, request } from '@/shared/services/api/client';

setupApiMock();

const okSchema = z.object({ ok: z.boolean() });
const textSchema = z.string();

runSequentialTests(async () => {
  await test('ApiError carrega status e body', async () => {
    server.use(
      http.get('http://localhost:8080/teste-erro', () =>
        HttpResponse.json({ msg: 'invalido' }, { status: 422 })
      )
    );
    try {
      await apiClient.get('/teste-erro', okSchema);
      assert.fail('deveria ter lancado');
    } catch (caughtError) {
      assert.ok(caughtError instanceof ApiError);
      if (caughtError instanceof ApiError) {
        assert.strictEqual(caughtError.status, 422);
        assert.deepStrictEqual(caughtError.body, { msg: 'invalido' });
      }
    }
  });

  await test('apiClient.get serializa query params na URL', async () => {
    let capturedUrl = '';
    server.use(
      http.get('http://localhost:8080/q', ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json({ ok: true });
      })
    );
    await apiClient.get('/q', okSchema, {
      foo: 'bar',
      n: 10,
      b: true,
      skip: undefined,
      nullable: null,
    });
    assert.match(capturedUrl, /foo=bar/);
    assert.match(capturedUrl, /n=10/);
    assert.match(capturedUrl, /b=true/);
    assert.ok(!capturedUrl.includes('skip='));
    assert.ok(!capturedUrl.includes('nullable='));
  });

  await test('apiClient.post envia body em JSON', async () => {
    let receivedBody: unknown;
    server.use(
      http.post('http://localhost:8080/echo', async ({ request }) => {
        receivedBody = await request.json();
        return HttpResponse.json({ ok: true });
      })
    );
    await apiClient.post('/echo', okSchema, { a: 1, b: 'x' });
    assert.deepStrictEqual(receivedBody, { a: 1, b: 'x' });
  });

  await test('apiClient.put envia body em JSON', async () => {
    let receivedBody: unknown;
    server.use(
      http.put('http://localhost:8080/echo', async ({ request }) => {
        receivedBody = await request.json();
        return HttpResponse.json({ ok: true });
      })
    );
    await apiClient.put('/echo', okSchema, { id: 1 });
    assert.deepStrictEqual(receivedBody, { id: 1 });
  });

  await test('apiClient.delete usa metodo DELETE', async () => {
    let methodUsed = '';
    server.use(
      http.delete('http://localhost:8080/x', ({ request }) => {
        methodUsed = request.method;
        return HttpResponse.json('ok');
      })
    );
    await apiClient.delete('/x', textSchema);
    assert.strictEqual(methodUsed, 'DELETE');
  });

  await test('request retorna texto bruto quando resposta nao e JSON', async () => {
    server.use(
      http.get('http://localhost:8080/raw', () => new HttpResponse('texto-puro', { status: 200 }))
    );
    const rawResult = await request('/raw', textSchema);
    assert.strictEqual(rawResult, 'texto-puro');
  });

  await test('request lida com path sem barra inicial', async () => {
    server.use(
      http.get('http://localhost:8080/sem-barra', () => HttpResponse.json({ ok: true }))
    );
    const response = await request('sem-barra', okSchema);
    assert.strictEqual(response.ok, true);
  });

  await test('request rejeita payload que nao bate com o schema', async () => {
    server.use(
      http.get('http://localhost:8080/invalido', () => HttpResponse.json({ outra: 'coisa' }))
    );
    await assert.rejects(() => apiClient.get('/invalido', okSchema));
  });
});
