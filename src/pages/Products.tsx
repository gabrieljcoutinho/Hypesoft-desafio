import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Package, DollarSign, AlertTriangle, X, Info } from 'lucide-react'; // Adicionado Info
import { ProductTable } from '../components/ui/ProductTable';
import { ProductModal } from '../components/ui/ProductModal';
import { Product } from '../types/product';

export function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para controlar a "tela sobre tudo" do estoque baixo
  const [isLowStockModalOpen, setIsLowStockModalOpen] = useState(false);

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
      lowStockCount: lowStockItems.length,
      lowStockList: lowStockItems // Guardamos a lista para mostrar no modal
    };
  }, [products]);

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
    <div className="space-y-8 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => setSearchTerm('')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-Slate-100 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
          title="Clique para ver todos os produtos"
        >
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

        {/* CARD DE ALERTA - Suavizado */}
        <div
          onClick={() => setIsLowStockModalOpen(true)}
          className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 flex items-center gap-4 cursor-pointer hover:bg-amber-50 transition-colors group"
          title="Clique para ver quais produtos estão com estoque baixo"
        >
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-100 transition-colors">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Estoque Baixo</p>
            <p className="text-2xl font-bold text-amber-700">{stats.lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* TELA SOBRE TUDO (MODAL DE ESTOQUE BAIXO) - DESIGN REFINADO E SUAVE */}
      {isLowStockModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-10 duration-500 ease-out">
            {/* Cabeçalho mais elegante e suave */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                    <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Relatório de Estoque Crítico</h3>
                  <p className="text-slate-500 text-sm">Produtos com menos de 10 unidades em stock</p>
                </div>
              </div>
              <button
                onClick={() => setIsLowStockModalOpen(false)}
                className="hover:bg-slate-200 p-2 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              {/* Info box suave */}
              <div className="flex items-center gap-3 p-4 mb-6 bg-blue-50 rounded-xl border border-blue-100 text-blue-700 text-sm">
                <Info size={18} className="flex-shrink-0" />
                <p>Estes itens requerem reposição urgente para evitar ruturas de stock.</p>
              </div>

              {/* Lista com design mais limpo e espaçamento melhor */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                {stats.lowStockList.length > 0 ? (
                  stats.lowStockList.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-5 bg-white rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-slate-50 transition-colors group">
                      <div className="flex flex-col gap-0.5">
                        <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{product.name}</p>
                        <span className="text-xs text-slate-500 px-2.5 py-1 bg-slate-100 rounded-full w-fit">{product.categoryId}</span>
                      </div>
                      <div className="flex items-end gap-1.5 p-3 px-4 bg-red-50 rounded-xl border border-red-100 text-red-700">
                        <span className="text-3xl font-extrabold leading-none">{product.stockQuantity}</span>
                        <span className="text-xs font-medium uppercase tracking-wider pb-0.5">unid.</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-xl border border-slate-100">
                    <Package size={40} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-slate-600">Excelente! 🎉</p>
                    <p className="text-sm">Nenhum produto com estoque crítico no momento.</p>
                  </div>
                )}
              </div>

              {/* Botão de ação principal suave mas visível */}
              <button
                onClick={() => {
                  setSearchTerm('estoque_baixo');
                  setIsLowStockModalOpen(false);
                }}
                className="w-full mt-8 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-[0.98] text-center"
              >
                Visualizar todos na tabela de produtos
              </button>
            </div>
          </div>
        </div>
      )}

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

      {searchTerm === 'estoque_baixo' && (
        <button
          onClick={() => setSearchTerm('')}
          className="text-sm text-blue-600 hover:underline mb-4 flex items-center gap-1"
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