import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { getProfile, updateBasicProfile, updateExperience, updateEducation, updateSkills, uploadResume } from '../services/profileService';
import { FaUser, FaEnvelope, FaBriefcase, FaGraduationCap, FaTools, FaFileAlt, FaPlus, FaTrash, FaBuilding, FaMapMarkerAlt, FaUpload, FaCalendar } from 'react-icons/fa';
import '../App.css';

const UpdateProfile = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [basicInfo, setBasicInfo] = useState({ name: '', email: '' });
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setBasicInfo({ name: data.name, email: data.email });
      setExperience(data.profile?.experience || []);
      setEducation(data.profile?.education || []);
      setSkills(data.profile?.skills || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
    if (file) setResumeFile(file);
  };

  const handleBasicSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBasicProfile(basicInfo);
      toast.success('Basic info updated successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateExperience(experience);
      toast.success('Experience updated successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateEducation(education);
      toast.success('Education updated successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSkillsSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSkills(skills);
      toast.success('Skills updated successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please select a file');
      return;
    }

    setSaving(true);
    try {
      await uploadResume(resumeFile);
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', icon: FaUser, label: 'Basic Info' },
    { id: 'experience', icon: FaBriefcase, label: 'Experience' },
    { id: 'education', icon: FaGraduationCap, label: 'Education' },
    { id: 'skills', icon: FaTools, label: 'Skills' },
    { id: 'resume', icon: FaFileAlt, label: 'Resume' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
           <div class="loader"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex flex-wrap border-b">
            {tabs.map(({ id, icon: Icon, label }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(id)}
                className={`flex-1 min-w-[120px] py-4 px-6 flex items-center justify-center space-x-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </motion.button>
            ))}
          </div>

          {/* Forms */}
          <div className="p-6">
            {/* Basic Info Form */}
            {activeTab === 'basic' && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleBasicSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaUser className="w-4 h-4 mr-2 text-blue-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={basicInfo.name}
                    onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaEnvelope className="w-4 h-4 mr-2 text-blue-600" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={basicInfo.email}
                    onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Basic Info'}
                </motion.button>
              </motion.form>
            )}

            {/* Experience Form */}
            {activeTab === 'experience' && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleExperienceSubmit}
                className="space-y-6"
              >
                {experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg bg-gray-50 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium flex items-center">
                        <FaBriefcase className="w-4 h-4 mr-2 text-blue-600" />
                        Experience {index + 1}
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                          const newExp = experience.filter((_, i) => i !== index);
                          setExperience(newExp);
                        }}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const newExp = [...experience];
                            newExp[index].title = e.target.value;
                            setExperience(newExp);
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter job title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = [...experience];
                            newExp[index].company = e.target.value;
                            setExperience(newExp);
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter company name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FaCalendar className="w-4 h-4 mr-2 text-blue-600" />
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={exp.years || ''}
                          onChange={(e) => {
                            const newExp = [...experience];
                            newExp[index].years = e.target.value;
                            setExperience(newExp);
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter years of experience"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = [...experience];
                          newExp[index].description = e.target.value;
                          setExperience(newExp);
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        rows="3"
                        placeholder="Describe your role and responsibilities"
                      />
                    </div>
                  </motion.div>
                ))}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setExperience([...experience, { 
                      title: '', 
                      company: '', 
                      years: '', 
                      description: '' 
                    }])}
                    className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 font-medium flex items-center justify-center"
                  >
                    <FaPlus className="w-4 h-4 mr-2" />
                    Add Experience
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Experience'}
                  </motion.button>
                </div>
              </motion.form>
            )}

            {/* Education Form */}
            {activeTab === 'education' && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleEducationSubmit}
                className="space-y-6"
              >
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg bg-gray-50 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium flex items-center">
                        <FaGraduationCap className="w-4 h-4 mr-2 text-blue-600" />
                        Education {index + 1}
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                          const newEdu = education.filter((_, i) => i !== index);
                          setEducation(newEdu);
                        }}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEdu = [...education];
                            newEdu[index].degree = e.target.value;
                            setEducation(newEdu);
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter degree"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const newEdu = [...education];
                            newEdu[index].institution = e.target.value;
                            setEducation(newEdu);
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter institution name"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setEducation([...education, { degree: '', institution: '' }])}
                    className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 font-medium flex items-center justify-center"
                  >
                    <FaPlus className="w-4 h-4 mr-2" />
                    Add Education
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Education'}
                  </motion.button>
                </div>
              </motion.form>
            )}

            {/* Skills Form */}
            {activeTab === 'skills' && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSkillsSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaTools className="w-4 h-4 mr-2 text-blue-600" />
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={skills.join(', ')}
                    onChange={(e) => setSkills(e.target.value.split(',').map(s => s.trim()))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your skills (e.g. JavaScript, React, Node.js)"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Skills'}
                </motion.button>
              </motion.form>
            )}

            {/* Resume Upload */}
            {activeTab === 'resume' && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleResumeUpload}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaFileAlt className="w-4 h-4 mr-2 text-blue-600" />
                    Upload Resume
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
                      dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <FaUpload className="w-8 h-8 text-blue-500 mb-2" />
                      <p className="text-gray-600">Drag and drop your resume here or click to browse</p>
                      <p className="text-sm text-gray-500 mt-1">Supported formats: PDF, DOC, DOCX</p>
                    </label>
                  </div>
                </div>
                {resumeFile && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaFileAlt className="w-4 h-4 mr-2 text-blue-600" />
                    Selected file: {resumeFile.name}
                  </p>
                )}
                {profile.profile?.resume && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaFileAlt className="w-4 h-4 text-blue-600" />
                    <span>Current Resume:</span>
                    <a
                      href={profile.profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View Resume
                    </a>
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={saving || !resumeFile}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {saving ? 'Uploading...' : 'Upload Resume'}
                </motion.button>
              </motion.form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdateProfile; 