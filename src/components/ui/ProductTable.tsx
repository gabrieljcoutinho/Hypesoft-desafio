import { Edit, Trash2, Package } from 'lucide-react';
import { Product } from '../../types/productType'

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
}

export function ProductTable({ products, onDelete, onEdit }: ProductTableProps) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden transition-all">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
            <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
            <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Preço</th>
            <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Estoque</th>
            <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {products.map((product) => (
            <tr key={product.id} className="group hover:bg-indigo-50/30 transition-colors">
              <td className="py-5 px-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-white transition-colors">
                    <Package size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{product.name}</div>
                    <div className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">
                      {product.description || 'Sem descrição cadastrada'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-5 px-8">
                <span className="bg-white text-indigo-600 text-[10px] font-black px-2.5 py-1 rounded-lg border border-indigo-100 shadow-sm uppercase tracking-wider">
                  {product.categoryId}
                </span>
              </td>
              <td className="py-5 px-8 text-sm font-bold text-slate-700">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </td>
              <td className="py-5 px-8">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${product.stockQuantity < 10 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                  <span className={`text-sm font-black ${product.stockQuantity < 10 ? 'text-rose-600' : 'text-slate-600'}`}>
                    {product.stockQuantity} <span className="text-[10px] text-slate-400 uppercase">un</span>
                  </span>
                </div>
              </td>
              <td className="py-5 px-8 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-md rounded-xl transition-all active:scale-90"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white hover:shadow-md rounded-xl transition-all active:scale-90"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-400 font-medium">Nenhum produto encontrado por aqui.</p>
        </div>
      )}
    </div>
  );
}