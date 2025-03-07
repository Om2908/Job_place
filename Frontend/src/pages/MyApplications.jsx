import { useState, useEffect } from 'react';
import { getMyApplications } from '../services/applicationService';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { MdLocationPin,MdOutlineDateRange  } from "react-icons/md";
import '../App.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await getMyApplications();
      console.log('Applications data:', response.applications);
      setApplications(response.applications);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-sky-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Applications
            </h1>
            <Link
              to="/jobs"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Browse Jobs
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> */}
              <div class="loader"></div>
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{application.jobId.title}</h3>
                      <p className="text-blue-600 mt-1">{application.jobId.companyName}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center text-sm text-gray-500">
                          <MdLocationPin size={20}/>
                          {application.jobId.location}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <MdOutlineDateRange size={19} />
                          {(() => {
                            try {
                              if (!application.createdAt) return 'Date not available';
                              const date = new Date(application.createdAt);
                              if (isNaN(date.getTime())) return 'Invalid date';
                              return date.toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              });
                            } catch (error) {
                              console.error('Date parsing error:', error);
                              return 'Invalid date format';
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                      application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                  
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No applications yet</h3>
              <p className="mt-1 text-gray-500">Start applying to jobs to see your applications here.</p>
             
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications; 