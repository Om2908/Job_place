import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../App';
import { logout } from '../../services/authService';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg backdrop-blur-lg bg-opacity-80 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xl font-bold text-gray-900">CareerHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/jobs" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              All Jobs
            </Link>
            
            {user ? (
              <>
                {user.role === 'job_seeker' && (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/profile" 
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Profile
                    </Link>
                  </>
                )}
                {user.role === 'employer' && (
                  <Link 
                    to="/employer/dashboard" 
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 text-sm">Hi,{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm px-4 py-2 rounded-full text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-sm px-4 py-2 rounded-full text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="text-sm px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-blue-600 focus:outline-none">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        {/* Add mobile menu items here */}
      </div>
    </nav>
  );
};

export default Navbar; 