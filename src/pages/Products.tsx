import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Package, DollarSign, AlertTriangle } from 'lucide-react';
import { ProductTable } from '../components/ui/ProductTable';
import { ProductModal } from '../components/ui/ProductModal';
import { Product } from '../types/product';

export function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // NOVO: Estado para a busca
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5169/api/Products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  // CÁLCULOS DO DASHBOARD (Memorizados para performance)
  const stats = useMemo(() => {
    const total = products.length;
    const value = products.reduce((acc, p) => acc + (p.price * p.stockQuantity), 0);
    const lowStock = products.filter(p => p.stockQuantity < 10).length;
    return { total, value, lowStock };
  }, [products]);

  // LÓGICA DE BUSCA
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string | number) => {
    if (confirm("Deseja realmente excluir este produto?")) {
      try {
        const response = await fetch(`http://localhost:5169/api/Products/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) fetchProducts();
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-8">
      {/* SEÇÃO DE CARDS (DASHBOARD) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package size={24} /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total de Produtos</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><DollarSign size={24} /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Valor do Estoque</p>
            <p className="text-2xl font-bold text-slate-800">
              {stats.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Estoque Baixo</p>
            <p className="text-2xl font-bold text-slate-800">{stats.lowStock}</p>
          </div>
        </div>
      </div>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Produtos</h2>
          <p className="text-slate-500">Gerencie seu catálogo de produtos.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* BARRA DE BUSCA */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={20} /> Novo Produto
          </button>
        </div>
      </header>

      {/* TABELA COM DADOS FILTRADOS */}
      <ProductTable
        products={filteredProducts}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <ProductModal
        isOpen={isModalOpen}
        product={editingProduct}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(undefined);
          fetchProducts();
        }}
      />
    </div>
  );
}