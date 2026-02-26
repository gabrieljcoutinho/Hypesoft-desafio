import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ProductTable } from '../components/ui/ProductTable';
import { ProductModal } from '../components/ui/ProductModal';
import { Product } from '../types/product';

export function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  // Adicionado: Estado para controlar qual produto estamos editando
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

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

  const handleDelete = async (id: string | number) => {
    if (confirm("Deseja realmente excluir este produto?")) {
      try {
        const response = await fetch(`http://localhost:5169/api/Products/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchProducts();
        } else {
          // Se der erro 404, mostramos um alerta detalhado
          alert("Erro: O servidor não encontrou esse produto. Tente atualizar a página.");
        }
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  // Modificado: Agora abre o modal passando o produto clicado
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Adicionado: Função para garantir que o modal abra limpo para novos produtos
  const handleAddNew = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

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
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </header>

      <ProductTable
        products={products}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <ProductModal
        isOpen={isModalOpen}
        product={editingProduct} // Enviamos o produto para o modal decidir se é PUT ou POST
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(undefined);
          fetchProducts();
        }}
      />
    </div>
  );
}