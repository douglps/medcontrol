import Card from '../components/Card';
import { History as HistoryIcon } from 'lucide-react';

const History = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Histórico</h2>
        <p className="text-gray-500 mt-1">Registro de doses passadas.</p>
      </div>

      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <HistoryIcon size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium text-gray-600">Em construção</p>
          <p className="text-sm text-gray-400">O histórico completo será exibido aqui em breve.</p>
        </div>
      </Card>
    </div>
  );
};

export default History;
