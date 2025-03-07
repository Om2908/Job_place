import axios from '../utils/axios';

// Get profile
export const getProfile = async () => {
  try {
    const response = await axios.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

// Update basic profile
export const updateBasicProfile = async (data) => {
  try {
    const response = await axios.put('/profile/basic', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Update experience
export const updateExperience = async (experience) => {
  try {
    const response = await axios.put('/profile/experience', { experience });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update experience' };
  }
};

// Update education
export const updateEducation = async (education) => {
  try {
    const response = await axios.put('/profile/education', { education });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update education' };
  }
};

// Update skills
export const updateSkills = async (skills) => {
  try {
    const response = await axios.put('/profile/skills', { skills });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update skills' };
  }
};

// Upload resume
export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await axios.post('/profile/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload resume' };
  }
}; 