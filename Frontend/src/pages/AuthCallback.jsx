import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';
import { getCurrentUser } from '../services/authService';
import { toast } from 'react-hot-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Authentication failed');
      navigate('/login');
      return;
    }

    if (token) {
      try {
        console.log("Received token:", token); 
        localStorage.setItem('token', token);
        
        const user = getCurrentUser();
        console.log("Current user:", user); 
        
        if (!user) {
          throw new Error('Failed to get user details');
        }

        setUser(user);
        toast.success('Login successful!');

        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'employer') {
          navigate('/employer/dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Auth callback error:", error); 
        toast.error('Failed to process login');
        navigate('/login');
      }
    } else {
      toast.error('No authentication token received');
      navigate('/login');
    }
  }, [navigate, setUser, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default AuthCallback; 