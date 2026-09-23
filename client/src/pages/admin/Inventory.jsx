import { useEffect } from 'react';
import { Warehouse } from 'lucide-react';
import EmptyState from '../../components/EmptyState';

const AdminInventory = () => {
  useEffect(() => { document.title = 'Inventory | Admin'; }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Inventory</h1>
        <p className="text-gray-500 mt-1">Manage stock and warehouses</p>
      </div>
      <EmptyState icon={Warehouse} title="Inventory Management" description="Feature coming soon." />
    </div>
  );
};

export default AdminInventory;
