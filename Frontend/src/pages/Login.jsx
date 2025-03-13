import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../App';
import { motion } from 'framer-motion';
import { FaGithub } from "react-icons/fa";
import { FaEye,FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Sending login data:', formData);
      const response = await login(formData);
      console.log('Login response:', response);
      
      if (response.token) {
        // Update AuthContext with user data
        setUser(response.user);
        toast.success('Login successful!');

        // Role based redirect
        if (response.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (response.user.role === 'employer') {
          navigate('/employer/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  const handleLinkedInLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/github`;
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
        >
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
            <p className="mt-1 text-sm text-gray-600">Sign in to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEye color="gray" />

                  ) : (
                    <FaEyeSlash color='gray'/>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5 mr-3" />
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </button>
            <button 
              onClick={handleLinkedInLogin}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <FaGithub />
              <span className="text-gray-700 font-medium ml-4">Continue with Github</span>
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
              Sign up now
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 