import React, { useState, useEffect } from 'react';
import { projectsAPI, tasksAPI, actionsAPI } from '../services/api';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [taskProgress, setTaskProgress] = useState({
    completed: 0,
    inProgress: 0,
    pending: 0,
    blocked: 0
  });
  const [recentActions, setRecentActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsData, tasksData, actionsData] = await Promise.all([
        projectsAPI.getAll(),
        tasksAPI.getAll(),
        actionsAPI.getAll({ limit: 5 })
      ]);

      setProjects(projectsData);
      setRecentActions(actionsData);

      // Calculate task progress
      const total = tasksData.length;
      const completed = tasksData.filter(t => t.status === 'Completed').length;
      const inProgress = tasksData.filter(t => t.status === 'In Progress').length;
      const pending = tasksData.filter(t => t.status === 'Pending').length;
      const blocked = tasksData.filter(t => t.status === 'Blocked').length;

      setTaskProgress({
        completed: total > 0 ? Math.round((completed / total) * 100) : 0,
        inProgress: total > 0 ? Math.round((inProgress / total) * 100) : 0,
        pending: total > 0 ? Math.round((pending / total) * 100) : 0,
        blocked: total > 0 ? Math.round((blocked / total) * 100) : 0
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (type) => {
    const colorMap = {
      'project_created': 'blue',
      'meeting_completed': 'green',
      'task_assigned': 'yellow',
      'milestone_reached': 'purple',
      'comment_added': 'gray',
      'task_completed': 'green'
    };
    return colorMap[type] || 'gray';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const actionDate = new Date(date);
    const diffInSeconds = Math.floor((now - actionDate) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Meetings</p>
              <p className="text-2xl font-semibold text-gray-900">-</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{taskProgress.pending}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-semibold text-gray-900">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Cards */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">My Projects</h2>
            </div>
            <div className="p-6">
              {projects.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No projects yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <div key={project._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900 text-sm">{project.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{project.description || 'No description'}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{project.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {project.members && project.members.slice(0, 3).map((member, index) => (
                            <div key={index} className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white">
                              <span className="text-xs font-medium text-gray-600">{member.avatar || member.name.charAt(0)}</span>
                            </div>
                          ))}
                          {project.members && project.members.length > 3 && (
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
                              <span className="text-xs font-medium text-gray-500">+{project.members.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Task Progress Chart */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Task Progress</h2>
            </div>
            <div className="p-6">
              {/* Placeholder Pie Chart */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                  <circle
                    cx="16" cy="16" r="14"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeDasharray={`${(taskProgress.completed / 100) * 88} 88`}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="16" cy="16" r="14"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeDasharray={`${(taskProgress.inProgress / 100) * 88} 88`}
                    strokeDashoffset={`-${(taskProgress.completed / 100) * 88}`}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="16" cy="16" r="14"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    strokeDasharray={`${(taskProgress.pending / 100) * 88} 88`}
                    strokeDashoffset={`-${((taskProgress.completed + taskProgress.inProgress) / 100) * 88}`}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="16" cy="16" r="14"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="4"
                    strokeDasharray={`${(taskProgress.blocked / 100) * 88} 88`}
                    strokeDashoffset={`-${((taskProgress.completed + taskProgress.inProgress + taskProgress.pending) / 100) * 88}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-900">100%</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{taskProgress.completed}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">In Progress</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{taskProgress.inProgress}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{taskProgress.pending}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Blocked</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{taskProgress.blocked}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Actions</h2>
        </div>
        <div className="p-6">
          {recentActions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent actions</p>
          ) : (
            <div className="space-y-4">
              {recentActions.map((action) => {
                const color = getActionColor(action.type);
                const colorClass = {
                  'blue': 'bg-blue-500',
                  'green': 'bg-green-500',
                  'yellow': 'bg-yellow-500',
                  'purple': 'bg-purple-500',
                  'gray': 'bg-gray-500'
                }[color] || 'bg-gray-500';
                
                return (
                  <div key={action._id} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 ${colorClass} rounded-full`}></div>
                    <div className="flex-1">
                      <p className="text-gray-700">{action.title}</p>
                      <p className="text-sm text-gray-500">by {action.user?.name || 'Unknown'}</p>
                    </div>
                    <span className="text-sm text-gray-500">{formatTimeAgo(action.createdAt)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
