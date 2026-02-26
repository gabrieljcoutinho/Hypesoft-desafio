import { LayoutDashboard, Package, Tags, Box, LogOut } from 'lucide-react';
import keycloak from '../../services/keycloak'; // Certifique-se que o caminho está correto

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Produtos', path: '/produtos' },
  { icon: Tags, label: 'Categorias', path: '/categorias' },
  { icon: Box, label: 'Estoque Baixo', path: '/estoque-baixo' },
];

export function Sidebar() {
  // Função para deslogar
  const handleLogout = () => {
    keycloak.logout();
  };

  return (
    <aside className="w-64 bg-white h-screen border-r border-slate-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <Package size={24} />
          HypeStore
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.path}
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group"
          >
            <item.icon size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        {/* Adicionado o onClick aqui */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}