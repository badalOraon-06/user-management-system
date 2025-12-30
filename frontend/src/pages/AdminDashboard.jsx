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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.fullName} ({user?.role})
              </span>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {message.text && (
          <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Users Table Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Users</h2>
            <p className="mt-1 text-sm text-gray-500">Manage user accounts and permissions</p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading users...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{u.fullName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {(u._id === user?.id || u._id === user?._id || u.email === user?.email) ? (
                            <span className="text-gray-400 text-sm">You</span>
                          ) : u.status === 'active' ? (
                            <button
                              onClick={() => showConfirmDialog('deactivate', u._id, u.fullName)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => showConfirmDialog('activate', u._id, u.fullName)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Activate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setConfirmDialog({ show: false, action: null, userId: null, userName: '' })}
          ></div>
          
          {/* Dialog Box */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm {confirmDialog.action}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to {confirmDialog.action} <strong>{confirmDialog.userName}</strong>?
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDialog({ show: false, action: null, userId: null, userName: '' })}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Confirm clicked!');
                  confirmDialog.action === 'activate' ? handleActivate(confirmDialog.userId) : handleDeactivate(confirmDialog.userId);
                }}
                className={`px-4 py-2 rounded-md text-white ${
                  confirmDialog.action === 'activate' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
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