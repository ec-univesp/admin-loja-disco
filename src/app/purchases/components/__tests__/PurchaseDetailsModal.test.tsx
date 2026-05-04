import { test, assert } from 'poku';
import { render, screen, fireEvent } from '@pokujs/react/react-testing';
import { runSequentialTests } from '@/test/setup/run';
import { setupReactDom } from '@/test/setup/lifecycle';
import { makePurchase, makePurchaseItem } from '@/test/factories';
import PurchaseDetailsModal from '@/app/purchases/components/PurchaseDetailsModal';

setupReactDom();

const renderModal = (overrides: Partial<Parameters<typeof PurchaseDetailsModal>[0]> = {}) => {
  const onClose = overrides.onClose ?? (() => {});
  return render(
    <PurchaseDetailsModal
      isOpen={overrides.isOpen ?? true}
      onClose={onClose}
      purchaseNumber={overrides.purchaseNumber ?? 'CMP-0001'}
      purchase={overrides.purchase ?? null}
    />
  );
};

runSequentialTests(async () => {
  await test('nao renderiza nada quando isOpen=false', () => {
    const { container } = renderModal({ isOpen: false });
    assert.strictEqual(container.querySelector('.modal'), null);
  });

  await test('exibe numero da compra no cabecalho', () => {
    renderModal({
      purchaseNumber: 'CMP-0017',
      purchase: makePurchase({ compraId: 17, itens: [makePurchaseItem()] }),
    });
    assert.ok(screen.getByText('CMP-0017'));
  });

  await test('exibe um item por linha com nome do disco, artista e custo formatado', () => {
    renderModal({
      purchase: makePurchase({
        valorTotal: 9999,
        itens: [
          makePurchaseItem({ id: 1, nomeDisco: 'A', nomeArtista: 'Artista A', custoDisco: 50 }),
          makePurchaseItem({ id: 2, nomeDisco: 'B', nomeArtista: 'Artista B', custoDisco: 99.9 }),
        ],
      }),
    });
    assert.ok(screen.getByText('A'));
    assert.ok(screen.getByText('Artista A'));
    assert.ok(screen.getByText('B'));
    assert.ok(screen.getByText(/50,00/));
    assert.ok(screen.getByText(/99,90/));
  });

  await test('exibe total agregado (valorTotal vence soma dos itens)', () => {
    renderModal({
      purchase: makePurchase({
        valorTotal: 1500,
        itens: [makePurchaseItem({ custoDisco: 50 })],
      }),
    });
    assert.ok(screen.getByText(/1\.500,00/));
  });

  await test('soma os custos quando valorTotal nao informado', () => {
    renderModal({
      purchase: makePurchase({
        valorTotal: undefined,
        itens: [
          makePurchaseItem({ id: 1, custoDisco: 50 }),
          makePurchaseItem({ id: 2, custoDisco: 75 }),
        ],
      }),
    });
    assert.ok(screen.getByText(/125,00/));
  });

  await test('mostra mensagem de vazio quando purchase nulo', () => {
    renderModal({ purchase: null });
    assert.ok(screen.getByText(/nenhum item registrado/i));
  });

  await test('mostra mensagem de vazio quando lista de itens vazia', () => {
    renderModal({ purchase: makePurchase({ itens: [] }) });
    assert.ok(screen.getByText(/nenhum item registrado/i));
  });

  await test('botao fechar aciona onClose', () => {
    let called = 0;
    renderModal({
      onClose: () => {
        called += 1;
      },
      purchase: makePurchase(),
    });
    fireEvent.click(screen.getByRole('button', { name: /fechar/i }));
    assert.strictEqual(called, 1);
  });
});
