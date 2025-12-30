import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <header>
          <div className="eyebrow">Welcome back</div>
          <h2 className="title">User Management System</h2>
          <p className="subtitle">Sign in to continue</p>
        </header>

        <form className="form" onSubmit={handleSubmit}>
          {error && <div className="alert error">{error}</div>}

          <div className="field">
            <label htmlFor="email" className="label">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div className="field">
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn primary" style={{ width: '100%' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="helper">
            Don't have an account?{' '}
            <Link to="/signup" className="link">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;