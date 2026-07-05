import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/api';
import { Mail, Lock, LogIn } from 'lucide-react';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const errors = {};
    const { email, password } = formData;

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      console.log('📤 Sending login payload:', formData);

      const response = await loginUser(formData);

      console.log('📥 Login response:', response);

      // Handle different response structures
      let user = null;
      let token = null;

      if (response.data) {
        user = response.data.user || response.data.userData || response.data;
        token = response.data.token || response.data.accessToken;
      } else {
        user = response.user || response;
        token = response.token || response.accessToken;
      }

      console.log('👤 User:', user);
      console.log('🔑 Token:', token);

      if (token && user) {
        onLogin(token, user);
        navigate('/');
      } else {
        setApiError('Invalid server response. Please try again.');
      }
    } catch (err) {
      console.error('❌ Login error:', err);

      if (err.response) {
        console.error('📦 Response status:', err.response.status);
        console.error('📦 Response data:', err.response.data);
        console.error('📦 Response headers:', err.response.headers);
      }

      let errorMsg = 'Login failed. Please try again.';

      if (err.response?.data) {
        const data = err.response.data;

        if (data.message) {
          errorMsg = data.message;
        } else if (data.error) {
          errorMsg = data.error;
        } else if (data.errors) {
          if (Array.isArray(data.errors)) {
            const firstError = data.errors[0]?.msg || data.errors[0]?.message;
            if (firstError) errorMsg = firstError;
            data.errors.forEach((e) => {
              if (e.path || e.param) {
                const field = e.path || e.param;
                setFieldErrors((prev) => ({ ...prev, [field]: e.msg || e.message }));
              }
            });
          } else if (typeof data.errors === 'object') {
            const fieldKeys = Object.keys(data.errors);
            fieldKeys.forEach((key) => {
              setFieldErrors((prev) => ({ ...prev, [key]: data.errors[key] }));
            });
            const firstField = fieldKeys[0];
            if (firstField) errorMsg = data.errors[firstField];
          }
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">
            Welcome Back!
          </h2>
          <p className="text-gray-500 mt-2">
            Login to your FlavorFusion account
          </p>
        </div>

        {apiError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm border border-red-200">
            <strong>Error:</strong> {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-text">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`input-field pl-10 ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="label-text">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`input-field pl-10 ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••••"
                autoComplete="current-password"
                minLength="6"
              />
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-3.5 text-lg"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;