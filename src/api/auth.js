// Authentication API - Real backend integration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://52.228.185.97/api';

// Helper function to get stored token
const getStoredToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const authApi = {
  // User Registration
  async register(registrationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(registrationData)
      });

      const data = await handleApiResponse(response);
      return {
        success: true,
        data,
        message: data.message || 'Registration successful'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  },

  // User Login
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });

      const data = await handleApiResponse(response);

      // Store token and user data
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        // Store user data in the format expected by the app
        const userData = {
          token: data.token,
          userId: data.userId,
          userName: data.userName,
          roles: data.roles,
          employee: data.infoUser ? {
            id: data.infoUser.employeeId,
            firstName: data.infoUser.employeeFirstName,
            lastName: data.infoUser.employeeLastName,
            email: data.infoUser.employeeEmail,
            managerId: data.infoUser.managerId
          } : null
        };
        localStorage.setItem('userData', JSON.stringify(userData));
      }

      return {
        success: true,
        data: {
          token: data.token,
          userId: data.userId,
          userName: data.userName,
          roles: data.roles,
          employee: data.infoUser ? {
            id: data.infoUser.employeeId,
            firstName: data.infoUser.employeeFirstName,
            lastName: data.infoUser.employeeLastName,
            email: data.infoUser.employeeEmail,
            managerId: data.infoUser.managerId
          } : null
        },
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  },

  // User Logout
  async logout() {
    try {
      const token = getStoredToken();
      
      if (token) {
        // Call backend logout endpoint if available
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: getAuthHeaders(),
          credentials: 'include'
        }).catch(() => {
          // Ignore errors on logout endpoint - might not exist yet
        });
      }

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');

      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  },

  // Refresh Token
  async refreshToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await handleApiResponse(response);

      // Update stored token
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      return {
        success: true,
        data,
        message: 'Token refreshed successfully'
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: error.message || 'Token refresh failed'
      };
    }
  },

  // Get Current User Profile
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await handleApiResponse(response);

      // Update stored user data
      localStorage.setItem('userData', JSON.stringify(data));

      return {
        success: true,
        data,
        message: 'User profile retrieved successfully'
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get user profile'
      };
    }
  },

  // Update User Profile
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(profileData)
      });

      const data = await handleApiResponse(response);

      // Update stored user data
      localStorage.setItem('userData', JSON.stringify(data));

      return {
        success: true,
        data,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile'
      };
    }
  },

  // Change Password
  async changePassword(passwordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(passwordData)
      });

      const data = await handleApiResponse(response);

      return {
        success: true,
        data,
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: error.message || 'Failed to change password'
      };
    }
  },

  // Forgot Password
  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email })
      });

      const data = await handleApiResponse(response);

      return {
        success: true,
        data,
        message: 'Password reset email sent successfully'
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send password reset email'
      };
    }
  },

  // Reset Password
  async resetPassword(resetData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(resetData)
      });

      const data = await handleApiResponse(response);

      return {
        success: true,
        data,
        message: 'Password reset successfully'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.message || 'Failed to reset password'
      };
    }
  },

  // Verify Token
  async verifyToken() {
    try {
      const token = getStoredToken();
      
      if (!token) {
        return {
          success: false,
          error: 'No token found'
        };
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await handleApiResponse(response);

      return {
        success: true,
        data,
        message: 'Token is valid'
      };
    } catch (error) {
      console.error('Token verification error:', error);
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      return {
        success: false,
        error: error.message || 'Token verification failed'
      };
    }
  }
};

// Utility functions for local token management
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated() {
    const token = getStoredToken();
    return !!token;
  },

  // Get stored user data
  getStoredUser() {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  },

  // Get stored token
  getToken() {
    return getStoredToken();
  },

  // Clear authentication data
  clearAuth() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },

  // Check if token is expired (basic check)
  isTokenExpired() {
    const token = getStoredToken();
    if (!token) return true;

    try {
      // Decode JWT token (basic implementation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
};

export default authApi;
