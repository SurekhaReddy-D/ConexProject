import React, { useState, useEffect } from 'react';
import { meetingsAPI } from '../services/api';

const Meetings = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [ongoingMeetings, setOngoingMeetings] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [meetingHistory, setMeetingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    if (activeTab === 'ongoing') {
      fetchOngoingMeetings();
    } else if (activeTab === 'upcoming') {
      fetchUpcomingMeetings();
    } else {
      fetchMeetingHistory();
    }
  }, [activeTab]);

  const fetchMeetings = async () => {
    try {
      await Promise.all([
        fetchOngoingMeetings(),
        fetchUpcomingMeetings(),
        fetchMeetingHistory()
      ]);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOngoingMeetings = async () => {
    try {
      const data = await meetingsAPI.getOngoing();
      setOngoingMeetings(data);
    } catch (error) {
      console.error('Error fetching ongoing meetings:', error);
    }
  };

  const fetchUpcomingMeetings = async () => {
    try {
      const data = await meetingsAPI.getUpcoming();
      setUpcomingMeetings(data);
    } catch (error) {
      console.error('Error fetching upcoming meetings:', error);
    }
  };

  const fetchMeetingHistory = async () => {
    try {
      const data = await meetingsAPI.getHistory();
      setMeetingHistory(data);
    } catch (error) {
      console.error('Error fetching meeting history:', error);
    }
  };

  const getMeetingTypeColor = (type) => {
    switch (type) {
      case 'Daily':
        return 'bg-blue-100 text-blue-800';
      case 'External':
        return 'bg-purple-100 text-purple-800';
      case 'Sprint':
        return 'bg-green-100 text-green-800';
      case 'Technical':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-green-100 text-green-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600 mt-2">Manage your meetings and collaborations</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create Meeting</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ongoing'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ongoing ({ongoingMeetings.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming ({upcomingMeetings.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            History ({meetingHistory.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'ongoing' && (
        <div className="space-y-4">
          {ongoingMeetings.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No ongoing meetings</h3>
              <p className="mt-1 text-sm text-gray-500">There are no meetings currently in progress.</p>
            </div>
          ) : (
            ongoingMeetings.map((meeting) => (
              <div key={meeting._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{meeting.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>Host: {meeting.host?.name || 'Unknown'}</span>
                      <span>{meeting.joinedMembers?.length || 0} participants</span>
                      <span>Started: {formatTime(meeting.time)}</span>
                      <span>Duration: {meeting.duration || 60} minutes</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Join</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingMeetings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No upcoming meetings</p>
            </div>
          ) : (
            upcomingMeetings.map((meeting) => (
              <div key={meeting._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{meeting.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMeetingTypeColor(meeting.type)}`}>
                        {meeting.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>Host: {meeting.host?.name || 'Unknown'}</span>
                      <span>{meeting.joinedMembers?.length || 0} participants</span>
                      <span>Date: {formatDate(meeting.time)}</span>
                      <span>Time: {formatTime(meeting.time)}</span>
                      <span>Duration: {meeting.duration || 60} minutes</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Join</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Meeting History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recording</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {meetingHistory.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No meeting history</td>
                  </tr>
                ) : (
                  meetingHistory.map((meeting) => (
                    <tr key={meeting._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{meeting.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(meeting.time)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{meeting.host?.name || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex -space-x-2">
                          {meeting.joinedMembers?.slice(0, 3).map((member, index) => (
                            <div key={index} className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white">
                              <span className="text-xs font-medium text-gray-600">{member.avatar || member.name.charAt(0)}</span>
                            </div>
                          ))}
                          {meeting.joinedMembers && meeting.joinedMembers.length > 3 && (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
                              <span className="text-xs font-medium text-gray-500">+{meeting.joinedMembers.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{meeting.duration || 60} minutes</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {meeting.hasDocument ? (
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {meeting.hasRecording ? (
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meetings;
