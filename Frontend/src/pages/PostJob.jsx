import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { postJob } from '../services/jobService';
import { AuthContext } from '../App';
import { toast } from 'react-hot-toast';

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    companyName: user?.company?.name || '',
    requirements: '',
    jobType: 'Full-time'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      
      const formattedData = {
        ...jobData,
        requirements: jobData.requirements.split(',').map(req => req.trim()),
        salary: Number(jobData.salary)
      };

      await postJob(formattedData);
      toast.success('Job posted successfully!');
      navigate('/jobs');
    } catch (error) {
      toast.error(error.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-sky-50 to-indigo-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>

          <form onSubmit={handleSubmit} className="space-y-6">


          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={jobData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Company name"
                  required
                />
              </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Describe the role and responsibilities"
                required
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
              <textarea
                name="requirements"
                value={jobData.requirements}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter requirements (comma separated)"
                required
              />
            </div>
           

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g. surat, gujarat"
                  required
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  name="jobType"
                  value={jobData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  
                </select>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={jobData.salary}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Annual salary"
                  required
                />
              </div>
              

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={jobData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Required experience"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob; 