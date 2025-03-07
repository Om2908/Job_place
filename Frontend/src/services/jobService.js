import axios from '../utils/axios';

// Get all jobs with filters
export const getAllJobs = async (filters = {}) => {
  try {
    const { location, jobType, minSalary, maxSalary, page = 1, limit = 10 } = filters;
    const response = await axios.get('/job/all', { 
      params: { 
        location, 
        jobType, 
        minSalary, 
        maxSalary, 
        page, 
        limit 
      } 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch jobs' };
  }
};

// Post a new job
export const postJob = async (jobData) => {
  try {
    const response = await axios.post('/job/post', jobData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to post job' };
  }
};

// Save job
export const saveJob = async (jobId) => {
  try {
    const response = await axios.post(`/job/save/${jobId}`);
    return response.data;
    // console.log(response.data)
  } catch (error) {
    console.error('Save job error:', error);
    throw error.response?.data || { message: 'Failed to save job' };
  }
};

// Unsave job
export const unsaveJob = async (jobId) => {
  try {
    const response = await axios.delete(`/job/unsave/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Unsave job error:', error);
    throw error.response?.data || { message: 'Failed to unsave job' };
  }
};

// Get saved jobs
export const getSavedJobs = async () => {
  try {
    const response = await axios.get('/job/saved');
    return response.data;
  } catch (error) {
    console.error('Get saved jobs error:', error);
    throw error.response?.data || { message: 'Failed to fetch saved jobs' };
  }
}; 