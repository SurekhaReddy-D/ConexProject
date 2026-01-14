import React, { useState, useEffect } from 'react';
import { tasksAPI, projectsAPI } from '../services/api';

const Tasks = () => {
  const [activeTab, setActiveTab] = useState('assigned');
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'assigned') {
      fetchAssignedTasks();
    } else {
      fetchCompletedTasks();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksData, projectsData] = await Promise.all([
        tasksAPI.getAll(),
        projectsAPI.getAll()
      ]);

      setProjects(projectsData);
      
      const assigned = tasksData.filter(t => t.status !== 'Completed');
      const completed = tasksData.filter(t => t.status === 'Completed');
      
      setAssignedTasks(assigned);
      setCompletedTasks(completed);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedTasks = async () => {
    try {
      const data = await tasksAPI.getAll({ status: { $ne: 'Completed' } });
      setAssignedTasks(data);
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
    }
  };

  const fetchCompletedTasks = async () => {
    try {
      const data = await tasksAPI.getAll({ status: 'Completed' });
      setCompletedTasks(data);
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
    }
  };

  const groupTasksByProject = (tasks) => {
    const grouped = {};
    tasks.forEach(task => {
      const projectId = task.projectId?._id || task.projectId;
      if (!grouped[projectId]) {
        grouped[projectId] = {
          project: task.projectId,
          tasks: []
        };
      }
      grouped[projectId].tasks.push(task);
    });
    return Object.values(grouped);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const groupedAssignedTasks = groupTasksByProject(assignedTasks);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <p className="text-gray-600 mt-2">Manage your assigned tasks and track completed work</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assigned'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Assigned ({assignedTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed ({completedTasks.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'assigned' && (
        <div className="space-y-6">
          {groupedAssignedTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No assigned tasks</p>
            </div>
          ) : (
            groupedAssignedTasks.map((group) => (
              <div key={group.project?._id || 'unknown'} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{group.project?.name || 'Unknown Project'}</h2>
                      {group.project?.description && (
                        <p className="text-sm text-gray-600 mt-1">{group.project.description}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{group.tasks.length} tasks</span>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {group.tasks.map((task) => (
                    <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{task.title || task.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          
                          {task.description && (
                            <p className="text-gray-600 mb-2">{task.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {task.deadline && (
                              <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                            )}
                            {task.assignedTo && (
                              <span>Assigned to: {task.assignedTo.name || 'Unassigned'}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Completed Tasks</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {completedTasks.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No completed tasks</p>
              </div>
            ) : (
              completedTasks.map((task) => (
                <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{task.title || task.name}</h3>
                        {task.projectId && (
                          <span className="text-sm text-gray-500">• {task.projectId.name || 'Unknown Project'}</span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {task.completionDate && (
                          <span>Completed: {new Date(task.completionDate).toLocaleDateString()}</span>
                        )}
                        {task.assignedTo && (
                          <span>by {task.assignedTo.name || 'Unknown'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
