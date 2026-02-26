import { Sidebar } from './components/layouts/Sidebar.tsx';
import { SummaryCard } from './components/ui/SummaryCard';
import { Package, DollarSign, AlertTriangle } from 'lucide-react';

function App() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
          <p className="text-slate-500">Visão geral do seu sistema de inventário.</p>
        </header>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total de Produtos"
            value="125"
            icon={Package}
            colorClass="bg-blue-500"
          />
          <SummaryCard
            title="Valor em Estoque"
            value="R$ 45.200,00"
            icon={DollarSign}
            colorClass="bg-emerald-500"
          />
          <SummaryCard
            title="Estoque Baixo"
            value="12"
            icon={AlertTriangle}
            colorClass="bg-amber-500"
          />
        </div>

        {/* Área para o gráfico que faremos depois */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-64 flex items-center justify-center">
          <p className="text-slate-400 italic">O gráfico de produtos por categoria aparecerá aqui...</p>
        </div>
      </main>
    </div>
  );
}

export default App;