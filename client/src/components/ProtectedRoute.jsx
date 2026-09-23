import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) return <Loading text="Checking authentication..." />;
  if (!admin) return <Navigate to="/admin/login" replace />;

  return children;
};

export default ProtectedRoute;
