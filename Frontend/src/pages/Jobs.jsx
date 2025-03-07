import { useState, useEffect, useContext } from 'react';
import { getAllJobs, saveJob, unsaveJob, getSavedJobs } from '../services/jobService';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { MdLocationPin } from "react-icons/md";
import { LuIndianRupee } from "react-icons/lu";
import { PiHandbagBold } from "react-icons/pi";
import '../App.css'


const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    minSalary: '',
    maxSalary: '',
    page: 1,
    limit: 10
  });

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState(new Set());

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getAllJobs(filters);
      setJobs(response.jobs || []);
      
      // If user is logged in, get their saved jobs
      if (user) {
        try {
          const savedResponse = await getSavedJobs();
          const savedJobIds = savedResponse.jobs?.map(job => job._id) || [];
          setSavedJobs(new Set(savedJobIds));
        } catch (error) {
          console.error('Error fetching saved jobs:', error);
          // Don't show error to user, just log it
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      if (!user) {
        toast.error('Please login to save jobs');
        return;
      }

      if (savedJobs.has(jobId)) {
        await unsaveJob(jobId);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        toast.success('Job removed from saved jobs');
      } else {
        await saveJob(jobId);
        setSavedJobs(prev => new Set([...prev, jobId]));
        toast.success('Job saved successfully');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1 // Reset page when filters change
    });
  };

  const handleApply = (jobId) => {
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }
    if (user.role !== 'job_seeker') {
      toast.error('Only job seekers can apply for jobs');
      return;
    }
    navigate(`/apply/${jobId}`);
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-sky-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
              className="px-4 py-2.5 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="px-4 py-2.5 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
            <input
              type="number"
              name="minSalary"
              placeholder="Min Salary"
              value={filters.minSalary}
              onChange={handleFilterChange}
              className="px-4 py-2.5 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <input
              type="number"
              name="maxSalary"
              placeholder="Max Salary"
              value={filters.maxSalary}
              onChange={handleFilterChange}
              className="px-4 py-2.5 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
          <div class="loader"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600 mt-1">{job.companyName}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="flex items-center text-gray-500">
                       <MdLocationPin size={20}/>
                        {job.location}
                      </span>
                      <span className="flex items-center text-gray-500">
                      <PiHandbagBold className='mr-1' size={19} />
                        {job.jobType}
                      </span>
                      {job.salary && (
                        <span className="flex items-center text-gray-500">
                        <LuIndianRupee size={15} />
                          {job.salary}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveJob(job._id)}
                    className="p-2 text-red-600 hover:text-red-400 transition-colors duration-200"
                  >
                    <svg className="h-6 w-6" fill={savedJobs.has(job._id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <p className="mt-4 text-gray-600">{job.description}</p>
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {job.requirements?.map((req, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleApply(job._id)}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs; 