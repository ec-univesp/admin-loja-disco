import { test, assert } from 'poku';
import { notifySuccess, notifyError } from '@/shared/utils/notify';
import { ApiError } from '@/shared/services/api/client';
import { runSequentialTests } from '@/test/setup/run';
import { spyToast } from '@/test/setup/toast-spy';

const toastSpy = spyToast();

runSequentialTests(async () => {
  try {
    await test('notifySuccess emite toast de sucesso', () => {
      toastSpy.clear();
      notifySuccess('disco salvo');
      assert.deepStrictEqual(toastSpy.last(), { type: 'success', message: 'disco salvo' });
    });

    await test('notifyError com ApiError + body string formata "status: body"', () => {
      toastSpy.clear();
      notifyError('Falha', new ApiError('m', 422, 'campo invalido'));
      assert.strictEqual(toastSpy.last().description, '422: campo invalido');
    });

    await test('notifyError com ApiError extrai message do body objeto', () => {
      toastSpy.clear();
      notifyError('Falha', new ApiError('m', 400, { message: 'campo X invalido' }));
      assert.strictEqual(toastSpy.last().description, '400: campo X invalido');
    });

    await test('notifyError com ApiError extrai error do body objeto', () => {
      toastSpy.clear();
      notifyError('Falha', new ApiError('m', 500, { error: 'server down' }));
      assert.strictEqual(toastSpy.last().description, '500: server down');
    });

    await test('notifyError com ApiError sem message ou error usa fallback', () => {
      toastSpy.clear();
      notifyError('Falha', new ApiError('m', 500, {}));
      assert.strictEqual(
        toastSpy.last().description,
        '500: Verifique os dados e tente novamente.'
      );
    });

    await test('notifyError com Error generico usa message', () => {
      toastSpy.clear();
      notifyError('Falha', new Error('boom'));
      assert.strictEqual(toastSpy.last().description, 'boom');
    });

    await test('notifyError com tipo desconhecido usa "Erro desconhecido"', () => {
      toastSpy.clear();
      notifyError('Falha', 'string-solta');
      assert.strictEqual(toastSpy.last().description, 'Erro desconhecido');
    });
  } finally {
    toastSpy.restore();
  }
});
