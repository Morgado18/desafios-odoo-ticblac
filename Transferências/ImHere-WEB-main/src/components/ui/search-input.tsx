import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchInput({ value, onChange, placeholder = "Pesquisar...", isLoading }: SearchInputProps) {
  if (isLoading) {
    return (
      <div className="relative w-full max-w-md mb-6">
        <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse" />
        <div className="absolute left-3 top-2.5 w-5 h-5 bg-gray-300 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-80 h-10 border p-2 pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
    </div>
  );
}
