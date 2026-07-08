import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar ação',
  message = 'Tem certeza?',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger', // 'danger' | 'warning'
  isLoading = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const confirmColors =
    variant === 'danger'
      ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
      : 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-300';

  const iconColors =
    variant === 'danger'
      ? 'bg-red-100 text-red-600'
      : 'bg-amber-100 text-amber-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${iconColors} shrink-0`}>
              <AlertTriangle size={24} />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed pt-1">{message}</p>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-colors focus:ring-2 focus:outline-none disabled:opacity-50 ${confirmColors}`}
            >
              {isLoading ? 'Processando...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
