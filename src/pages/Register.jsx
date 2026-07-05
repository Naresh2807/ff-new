import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/api';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

function Register({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field errors when typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const errors = {};
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) errors.name = 'Full name is required';
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
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      // Build the payload exactly as your backend expects
      // Common variations: { name, email, password } or { fullName, email, password }
      // Adjust below if your backend expects different field names
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      const response = await registerUser(payload);
      
      // Handle different response structures gracefully
      let user = null;
      let token = null;

      if (response.data) {
        // If response.data contains user and token directly
        user = response.data.user || response.data.userData || response.data;
        token = response.data.token || response.data.accessToken;
      } else {
        user = response.user || response;
        token = response.token || response.accessToken;
      }

      // If token is missing, registration might have succeeded without auto-login
      if (!token && user) {
        // Redirect to login page with a success message
        navigate('/login?registered=true');
        return;
      }

      // Auto-login: call the parent onLogin and navigate home
      if (token && user) {
        onLogin(token, user);
        navigate('/');
      } else {
        // Unexpected response – fallback to redirect to login
        navigate('/login?registered=true');
      }
    } catch (err) {
      console.error('Registration error:', err);
      // Extract meaningful error message
      let errorMsg = 'Registration failed. Please try again.';
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.errors) {
        // Handle mongoose/express-validator errors
        const errors = err.response.data.errors;
        if (Array.isArray(errors)) {
          const firstError = errors[0]?.msg || errors[0]?.message;
          if (firstError) errorMsg = firstError;
          // Map field-specific errors
          errors.forEach((e) => {
            if (e.path) setFieldErrors((prev) => ({ ...prev, [e.path]: e.msg || e.message }));
          });
        } else if (typeof errors === 'object') {
          // If errors is an object with field keys
          const fieldKeys = Object.keys(errors);
          fieldKeys.forEach((key) => {
            setFieldErrors((prev) => ({ ...prev, [key]: errors[key] }));
          });
          // Display first field error as general message
          const firstField = fieldKeys[0];
          if (firstField) errorMsg = errors[firstField];
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
            Create Account
          </h2>
          <p className="text-gray-500 mt-2">
            Join FlavorFusion and start sharing recipes!
          </p>
        </div>

        {/* General API error */}
        {apiError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm border border-red-200">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`input-field pl-10 ${fieldErrors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>

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
                placeholder="•••••••• (min 6 chars)"
                autoComplete="new-password"
                minLength="6"
              />
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label className="label-text">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`input-field pl-10 ${fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
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
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;