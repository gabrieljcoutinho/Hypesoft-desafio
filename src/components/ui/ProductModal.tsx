import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';

// Regras de validação (Zod)
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
}

export function ProductModal({ isOpen, onClose }: ProductModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  if (!isOpen) return null;

  const onSubmit = (data: ProductFormData) => {
    console.log('Dados prontos para o C#:', data);
    alert('Produto validado com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Novo Produto</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
            <input
              {...register('name')}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
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
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estoque</label>
              <input
                type="number"
                {...register('stockQuantity', { valueAsNumber: true })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea
              {...register('description')}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none h-20"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95"
          >
            Salvar Produto
          </button>
        </form>
      </div>
    </div>
  );
}