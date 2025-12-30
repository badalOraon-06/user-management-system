import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName,
        email: user.email
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await userAPI.updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await userAPI.changePassword(passwordData);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page">
      <nav className="navbar">
        <div>
          <h1>User Dashboard</h1>
          <div className="meta">Manage your account and profile</div>
        </div>
        <div className="nav-actions">
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="btn ghost">
              Admin Panel
            </button>
          )}
          <button onClick={handleLogout} className="btn secondary">
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <div className="grid-two">
          <div className="card">
            <h2>Update Profile</h2>
            <p className="muted">Keep your personal details current.</p>
            <form onSubmit={handleProfileUpdate} className="form" style={{ marginTop: '12px' }}>
              <div className="field">
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="field">
                <label className="label">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn primary">
                Update Profile
              </button>
            </form>
          </div>

          <div className="card">
            <h2>Change Password</h2>
            <p className="muted">Choose a strong unique password.</p>
            <form onSubmit={handlePasswordChange} className="form" style={{ marginTop: '12px' }}>
              <div className="field">
                <label className="label">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="field">
                <label className="label">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="input"
                  required
                  minLength="6"
                />
              </div>
              <button type="submit" disabled={loading} className="btn primary">
                Change Password
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <h2>Account Information</h2>
          <p className="muted" style={{ marginBottom: '14px' }}>Quick facts about your account.</p>
          <div className="grid-two">
            <div className="field">
              <span className="label">Status</span>
              <span className={`badge ${user?.status === 'active' ? 'success' : 'danger'}`}>
                {user?.status}
              </span>
            </div>
            <div className="field">
              <span className="label">Role</span>
              <span className="badge info" style={{ textTransform: 'capitalize' }}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;