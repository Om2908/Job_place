import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    toast.error('Please login to continue');
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    toast.error('Access denied');
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute; 