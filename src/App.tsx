import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './layouts/Sidebar';
import { ProductsPage } from './pages/Products';

// Crie um componente simples para o Dashboard aqui ou em outro arquivo
function DashboardHome() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-4">Dashboard</h2>
      <p className="text-slate-500">Bem-vindo à visão geral do sistema.</p>
      {/* Aqui você pode colocar os SummaryCards que fizemos antes */}
    </div>
  );
}

function App() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/produtos" element={<ProductsPage />} />
          {/* Adicione outras rotas conforme criar as páginas */}
        </Routes>
      </main>
    </div>
  );
}

export default App;