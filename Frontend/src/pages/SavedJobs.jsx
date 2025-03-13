import { useState, useEffect } from 'react';
import { getSavedJobs, unsaveJob } from '../services/jobService';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const response = await getSavedJobs();
      setSavedJobs(response.jobs || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast.error(error.message || 'Failed to fetch saved jobs');
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await unsaveJob(jobId);
      setSavedJobs(prev => prev.filter(job => job._id !== jobId));
      toast.success('Job removed from saved jobs');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Saved Jobs</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No saved jobs found</p>
          <Link
            to="/jobs"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <div key={job._id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                <button
                  onClick={() => handleUnsave(job._id)}
                  className="text-red-500 p-2 rounded-full hover:bg-gray-100"
                >
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">{job.description}</p>
              
              <div className="flex items-center justify-between mt-4">
                <Link
                  to={`/apply/${job._id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Apply Now
                </Link>
                <span className="text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs; 