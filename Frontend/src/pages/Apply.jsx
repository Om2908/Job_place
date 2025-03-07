import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applyForJob } from '../services/applicationService';
import { getAllJobs } from '../services/jobService';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaBuilding, FaMapMarkerAlt, FaBriefcase, FaFileUpload } from 'react-icons/fa';
import { LuIndianRupee } from "react-icons/lu";

const Apply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    resume: null,
    coverLetter: '',
  });
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await getAllJobs();
      const jobDetails = response.jobs.find(j => j._id === jobId);
      if (!jobDetails) {
        toast.error('Job not found');
        navigate('/jobs');
        return;
      }
      setJob(jobDetails);
    } catch (error) {
      toast.error(error.message);
      navigate('/jobs');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelection(file);
  };

  const handleFileSelection = (file) => {
    if (file && file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    setFormData(prev => ({
      ...prev,
      resume: file
    }));
    setFileName(file.name);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelection(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume) {
      toast.error('Please upload your resume');
      return;
    }

    setLoading(true);
    try {
      await applyForJob(jobId, formData);
      toast.success('Application submitted successfully!');
      navigate('/my-applications');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Job Details Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <h2 className="text-2xl font-bold">Apply for Position</h2>
            <p className="mt-2 text-blue-100">Complete the form below to apply</p>
          </div>

          <div className="p-6">
            {/* Job Summary */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <FaBuilding className="mr-2 text-blue-600" />
                  <span className="font-semibold text-blue-700">{job.companyName}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2 text-blue-600" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <LuIndianRupee  size={18} className="mr-1.5  text-blue-600" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaBriefcase className="mr-2 text-blue-600" />
                  <span>{job.jobType}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume (PDF only)
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-all
                    ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                    ${fileName ? 'bg-green-50 border-green-500' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <FaFileUpload className={`text-4xl mb-2 ${fileName ? 'text-green-500' : 'text-blue-500'}`} />
                    {fileName ? (
                      <div className="text-center">
                        <p className="text-green-600 font-medium">{fileName}</p>
                        <p className="text-sm text-gray-500">Click or drag to replace</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-600 font-medium">Drag and drop your resume here</p>
                        <p className="text-sm text-gray-500">or click to select file</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                  rows={6}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Tell us why you're a great fit for this position..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => navigate('/jobs')}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Apply; 