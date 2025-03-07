import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { AuthContext } from '../App';
import { toast } from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';

const JobSeekerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (socket && user) {
      socket.emit('authenticate', user.id);

      socket.on('applicationUpdate', (data) => {
        toast.success(`Application for ${data.jobTitle} has been ${data.status}`);
        fetchDashboardData();
      });

      return () => {
        socket.off('applicationUpdate');
      };
    }
  }, [socket, user]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/dashboard/jobseeker');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="mt-2 text-gray-600">Here's your job search overview</p>
            </div>
            <Link 
              to="/update-profile" 
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Update Profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
              <Link to="/my-applications" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                View All
              </Link>
            </div>
            {stats.recentApplications.length === 0 ? (
              <p className="text-gray-500">No applications yet</p>
            ) : (
              <div className="space-y-4">
                {stats.recentApplications.map((application) => (
                  <div key={application._id} className="border-b pb-4 last:border-0">
                    <h3 className="font-medium text-gray-900">{application.jobId.title}</h3>
                    <p className="text-sm text-gray-600">{application.jobId.companyName}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {application.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {application.jobId.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Jobs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Saved Jobs</h2>
              <Link to="/jobs" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                Find More Jobs
              </Link>
            </div>
            {stats.savedJobs.length === 0 ? (
              <p className="text-gray-500">No saved jobs yet</p>
            ) : (
              <div className="space-y-4">
                {stats.savedJobs.map((job) => (
                  <div key={job._id} className="border-b pb-4 last:border-0">
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.companyName}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{job.location}</span>
                      <span className="text-sm text-gray-500">{job.jobType}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard; 