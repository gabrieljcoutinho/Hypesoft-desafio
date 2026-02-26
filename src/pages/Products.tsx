import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Package, DollarSign, AlertTriangle, X, Info, ChartPie } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ProductTable } from '../components/ui/ProductTable';
import { ProductModal } from '../components/ui/ProductModal';
import { Product } from '../types/productType';

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

    const categoryGroups = products.reduce((acc: Record<string, number>, p) => {
      acc[p.categoryId] = (acc[p.categoryId] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(categoryGroups).map(cat => ({
      name: cat,
      value: categoryGroups[cat]
    }));

    return { total, value, lowStockCount: lowStockItems.length, lowStockList: lowStockItems, chartData };
  }, [products]);

  // Paleta de cores vibrantes e modernas
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

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
        const response = await fetch(`http://localhost:5169/api/Products/${id}`, { method: 'DELETE' });
        if (response.ok) fetchProducts();
      } catch (error) { console.error("Erro ao deletar:", error); }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <div className="space-y-8 relative pb-10">
      {/* 1. CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => setSearchTerm('')} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Package size={24} /></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</p>
            <p className="text-3xl font-black text-slate-800">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><DollarSign size={24} /></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Valor em Stock</p>
            <p className="text-3xl font-black text-slate-800">
              {stats.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>

        <div onClick={() => setIsLowStockModalOpen(true)} className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex items-center gap-4 cursor-pointer hover:bg-rose-50 transition-all group">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Crítico</p>
            <p className="text-3xl font-black text-rose-600">{stats.lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* 2. DASHBOARD DE MIX DE CATEGORIAS (REESTILIZADO) */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><ChartPie size={20} /></div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Análise de Mix por Categoria</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Lado Esquerdo: O Gráfico Donut */}
          <div className="h-72 w-full relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-slate-800 leading-none">{stats.total}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Total Itens</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={105}
                  stroke="none"
                  paddingAngle={8}
                  dataKey="value"
                  cornerRadius={10}
                >
                  {stats.chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 shadow-xl rounded-2xl border border-slate-100">
                          <p className="text-sm font-bold text-slate-800">{payload[0].name}</p>
                          <p className="text-xs text-indigo-600 font-black">{payload[0].value} Produtos</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Lado Direito: Legenda Customizada */}
          <div className="space-y-3">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Distribuição</p>
            <div className="grid grid-cols-2 gap-3">
              {stats.chartData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all group">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-700 truncate">{entry.name}</span>
                    <span className="text-[11px] text-slate-400 font-bold">{entry.value} itens</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. LISTAGEM E FILTROS */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            {searchTerm === 'estoque_baixo' ? 'Atenção ao Stock' : 'Inventário Geral'}
          </h2>
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <div className={`w-2 h-2 rounded-full ${searchTerm === 'estoque_baixo' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
            <p className="text-sm font-medium">Status: {searchTerm === 'estoque_baixo' ? 'Mostrando críticos' : 'Em conformidade'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Pesquisar catálogo..."
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 w-80 shadow-sm transition-all"
              value={searchTerm === 'estoque_baixo' ? '' : searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => { setEditingProduct(undefined); setIsModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95">
            <Plus size={22} /> Novo Item
          </button>
        </div>
      </header>

      <ProductTable products={filteredProducts} onDelete={handleDelete} onEdit={handleEdit} />

      {/* MODAL DE ESTOQUE BAIXO */}
      {isLowStockModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-gradient-to-br from-rose-500 to-rose-600 flex justify-between items-center text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"><AlertTriangle size={32} /></div>
                <div>
                  <h3 className="text-2xl font-black italic tracking-tight">ALERTA CRÍTICO</h3>
                  <p className="opacity-80 font-medium text-sm tracking-wide">Reposição imediata necessária</p>
                </div>
              </div>
              <button onClick={() => setIsLowStockModalOpen(false)} className="bg-black/10 hover:bg-black/20 p-3 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8">
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {stats.lowStockList.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-rose-200 transition-all">
                    <div>
                      <p className="font-bold text-slate-900 text-lg leading-tight">{product.name}</p>
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{product.categoryId}</span>
                    </div>
                    <div className="text-center bg-rose-100 px-5 py-2 rounded-2xl border border-rose-200 min-w-[80px]">
                      <span className="block text-2xl font-black text-rose-600">{product.stockQuantity}</span>
                      <span className="text-[9px] font-black text-rose-400 uppercase tracking-tighter">Qtd</span>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => { setSearchTerm('estoque_baixo'); setIsLowStockModalOpen(false); }} className="w-full mt-8 bg-slate-900 text-white py-5 rounded-[24px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
                Ver detalhes na tabela
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