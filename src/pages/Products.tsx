import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Package, DollarSign, AlertTriangle } from 'lucide-react';
import { ProductTable } from '../components/ui/ProductTable';
import { ProductModal } from '../components/ui/ProductModal';
import { Product } from '../types/product';

export function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
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

  const stats = useMemo(() => {
    const total = products.length;
    const value = products.reduce((acc, p) => acc + (p.price * p.stockQuantity), 0);
    const lowStockItems = products.filter(p => p.stockQuantity < 10);

    return {
      total,
      value,
      lowStockCount: lowStockItems.length
    };
  }, [products]);

  // LÓGICA DE FILTRO: Se o searchTerm for "estoque_baixo", filtramos por quantidade
  const filteredProducts = products.filter(product => {
    if (searchTerm === 'estoque_baixo') {
      return product.stockQuantity < 10;
    }
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Total - Clicar aqui limpa o filtro */}
        <div
          onClick={() => setSearchTerm('')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
          title="Clique para ver todos os produtos"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package size={24} /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total de Produtos</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>
        </div>

        {/* Card Valor */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><DollarSign size={24} /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Valor do Estoque</p>
            <p className="text-2xl font-bold text-slate-800">
              {stats.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>

        {/* CARD DE ALERTA COM ONCLICK */}
        <div
          onClick={() => setSearchTerm('estoque_baixo')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-center gap-4 cursor-pointer hover:bg-red-50 transition-colors group"
          title="Clique para ver produtos com estoque baixo"
        >
          <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Estoque Baixo</p>
            <p className="text-2xl font-bold text-red-600">{stats.lowStockCount}</p>
          </div>
        </div>
      </div>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            {searchTerm === 'estoque_baixo' ? 'Produtos com Estoque Baixo' : 'Produtos'}
          </h2>
          <p className="text-slate-500">
            {searchTerm === 'estoque_baixo'
              ? 'Exibindo apenas itens com menos de 10 unidades.'
              : 'Gerencie seu catálogo de produtos.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-64"
              value={searchTerm === 'estoque_baixo' ? '' : searchTerm}
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

      {/* Botão para limpar filtro se estiver em modo estoque baixo */}
      {searchTerm === 'estoque_baixo' && (
        <button
          onClick={() => setSearchTerm('')}
          className="text-sm text-blue-600 hover:underline mb-4"
        >
          ← Voltar para todos os produtos
        </button>
      )}

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