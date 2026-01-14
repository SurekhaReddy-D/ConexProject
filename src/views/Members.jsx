import React, { useState, useEffect } from 'react';
import { usersAPI, projectsAPI } from '../services/api';

const Members = () => {
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProject === 'all') {
      fetchMembers();
    } else {
      fetchMembersByProject();
    }
  }, [selectedProject]);

  const fetchData = async () => {
    try {
      const [membersData, projectsData] = await Promise.all([
        usersAPI.getAll(),
        projectsAPI.getAll()
      ]);
      setMembers(membersData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const data = await usersAPI.getAll();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchMembersByProject = async () => {
    try {
      const data = await usersAPI.getByProject(selectedProject);
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members by project:', error);
    }
  };

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Engineering':
        return 'bg-blue-100 text-blue-800';
      case 'Design':
        return 'bg-purple-100 text-purple-800';
      case 'Product':
        return 'bg-green-100 text-green-800';
      case 'Marketing':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    if (role === 'manager' || role === 'admin') return 'bg-indigo-100 text-indigo-800';
    return 'bg-gray-100 text-gray-800';
  };

  const openProfile = (member) => {
    setSelectedMember(member);
    setShowProfile(true);
  };

  const closeProfile = () => {
    setShowProfile(false);
    setSelectedMember(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Member Directory</h1>
        <p className="text-gray-600 mt-2">Connect with your team members and view their profiles</p>
      </div>

      {/* Project Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Project:</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member) => (
          <div key={member._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-blue-600">{member.avatar || member.name.charAt(0)}</span>
                </div>
                <div>
                  <button
                    onClick={() => openProfile(member)}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
                  >
                    {member.name}
                  </button>
                  <p className="text-sm text-gray-600">{member.role || 'Member'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(member.department)}`}>
                  {member.department}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                  {member.role || 'member'}
                </span>
              </div>

              {member.skills && member.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {member.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      {showProfile && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-semibold text-blue-600">{selectedMember.avatar || selectedMember.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedMember.name}</h2>
                    <p className="text-lg text-gray-600">{selectedMember.role || 'Member'}</p>
                    {selectedMember.joinDate && (
                      <p className="text-sm text-gray-500">Joined {new Date(selectedMember.joinDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={closeProfile}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Bio */}
              {selectedMember.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-600">{selectedMember.bio}</p>
                </div>
              )}

              {/* Skills */}
              {selectedMember.skills && selectedMember.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Links */}
              {selectedMember.contact && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
                  <div className="space-y-3">
                    {selectedMember.contact.email && (
                      <a
                        href={`mailto:${selectedMember.contact.email}`}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700">{selectedMember.contact.email}</span>
                      </a>
                    )}
                    {selectedMember.contact.discord && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-gray-700">{selectedMember.contact.discord}</span>
                      </div>
                    )}
                    {selectedMember.contact.linkedin && (
                      <a
                        href={`https://${selectedMember.contact.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="text-gray-700">LinkedIn Profile</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
