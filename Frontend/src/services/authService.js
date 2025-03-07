import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

// Register user
export const register = async (userData) => {
  try {
    console.log('Sending registration data:', userData); // Debug log
    const response = await axios.post(`${API_URL}/register`, userData);
    console.log('Registration response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error); // Debug log
    if (error.response?.data) {
      throw error.response.data;
    } else {
      throw { message: 'Registration failed. Please try again.' };
    }
  }
};

// Login user
export const login = async (credentials) => {
  try {
    console.log('Sending login request:', credentials);
    const response = await axios.post(`${API_URL}/login`, credentials);
    console.log('Login response:', response.data);
    
    if (response.data.token) {
      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Return the complete response data
      return response.data;
    } else {
      throw new Error('No token received');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error);
    if (error.response?.data) {
      throw error.response.data;
    } else {
      throw { message: 'Login failed. Please try again.' };
    }
  }
};

// Logout user
export const logout = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    throw new Error('Failed to logout');
  }
};

// Check auth status
export const checkAuth = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get current user
export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    console.log("Token payload:", payload); // Debug log
    
    return {
      id: payload.id,
      role: payload.role,
      email: payload.email
    };
  } catch (error) {
    console.error("getCurrentUser error:", error); // Error log
    return null;
  }
};

// Add this function
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    } else {
      throw { message: 'Failed to send reset link. Please try again.' };
    }
  }
};

// Add resetPassword function
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, {
      token,
      newPassword
    });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    } else {
      throw { message: 'Failed to reset password. Please try again.' };
    }
  }
};

export const verifyOTP = async (data) => {
  try {
    // Ensure OTP is number
    const payload = {
      email: data.email,
      otp: parseInt(data.otp)
    };
    
    const response = await axios.post(`${API_URL}/verify-otp`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Verification failed' };
  }
};

export const resendOTP = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/resend-otp`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to resend OTP' };
  }
}; 