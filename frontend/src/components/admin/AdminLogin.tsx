import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Only show admin login if ?admin_secret=YOUR_SECRET is present
  const searchParams = new URLSearchParams(window.location.search);
  const secret = searchParams.get('admin_secret');
  if (secret !== process.env.REACT_APP_ADMIN_SECRET) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else if (data?.session?.access_token) {
      localStorage.setItem('access_token', data.session.access_token);
      window.location.reload(); // or redirect to admin dashboard
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <input
        type="email"
        placeholder="Admin Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        required
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
