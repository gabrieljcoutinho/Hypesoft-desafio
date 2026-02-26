import { X } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ isOpen, onClose }: ProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Novo Produto</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <p className="text-slate-600 mb-4">O formulário de cadastro entrará aqui.</p>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}