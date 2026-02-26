import { Plus } from 'lucide-react';
import { ProductTable } from '../components/ui/ProductTable';
import { Product } from '../types/product';

// Mova os dados fictícios para cá
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Teclado Mecânico RGB',
    description: 'Switch Blue, padrão ABNT2 com iluminação customizável.',
    price: 350.00,
    categoryId: 'c1',
    category: { id: 'c1', name: 'Periféricos' },
    stockQuantity: 15
  }
];

export function ProductsPage() {
  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Produtos</h2>
          <p className="text-slate-500">Gerencie seu catálogo de produtos.</p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={20} />
          Novo Produto
        </button>
      </header>

      <ProductTable products={MOCK_PRODUCTS} />
    </div>
  );
}