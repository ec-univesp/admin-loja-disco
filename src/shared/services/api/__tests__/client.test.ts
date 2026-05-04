import { test, assert } from 'poku';
import { runSequentialTests } from '@/test/setup/run';
import { http, HttpResponse } from 'msw';
import { setupApiMock } from '@/test/setup/lifecycle';
import { server } from '@/test/setup/server';
import { apiClient, ApiError, request } from '@/shared/services/api/client';

setupApiMock();

runSequentialTests(async () => {
  await test('ApiError carrega status e body', async () => {
    server.use(
      http.get('http://localhost:8080/teste-erro', () =>
        HttpResponse.json({ msg: 'invalido' }, { status: 422 })
      )
    );
    try {
      await apiClient.get('/teste-erro');
      assert.fail('deveria ter lancado');
    } catch (err) {
      assert.ok(err instanceof ApiError);
      assert.strictEqual((err as ApiError).status, 422);
      assert.deepStrictEqual((err as ApiError).body, { msg: 'invalido' });
    }
  });

  await test('apiClient.get serializa query params na URL', async () => {
    let captured = '';
    server.use(
      http.get('http://localhost:8080/q', ({ request }) => {
        captured = request.url;
        return HttpResponse.json({ ok: true });
      })
    );
    await apiClient.get('/q', { foo: 'bar', n: 10, b: true, skip: undefined, nullable: null });
    assert.match(captured, /foo=bar/);
    assert.match(captured, /n=10/);
    assert.match(captured, /b=true/);
    assert.ok(!captured.includes('skip='));
    assert.ok(!captured.includes('nullable='));
  });

  await test('apiClient.post envia body em JSON', async () => {
    let receivedBody: unknown;
    server.use(
      http.post('http://localhost:8080/echo', async ({ request }) => {
        receivedBody = await request.json();
        return HttpResponse.json({ ok: true });
      })
    );
    await apiClient.post('/echo', { a: 1, b: 'x' });
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
    await apiClient.put('/echo', { id: 1 });
    assert.deepStrictEqual(receivedBody, { id: 1 });
  });

  await test('apiClient.delete usa metodo DELETE', async () => {
    let method = '';
    server.use(
      http.delete('http://localhost:8080/x', ({ request }) => {
        method = request.method;
        return HttpResponse.json('ok');
      })
    );
    await apiClient.delete('/x');
    assert.strictEqual(method, 'DELETE');
  });

  await test('request retorna texto bruto quando resposta nao e JSON', async () => {
    server.use(
      http.get('http://localhost:8080/raw', () => new HttpResponse('texto-puro', { status: 200 }))
    );
    const result = await request<string>('/raw');
    assert.strictEqual(result, 'texto-puro');
  });

  await test('request lida com path sem barra inicial', async () => {
    server.use(
      http.get('http://localhost:8080/sem-barra', () => HttpResponse.json({ ok: true }))
    );
    const r = await request<{ ok: boolean }>('sem-barra');
    assert.strictEqual(r.ok, true);
  });
});