import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layouts/Sidebar.tsx';
import { ProductsPage } from './pages/Products';
import keycloak from './services/keycloak';

function DashboardHome() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-4">Dashboard</h2>
      <p className="text-slate-500">
        Bem-vindo, <strong>{keycloak.tokenParsed?.preferred_username}</strong>!
      </p>
      <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg">
        Autenticação concluída com sucesso no realm: {keycloak.realm}
      </div>
    </div>
  );
}

function App() {
  // Se por algum motivo o init no main.tsx falhar, garantimos que não renderiza nada quebrado
  if (!keycloak.authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg animate-pulse">Carregando autenticação...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar lateral fixa */}
      <Sidebar />

      <main className="flex-1 p-8">
        <Routes>
          {/* Rota Principal */}
          <Route path="/" element={<DashboardHome />} />

          {/* Rota de Produtos */}
          <Route path="/produtos" element={<ProductsPage />} />

          {/* Rota de segurança: se a URL vier com códigos do Keycloak ou rotas inexistentes,
              ele limpa e volta para o início */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;