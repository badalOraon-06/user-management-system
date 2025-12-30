import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, action: null, userId: null, userName: '' });

  // Fetch users on component mount and when page changes
  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUsers(page, 10);
      console.log('Fetched users:', response.data); // Debug log
      setUsers(response.data.users || []);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error('Error fetching users:', error); // Debug log
      setMessage({ type: 'error', text: 'Failed to fetch users' });
      setUsers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (userId) => {
    try {
      await userAPI.activateUser(userId);
      setMessage({ type: 'success', text: 'User activated successfully!' });
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error activating user:', error); // Debug log
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to activate user' });
    }
    setConfirmDialog({ show: false, action: null, userId: null, userName: '' });
  };

  const handleDeactivate = async (userId) => {
    try {
      console.log('Deactivating user:', userId); // Debug log
      await userAPI.deactivateUser(userId);
      setMessage({ type: 'success', text: 'User deactivated successfully!' });
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deactivating user:', error); // Debug log
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to deactivate user' });
    }
    setConfirmDialog({ show: false, action: null, userId: null, userName: '' });
  };

  const showConfirmDialog = (action, userId, userName) => {
    console.log('showConfirmDialog called:', action, userId, userName);
    setConfirmDialog({ show: true, action, userId, userName });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page">
      <nav className="navbar">
        <div>
          <h1>Admin Dashboard</h1>
          <div className="meta">Manage user accounts and permissions</div>
        </div>
        <div className="nav-actions">
          <span className="meta">{user?.fullName} ({user?.role})</span>
          <button onClick={() => navigate('/dashboard')} className="btn ghost">My Profile</button>
          <button onClick={handleLogout} className="btn secondary">Logout</button>
        </div>
      </nav>

      <div className="container">
        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <div className="card">
          <div style={{ marginBottom: '14px' }}>
            <h2>All Users</h2>
            <p className="muted">Moderate access, roles, and statuses.</p>
          </div>

          {loading ? (
            <div style={{ padding: '16px 0' }}>Loading users…</div>
          ) : (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.fullName}</td>
                        <td className="muted">{u.email}</td>
                        <td>
                          <span className="badge info" style={{ textTransform: 'capitalize' }}>{u.role}</span>
                        </td>
                        <td>
                          <span className={`badge ${u.status === 'active' ? 'success' : 'danger'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            {(u._id === user?.id || u._id === user?._id || u.email === user?.email) ? (
                              <span className="muted">You</span>
                            ) : u.status === 'active' ? (
                              <button onClick={() => showConfirmDialog('deactivate', u._id, u.fullName)} className="pill-btn">
                                Deactivate
                              </button>
                            ) : (
                              <button onClick={() => showConfirmDialog('activate', u._id, u.fullName)} className="pill-btn">
                                Activate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <div className="muted">Page {page} of {totalPages}</div>
                <div className="nav-actions">
                  <button onClick={() => setPage(page - 1)} disabled={page === 1} className="btn secondary">
                    Previous
                  </button>
                  <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="btn secondary">
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {confirmDialog.show && (
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <h3 style={{ marginBottom: '10px' }}>Confirm {confirmDialog.action}</h3>
            <p className="muted">
              Are you sure you want to {confirmDialog.action} <strong>{confirmDialog.userName}</strong>?
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setConfirmDialog({ show: false, action: null, userId: null, userName: '' })}
                className="btn secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Confirm clicked!');
                  confirmDialog.action === 'activate' ? handleActivate(confirmDialog.userId) : handleDeactivate(confirmDialog.userId);
                }}
                className={`btn ${confirmDialog.action === 'activate' ? 'primary' : 'danger'}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;