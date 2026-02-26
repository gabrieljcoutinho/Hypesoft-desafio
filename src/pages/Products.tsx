import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Package, DollarSign, AlertTriangle, X } from 'lucide-react'; // Adicionado X para fechar
import { ProductTable } from '../components/ui/ProductTable';
import { ProductModal } from '../components/ui/ProductModal';
import { Product } from '../types/product';

export function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  // NOVO: Estado para controlar a "tela sobre tudo" do estoque baixo
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
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
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

        {/* MODIFICADO: Agora abre o Modal de Detalhes */}
        <div
          onClick={() => setIsLowStockModalOpen(true)}
          className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-center gap-4 cursor-pointer hover:bg-red-50 transition-colors group"
          title="Clique para ver quais produtos estão com estoque baixo"
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

      {/* TELA SOBRE TUDO (MODAL DE ESTOQUE BAIXO) */}
      {isLowStockModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-red-600 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <AlertTriangle size={28} />
                <div>
                  <h3 className="text-xl font-bold">Atenção!</h3>
                  <p className="text-red-100 text-xs">Itens com menos de 10 unidades</p>
                </div>
              </div>
              <button
                onClick={() => setIsLowStockModalOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {stats.lowStockList.length > 0 ? (
                  stats.lowStockList.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-red-200 transition-colors">
                      <div>
                        <p className="font-bold text-slate-800">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.categoryId}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-red-600 font-black text-lg">{product.stockQuantity}</span>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">unidades</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-8">Nenhum produto com estoque baixo! 🎉</p>
                )}
              </div>

              <button
                onClick={() => {
                  setSearchTerm('estoque_baixo');
                  setIsLowStockModalOpen(false);
                }}
                className="w-full mt-6 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-[0.98]"
              >
                Ver todos na tabela detalhada
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