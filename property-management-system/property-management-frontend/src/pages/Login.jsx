import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(credentials);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({
                  ...credentials,
                  email: e.target.value
                })}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 
                         border border-gray-300 dark:border-gray-600 placeholder-gray-500 
                         text-gray-900 dark:text-white bg-white dark:bg-gray-700 
                         focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({
                  ...credentials,
                  password: e.target.value
                })}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 
                         border border-gray-300 dark:border-gray-600 placeholder-gray-500 
                         text-gray-900 dark:text-white bg-white dark:bg-gray-700 
                         focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border 
                       border-transparent text-sm font-medium rounded-lg text-white 
                       bg-primary-600 hover:bg-primary-700 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
                       disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;