import { Edit, Trash2 } from 'lucide-react';
import { Product } from '../../types/product';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="py-4 px-6 text-sm font-semibold text-slate-600">Produto</th>
            <th className="py-4 px-6 text-sm font-semibold text-slate-600">Categoria</th>
            <th className="py-4 px-6 text-sm font-semibold text-slate-600">Preço</th>
            <th className="py-4 px-6 text-sm font-semibold text-slate-600">Estoque</th>
            <th className="py-4 px-6 text-sm font-semibold text-slate-600 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
              <td className="py-4 px-6">
                <div className="font-medium text-slate-800">{product.name}</div>
                <div className="text-xs text-slate-500 truncate max-w-xs">{product.description}</div>
              </td>
              <td className="py-4 px-6">
                <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {product.category.name}
                </span>
              </td>
              <td className="py-4 px-6 text-sm text-slate-700 font-medium">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </td>
              <td className="py-4 px-6">
                <span className={`text-sm font-bold ${product.stockQuantity < 10 ? 'text-red-500' : 'text-slate-600'}`}>
                  {product.stockQuantity} un
                </span>
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2">
                  <button title="Editar" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Edit size={18} />
                  </button>
                  <button title="Excluir" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}