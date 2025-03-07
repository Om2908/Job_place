import axios from '../utils/axios';

export const applyForJob = async (jobId, applicationData) => {
  try {
    const formData = new FormData();
    formData.append('resume', applicationData.resume);
    formData.append('coverLetter', applicationData.coverLetter);

    const response = await axios.post(`/application/apply/${jobId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to submit application' };
  }
};

export const getMyApplications = async () => {
  try {
    const response = await axios.get('/application/myapplications');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch applications' };
  }
};

export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await axios.put(`/application/update/${applicationId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating application:', error);
    throw error.response?.data || { message: 'Failed to update application status' };
  }
}; 