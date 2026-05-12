import { test, assert } from 'poku';
import { act } from '@pokujs/react/react-testing';
import { runSequentialTests } from '@/test/setup/run';
import { setupReactDom } from '@/test/setup/lifecycle';
import { renderHookWithQuery } from '@/test/setup/react-query';
import { useModal } from '@/shared/hooks/useModal';

setupReactDom();

runSequentialTests(async () => {
  await test('useModal inicia fechado por padrão', () => {
    const { result } = renderHookWithQuery(() => useModal());
    assert.strictEqual(result.current.isOpen, false);
  });

  await test('useModal respeita initialState=true', () => {
    const { result } = renderHookWithQuery(() => useModal(true));
    assert.strictEqual(result.current.isOpen, true);
  });

  await test('openModal abre o modal', () => {
    const { result } = renderHookWithQuery(() => useModal());
    act(() => result.current.openModal());
    assert.strictEqual(result.current.isOpen, true);
  });

  await test('closeModal fecha o modal', () => {
    const { result } = renderHookWithQuery(() => useModal(true));
    act(() => result.current.closeModal());
    assert.strictEqual(result.current.isOpen, false);
  });

  await test('toggleModal alterna o estado', () => {
    const { result } = renderHookWithQuery(() => useModal());
    act(() => result.current.toggleModal());
    assert.strictEqual(result.current.isOpen, true);
    act(() => result.current.toggleModal());
    assert.strictEqual(result.current.isOpen, false);
  });
});
