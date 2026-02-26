import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { Product } from '../../types/productType';

const productSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 letras'),
  description: z.string().min(5, 'A descrição deve ser mais detalhada'),
  price: z.number().min(0.01, 'O preço deve ser maior que zero'),
  stockQuantity: z.number().int().min(0, 'O estoque não pode ser negativo'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product; // Propriedade para receber o produto na edição
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // Toda vez que o modal abrir ou o produto mudar, o formulário reseta com os dados
  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset(product); // Preenche o formulário com os dados do produto para editar
      } else {
        reset({ name: '', description: '', price: 0, stockQuantity: 0, categoryId: '' }); // Limpa para novo produto
      }
    }
  }, [isOpen, product, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Se tem produto, usa PUT (editar), se não, usa POST (criar)
      const url = product
        ? `http://localhost:5169/api/Products/${product.id}`
        : 'http://localhost:5169/api/Products';

      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product ? { ...data, id: product.id } : data),
      });

      if (response.ok) {
        alert(product ? 'Produto atualizado!' : 'Produto criado com sucesso!');
        onClose();
      } else {
        const errorText = await response.text();
        alert('Erro ao salvar: ' + errorText);
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      alert('Erro ao conectar ao servidor.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {product ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
            <input
              {...register('name')}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Mouse Gamer"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preço (R$)</label>
              <input
                type="number" step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estoque</label>
              <input
                type="number"
                {...register('stockQuantity', { valueAsNumber: true })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none"
              />
              {errors.stockQuantity && <p className="text-red-500 text-xs mt-1">{errors.stockQuantity.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
            <select
              {...register('categoryId')}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none bg-white"
            >
              <option value="">Selecione uma categoria...</option>
              <option value="Periféricos">Periféricos</option>
              <option value="Hardware">Hardware</option>
              <option value="Calçados">Calçados</option>
              <option value="Roupas">Roupas</option>
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea
              {...register('description')}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none h-20"
              placeholder="Descreva o produto..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95"
          >
            {product ? 'Salvar Alterações' : 'Criar Produto'}
          </button>
        </form>
      </div>
    </div>
  );
}