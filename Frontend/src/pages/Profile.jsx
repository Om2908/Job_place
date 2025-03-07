import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from '../services/profileService';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaUserCircle, FaEnvelope, FaBriefcase, FaGraduationCap, FaTools, FaFileAlt, FaPencilAlt, FaCalendar, FaBuilding, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import '../App.css'
const Profile = () => {
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const sectionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-8">
            <div className="absolute top-4 right-4">
              <Link
                to="/update-profile"
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                <FaPencilAlt className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-full">
                <CgProfile className="w-16 h-16 text-BLACK-500" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <div className="flex items-center mt-1 text-blue-100">
                  <FaEnvelope className="w-4 h-4 mr-2" />
                  <p>{profile.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8 space-y-8">
            {/* Experience Section */}
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              onMouseEnter={() => setActiveSection('experience')}
              onMouseLeave={() => setActiveSection(null)}
              className={`transform transition-all duration-200 border border-gray-100 rounded-xl p-6 ${
                activeSection === 'experience' ? 'scale-102 shadow-md border-blue-100' : 'hover:border-blue-100'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaBriefcase className="w-5 h-5 mr-2 text-blue-600" />
                  Experience
                </h2>
                {profile.profile?.experience?.length === 0 && (
                  <Link
                    to="/update-profile"
                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <FaPlus className="w-3 h-3 mr-1" />
                    Add
                  </Link>
                )}
              </div>
              {profile.profile?.experience?.length > 0 ? (
                <div className="space-y-4">
                  {profile.profile.experience.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                      <div className="flex items-center mt-1 text-blue-600">
                        <FaBuilding className="w-4 h-4 mr-2" />
                        <span>{exp.company}</span>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <FaCalendar className="w-4 h-4 mr-2" />
                        <span>{exp.years} years</span>
                      </div>
                      <p className="mt-2 text-gray-600">{exp.description}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No experience added yet</p>
              )}
            </motion.section>

            {/* Education Section */}
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              onMouseEnter={() => setActiveSection('education')}
              onMouseLeave={() => setActiveSection(null)}
              className={`transform transition-all duration-200 border border-gray-100 rounded-xl p-6 ${
                activeSection === 'education' ? 'scale-102 shadow-md border-blue-100' : 'hover:border-blue-100'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaGraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                  Education
                </h2>
                {profile.profile?.education?.length === 0 && (
                  <Link
                    to="/update-profile"
                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <FaPlus className="w-3 h-3 mr-1" />
                    Add
                  </Link>
                )}
              </div>
              {profile.profile?.education?.length > 0 ? (
                <div className="space-y-4">
                  {profile.profile.education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <div className="flex items-center mt-1 text-blue-600">
                        <FaBuilding className="w-4 h-4 mr-2" />
                        <span>{edu.institution}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No education added yet</p>
              )}
            </motion.section>

            {/* Skills Section */}
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              onMouseEnter={() => setActiveSection('skills')}
              onMouseLeave={() => setActiveSection(null)}
              className={`transform transition-all duration-200 border border-gray-100 rounded-xl p-6 ${
                activeSection === 'skills' ? 'scale-102 shadow-md border-blue-100' : 'hover:border-blue-100'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaTools className="w-5 h-5 mr-2 text-blue-600" />
                  Skills
                </h2>
                {profile.profile?.skills?.length === 0 && (
                  <Link
                    to="/update-profile"
                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <FaPlus className="w-3 h-3 mr-1" />
                    Add
                  </Link>
                )}
              </div>
              {profile.profile?.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.profile.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100 hover:bg-blue-100 transition-colors cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills added yet</p>
              )}
            </motion.section>

            {/* Resume Section */}
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              onMouseEnter={() => setActiveSection('resume')}
              onMouseLeave={() => setActiveSection(null)}
              className={`transform transition-all duration-200 border border-gray-100 rounded-xl p-6 ${
                activeSection === 'resume' ? 'scale-102 shadow-md border-blue-100' : 'hover:border-blue-100'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaFileAlt className="w-5 h-5 mr-2 text-blue-600" />
                  Resume
                </h2>
                {!profile.profile?.resume && (
                  <Link
                    to="/update-profile"
                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <FaPlus className="w-3 h-3 mr-1" />
                    Add
                  </Link>
                )}
              </div>
              {profile.profile?.resume ? (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={profile.profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  <FaFileAlt className="w-4 h-4 mr-2" />
                  Download Resume
                </motion.a>
              ) : (
                <p className="text-gray-500 italic">No resume uploaded yet</p>
              )}
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 