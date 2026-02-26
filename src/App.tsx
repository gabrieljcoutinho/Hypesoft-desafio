import { Sidebar } from './components/layout/Sidebar';
import { SummaryCard } from './components/ui/SummaryCard';
import { ProductTable } from './components/ui/ProductTable';
import { Package, DollarSign, AlertTriangle, Plus } from 'lucide-react';
import { Product } from './types/product';

// Dados fictícios para teste
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Teclado Mecânico RGB',
    description: 'Switch Blue, padrão ABNT2 com iluminação customizável.',
    price: 350.00,
    categoryId: 'c1',
    category: { id: 'c1', name: 'Periféricos' },
    stockQuantity: 15
  },
  {
    id: '2',
    name: 'Monitor 24" Full HD',
    description: 'Painel IPS, 144Hz para alta performance em jogos.',
    price: 1200.00,
    categoryId: 'c2',
    category: { id: 'c2', name: 'Monitores' },
    stockQuantity: 5 // Estoque baixo!
  }
];

function App() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
            <p className="text-slate-500 text-sm">Visão geral do seu sistema de inventário.</p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
            <Plus size={20} />
            Novo Produto
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <SummaryCard title="Total de Produtos" value={MOCK_PRODUCTS.length} icon={Package} colorClass="bg-blue-500" />
          <SummaryCard title="Valor em Estoque" value="R$ 1.550,00" icon={DollarSign} colorClass="bg-emerald-500" />
          <SummaryCard title="Estoque Baixo" value="1" icon={AlertTriangle} colorClass="bg-amber-500" />
        </div>

        <section>
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Produtos Recentes</h3>
          <ProductTable products={MOCK_PRODUCTS} />
        </section>
      </main>
    </div>
  );
}

export default App;