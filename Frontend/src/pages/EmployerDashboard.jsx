import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { AuthContext } from '../App';
import { toast } from 'react-hot-toast';
import { updateApplicationStatus } from '../services/applicationService';
import '../App.css'

const EmployerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/dashboard/employer');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await updateApplicationStatus(applicationId, newStatus);
      toast.success('Application status updated successfully');
      await fetchDashboardData(); // Refresh dashboard data
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div class="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-sky-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">Here's your recruitment overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Total Jobs Posted</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{stats.totalJobs}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Active Jobs</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{stats.activeJobs}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Total Applications</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">{stats.totalApplications}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
              <Link to="/applications" className="text-blue-600 hover:text-blue-700 text-sm">
                View All
              </Link>
            </div>
            {stats?.recentApplications?.length === 0 ? (
              <p className="text-gray-500">No applications yet</p>
            ) : (
              <div className="space-y-4">
                {stats?.recentApplications?.map((application) => (
                  <div key={application._id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{application.jobId.title}</h3>
                        <p className="text-sm text-gray-600">{application.seekerId.name}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          Applied {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusUpdate(application._id, e.target.value)}
                        disabled={updatingStatus}
                        className="text-sm rounded-lg border-gray-200 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      >
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Hired">Hired</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/post-job"
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                Post New Job
              </Link>
              <Link
                to="/company-profile"
                className="block w-full text-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Update Company Profile
              </Link>
              <Link
                to="/applications"
                className="block w-full text-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Manage Applications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard; 