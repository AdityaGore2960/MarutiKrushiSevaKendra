import { PackageSearch } from 'lucide-react';

const EmptyState = ({ title = 'No items found', description = '', action }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
    <div className="bg-gray-100 rounded-full p-5">
      <PackageSearch size={36} className="text-gray-400" />
    </div>
    <div>
      <p className="text-lg font-semibold text-gray-700">{title}</p>
      {description && <p className="text-gray-500 mt-1">{description}</p>}
    </div>
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
