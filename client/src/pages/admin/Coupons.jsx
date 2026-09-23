import { useEffect } from 'react';
import { Ticket } from 'lucide-react';
import EmptyState from '../../components/EmptyState';

const AdminCoupons = () => {
  useEffect(() => { document.title = 'Coupons | Admin'; }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Coupons</h1>
        <p className="text-gray-500 mt-1">Manage discount codes</p>
      </div>
      <EmptyState icon={Ticket} title="Coupon Management" description="Feature coming soon." />
    </div>
  );
};

export default AdminCoupons;
