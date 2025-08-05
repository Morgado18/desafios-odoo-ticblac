import { Search } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "Nenhum resultado encontrado" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Search className="h-12 w-12 text-gray-400 mb-3" />
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}
