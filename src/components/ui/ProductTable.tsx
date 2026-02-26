import { useState, useEffect } from 'react'; // Adicionado useEffect
import { Plus } from 'lucide-react';
import { ProductTable } from '../components/ui/ProductTable';
import { ProductModal } from '../components/ui/ProductModal';
import { Product } from '../types/product';

export function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Criamos um estado para os produtos reais (começa vazio)
  const [products, setProducts] = useState<Product[]>([]);

  // Função que vai lá no C# buscar os dados
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5169/api/Products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data); // Coloca os dados do C# na tela
      }
    } catch (error) {
      console.error("Erro ao carregar produtos do Backend:", error);
    }
  };

  // Isso executa a busca assim que a página abre
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Produtos</h2>
          <p className="text-slate-500">Gerencie seu catálogo de produtos.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </header>

      {/* Trocamos MOCK_PRODUCTS pela nossa variável real 'products' */}
      <ProductTable products={products} />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchProducts(); // Atualiza a lista automaticamente após fechar o modal
        }}
      />
    </div>
  );
}