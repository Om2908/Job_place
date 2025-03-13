import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [jobsResponse, usersResponse, statsResponse] = await Promise.all([
        axios.get('/job/pending'),
        axios.get('/admin/users'),
        axios.get('/admin/stats')
      ]);

      setPendingJobs(jobsResponse.data.jobs);
      setUsers(usersResponse.data.users);
      setStats(statsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleJobApproval = async (jobId, status, remarks = '') => {
    try {
      await axios.patch(`/job/${status}/${jobId}`, { remarks });
      toast.success(`Job ${status} successfully`);
      fetchDashboardData(); 
    } catch (error) {
      toast.error(`Failed to ${status} job`);
    }
  };

  const handleUserStatus = async (userId, isBlocked) => {
    try {
      await axios.patch(`/admin/users/${userId}/status`, { isBlocked });
      toast.success(`User ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-sky-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">Total Jobs</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{stats.totalJobs}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">Total Applications</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{stats.totalApplications}</p>
          </div>
        </div>

        {/* Pending Jobs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Jobs</h2>
          <div className="space-y-4">
            {pendingJobs.map((job) => (
              <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.companyName}</p>
                    <p className="mt-1 text-sm text-gray-500">Posted by: {job.postedBy.name}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleJobApproval(job._id, 'approve')}
                      className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleJobApproval(job._id, 'reject')}
                      className="px-4 py-2 bg-rose-100 text-rose-800 rounded-lg hover:bg-rose-200 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white/50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.isBlocked 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleUserStatus(user._id, !user.isBlocked)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          user.isBlocked 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        } transition-colors`}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 