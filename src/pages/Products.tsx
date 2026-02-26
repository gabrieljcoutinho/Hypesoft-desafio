import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Package, DollarSign, AlertTriangle, X, Info, PieChart as ChartIcon } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { ProductTable } from '../components/ui/ProductTable';
import { ProductModal } from '../components/ui/ProductModal';
import { Product } from '../types/product';

export function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
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

    // LÓGICA DO GRÁFICO: Agrupa a quantidade de produtos por nome de categoria
    const categoryGroups = products.reduce((acc: Record<string, number>, p) => {
      acc[p.categoryId] = (acc[p.categoryId] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(categoryGroups).map(cat => ({
      name: cat,
      value: categoryGroups[cat]
    }));

    return {
      total,
      value,
      lowStockCount: lowStockItems.length,
      lowStockList: lowStockItems,
      chartData
    };
  }, [products]);

  // Cores suaves e modernas para o gráfico
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

  const filteredProducts = products.filter(product => {
    if (searchTerm === 'estoque_baixo') return product.stockQuantity < 10;
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
    <div className="space-y-8 relative pb-10">
      {/* 1. CARDS DE RESUMO */}
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

        <div
          onClick={() => setIsLowStockModalOpen(true)}
          className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 flex items-center gap-4 cursor-pointer hover:bg-amber-50 transition-colors group"
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

      {/* 2. GRÁFICO DE CATEGORIAS (NOVO REQUISITO) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <ChartIcon size={20} className="text-slate-400" />
          <h3 className="text-lg font-bold text-slate-800">Produtos por Categoria</h3>
        </div>
        <div className="h-72 w-full">
          {stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Nenhum dado para exibir no gráfico
            </div>
          )}
        </div>
      </div>

      {/* 3. LISTAGEM E FILTROS */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            {searchTerm === 'estoque_baixo' ? 'Estoque Crítico' : 'Produtos'}
          </h2>
          <p className="text-slate-500">
            {searchTerm === 'estoque_baixo'
              ? 'Itens que precisam de reposição imediata.'
              : 'Gerencie seu catálogo completo.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar..."
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

      {/* TELA SOBRE TUDO (MODAL DE ESTOQUE BAIXO) */}
      {isLowStockModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                    <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Estoque Crítico</h3>
                  <p className="text-slate-500 text-sm">Menos de 10 unidades disponíveis</p>
                </div>
              </div>
              <button onClick={() => setIsLowStockModalOpen(false)} className="hover:bg-slate-200 p-2 rounded-full transition-colors text-slate-400">
                <X size={22} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 p-4 mb-6 bg-blue-50 rounded-xl border border-blue-100 text-blue-700 text-sm">
                <Info size={18} className="flex-shrink-0" />
                <p>Reponha estes itens para evitar perda de vendas.</p>
              </div>
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                {stats.lowStockList.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-5 bg-white rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-100 rounded-md">{product.categoryId}</span>
                    </div>
                    <div className="flex items-baseline gap-1 p-2 px-3 bg-red-50 rounded-lg text-red-700 border border-red-100">
                      <span className="text-2xl font-bold">{product.stockQuantity}</span>
                      <span className="text-[10px] font-bold uppercase tracking-tighter">un</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setSearchTerm('estoque_baixo'); setIsLowStockModalOpen(false); }}
                className="w-full mt-8 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                Gerenciar na Tabela
              </button>
            </div>
          </div>
        </div>
      )}

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