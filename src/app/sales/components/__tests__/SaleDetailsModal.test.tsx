import { test, assert } from 'poku';
import { render, screen, fireEvent } from '@pokujs/react/react-testing';
import { runSequentialTests } from '@/test/setup/run';
import { setupReactDom } from '@/test/setup/lifecycle';
import { makeSale, makeSaleItem } from '@/test/factories';
import SaleDetailsModal from '@/app/sales/components/SaleDetailsModal';

setupReactDom();

const renderModal = (overrides: Partial<Parameters<typeof SaleDetailsModal>[0]> = {}) => {
  const onClose = overrides.onClose ?? (() => {});
  return render(
    <SaleDetailsModal
      isOpen={overrides.isOpen ?? true}
      onClose={onClose}
      saleNumber={overrides.saleNumber ?? 'VND-0001'}
      sale={overrides.sale ?? null}
    />
  );
};

runSequentialTests(async () => {
  await test('nao renderiza nada quando isOpen=false', () => {
    const { container } = renderModal({ isOpen: false });
    assert.strictEqual(container.querySelector('.modal'), null);
  });

  await test('exibe numero da venda no cabecalho', () => {
    renderModal({
      saleNumber: 'VND-0042',
      sale: makeSale({ vendaId: 42, itens: [makeSaleItem()] }),
    });
    assert.ok(screen.getByText('VND-0042'));
  });

  await test('exibe um item por linha com nome do disco, artista e preco formatado', () => {
    renderModal({
      sale: makeSale({
        itens: [
          makeSaleItem({ id: 1, nomeDisco: 'A', nomeArtista: 'Artista A', precoVenda: 100 }),
          makeSaleItem({ id: 2, nomeDisco: 'B', nomeArtista: 'Artista B', precoVenda: 250.5 }),
        ],
      }),
    });
    assert.ok(screen.getByText('A'));
    assert.ok(screen.getByText('Artista A'));
    assert.ok(screen.getByText('B'));
    assert.ok(screen.getByText('Artista B'));
    assert.ok(screen.getByText(/100,00/));
    assert.ok(screen.getByText(/250,50/));
  });

  await test('exibe total agregado (valorTotal vence soma dos itens)', () => {
    renderModal({
      sale: makeSale({
        valorTotal: 999,
        itens: [makeSaleItem({ precoVenda: 100 })],
      }),
    });
    assert.ok(screen.getByText(/999,00/));
  });

  await test('soma os itens quando valorTotal nao informado', () => {
    renderModal({
      sale: makeSale({
        valorTotal: undefined,
        itens: [
          makeSaleItem({ id: 1, precoVenda: 100 }),
          makeSaleItem({ id: 2, precoVenda: 200 }),
        ],
      }),
    });
    assert.ok(screen.getByText(/300,00/));
  });

  await test('mostra mensagem de vazio quando sale nulo', () => {
    renderModal({ sale: null });
    assert.ok(screen.getByText(/nenhum item registrado/i));
  });

  await test('mostra mensagem de vazio quando lista de itens vazia', () => {
    renderModal({ sale: makeSale({ itens: [] }) });
    assert.ok(screen.getByText(/nenhum item registrado/i));
  });

  await test('botao fechar aciona onClose', () => {
    let called = 0;
    renderModal({
      onClose: () => {
        called += 1;
      },
      sale: makeSale(),
    });
    fireEvent.click(screen.getByRole('button', { name: /fechar/i }));
    assert.strictEqual(called, 1);
  });
});
