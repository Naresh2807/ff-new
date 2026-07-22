import React, { useState, useEffect } from 'react';
import { getAdminStats, getUsers, updateUserRole, deleteUser } from '../api/admin';
import { Users, BookOpen, MessageCircle, Trash2 } from 'lucide-react';
import Loader from '../components/Loader';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          getAdminStats(),
          getUsers(),
        ]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      alert('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow flex items-center">
          <Users className="w-10 h-10 text-primary mr-4" />
          <div>
            <p className="text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow flex items-center">
          <BookOpen className="w-10 h-10 text-primary mr-4" />
          <div>
            <p className="text-gray-500">Total Recipes</p>
            <p className="text-2xl font-bold">{stats?.totalRecipes || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow flex items-center">
          <MessageCircle className="w-10 h-10 text-primary mr-4" />
          <div>
            <p className="text-gray-500">Total Comments</p>
            <p className="text-2xl font-bold">{stats?.totalComments || 0}</p>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b py-2">
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;