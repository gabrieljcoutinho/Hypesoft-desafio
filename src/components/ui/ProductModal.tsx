import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';

// Validação com Zod (Exigência do desafio)
const productSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().min(5, 'Descreva melhor o produto'),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  stockQuantity: z.number().int().min(0, 'Estoque não pode ser negativo'),
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
    console.log('Dados para salvar no C#:', data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-slate-800">Novo Produto</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Nome</label>
            <input {...register('name')} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Preço</label>
              <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Estoque</label>
              <input type="number" {...register('stockQuantity', { valueAsNumber: true })} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
            Salvar Produto
          </button>
        </form>
      </div>
    </div>
  );
}