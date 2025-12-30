import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.fullName, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <header>
          <div className="eyebrow">Create account</div>
          <h2 className="title">Join the UMS</h2>
          <p className="subtitle">Set up your credentials to continue</p>
        </header>

        <form className="form" onSubmit={handleSubmit}>
          {error && <div className="alert error">{error}</div>}

          <div className="form-grid">
            <div className="field">
              <label htmlFor="fullName" className="label">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="input"
                placeholder="John Doe"
              />
            </div>

            <div className="field">
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="john@example.com"
              />
            </div>

            <div className="field">
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Min 6 characters"
              />
            </div>

            <div className="field">
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="Repeat password"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn primary" style={{ width: '100%' }}>
            {loading ? 'Creating account…' : 'Sign up'}
          </button>

          <p className="helper">
            Already have an account?{' '}
            <Link to="/login" className="link">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;