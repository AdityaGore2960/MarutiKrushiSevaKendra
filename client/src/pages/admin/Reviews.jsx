import { useEffect } from 'react';
import { Star } from 'lucide-react';
import EmptyState from '../../components/EmptyState';

const AdminReviews = () => {
  useEffect(() => { document.title = 'Reviews | Admin'; }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Reviews</h1>
        <p className="text-gray-500 mt-1">Manage product reviews</p>
      </div>
      <EmptyState icon={Star} title="Product Reviews" description="Feature coming soon." />
    </div>
  );
};

export default AdminReviews;
