import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import AddDiscoForm from '@/components/products/AddDiscoForm';

export default function AddProductPage() {
  return (
    <>
      <PageBreadCrumb pageTitle="Adicionar Produto" />

      <div className="grid gap-6">
        <AddDiscoForm />
      </div>

      {/* Guia de como verificar localStorage */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          🔍 Como Verificar o localStorage?
        </h3>

        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <h4 className="mb-2 font-medium font-semibold">1️⃣ Abra o DevTools</h4>
            <p>Pressione <code className="inline-block rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700">F12</code> ou <code className="inline-block rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700">Cmd+Option+I</code> (Mac)</p>
          </div>

          <div>
            <h4 className="mb-2 font-medium font-semibold">2️⃣ Navegue para Application</h4>
            <p>Clique na aba <strong>Application</strong> no DevTools</p>
          </div>

          <div>
            <h4 className="mb-2 font-medium font-semibold">3️⃣ Abra Local Storage</h4>
            <p>Na seção esquerda, procure por <strong>Local Storage</strong> → <strong>http://localhost:3001</strong></p>
          </div>

          <div>
            <h4 className="mb-2 font-medium font-semibold">4️⃣ Procure pela chave</h4>
            <p>Você verá uma chave chamada <code className="inline-block rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700">app_discos</code></p>
          </div>

          <div>
            <h4 className="mb-2 font-medium font-semibold">5️⃣ Veja os dados</h4>
            <p>O valor dessa chave conterá um array JSON com todos os discos (produtos) salvos</p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            💡 <strong>Dica:</strong> Após adicionar um disco, o localStorage será atualizado automaticamente.
            Se recarregar a página (F5), os dados permanecerão porque estão no localStorage!
          </p>
        </div>
      </div>
    </>
  );
}
