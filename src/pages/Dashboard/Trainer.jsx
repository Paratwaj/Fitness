import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Plus, 
  Search,
  Filter,
  CheckCircle,
  Clock,
  MessageCircle,
  TrendingUp,
  Award,
  Target,
  Dumbbell,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  usersAPI, 
  contentAPI 
} from '../../services/api';

export const TrainerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [diets, setDiets] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [membersRes, workoutsRes, dietsRes] = await Promise.all([
          usersAPI.getMembersByTrainer(user.id),
          contentAPI.getWorkouts(),
          contentAPI.getDiets()
        ]);

        setMembers(membersRes.data);
        setWorkouts(workoutsRes.data);
        setDiets(dietsRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated]);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMembers = members.filter(m => m.status === 'active').length;
  const totalWorkoutsAssigned = members.reduce((sum, m) => sum + (m.totalWorkouts || 0), 0);
  const totalWorkoutsCompleted = members.reduce((sum, m) => sum + (m.completedWorkouts || 0), 0);
  const averageCompletion = totalWorkoutsAssigned > 0 ? Math.round((totalWorkoutsCompleted / totalWorkoutsAssigned) * 100) : 0;

  const handleAssignContent = async (memberId, contentType) => {
    if (!selectedContent || !memberId) return;

    setAssigning(true);
    try {
      await contentAPI.assign({
        memberId,
        contentType, // 'workout' or 'diet'
        contentId: selectedContent.id
      });
      toast.success('Content assigned successfully!');
      setShowAssignModal(false);
      setSelectedContent(null);
      // Refresh members data if needed
    } catch (error) {
      toast.error('Failed to assign content. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Trainer Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your members and track their progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-blue-600">{activeMembers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">{averageCompletion}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Workouts Assigned</p>
                <p className="text-2xl font-bold text-purple-600">{totalWorkoutsAssigned}</p>
              </div>
              <Dumbbell className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-orange-600">{members.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-200 rounded-xl p-1 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'members'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('workouts')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'workouts'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Workouts
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-bold text-gray-900">Your Members ({members.length})</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search members..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </div>
            </div>

            {members.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No members assigned yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={member.avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150'}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        member.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                      }`}></div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">
                          {member.startWeight - member.currentWeight || 0} / {member.startWeight - member.goalWeight || 0} lbs
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(((member.startWeight - member.currentWeight) / (member.startWeight - member.goalWeight || 1)) * 100, 100)}%`
                          }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Workouts</span>
                        <span className="font-medium text-gray-900">
                          {member.completedWorkouts || 0}/{member.totalWorkouts || 0}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Workout</span>
                        <span className="font-medium text-gray-900">
                          {member.lastWorkout ? format(new Date(member.lastWorkout), 'MMM dd') : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-2">
                      <button
                        onClick={() => setSelectedMember(member.id)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedContent(null);
                          setShowAssignModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'workouts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Workout Management</h2>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                onClick={() => setShowAssignModal(true)}
              >
                <Plus className="w-4 h-4" />
                <span>Assign Content</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...workouts, ...diets].map((content) => (
                <div key={content.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-900">{content.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      content.type === 'workout' ? 'bg-blue-100 text-blue-800' :
                      content.type === 'diet' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {content.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {content.exercises || content.meals || 0} items
                  </p>
                  
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        setSelectedContent(content);
                        setShowAssignModal(true);
                      }}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Assign to Member
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Assign Modal */}
            {showAssignModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Assign {selectedContent?.name || 'Content'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowAssignModal(false);
                        setSelectedContent(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Member
                      </label>
                      <select 
                        onChange={(e) => setSelectedMember(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Choose a member...</option>
                        {members.map(member => (
                          <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content Type
                      </label>
                      <select 
                        value={selectedContent?.type || ''}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      >
                        <option>{selectedContent?.type || 'N/A'}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowAssignModal(false);
                        setSelectedContent(null);
                        setSelectedMember(null);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleAssignContent(selectedMember, selectedContent?.type)}
                      disabled={assigning || !selectedMember || !selectedContent}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {assigning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                          Assigning...
                        </>
                      ) : (
                        'Assign'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Progress Overview</h3>
                <div className="space-y-4">
                  {members.slice(0, 3).map(member => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={member.avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150'}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-900">{member.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {Math.round(((member.startWeight - member.currentWeight || 0) / (member.startWeight - member.goalWeight || 1)) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">Goal Progress</div>
                      </div>
                    </div>
                  ))}
                  {members.length === 0 && <p className="text-gray-500">No members yet.</p>}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month's Highlights</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New Members Joined</span>
                    <span className="font-semibold text-green-600">+{members.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Workouts Completed</span>
                    <span className="font-semibold text-blue-600">{totalWorkoutsCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Completion Rate</span>
                    <span className="font-semibold text-purple-600">{averageCompletion}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Member Satisfaction</span>
                    <span className="font-semibold text-yellow-600">4.8/5</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Your Impact This Month</h3>
                  <p className="text-blue-100">
                    You've helped your members lose a combined total of {members.reduce((sum, m) => sum + (m.startWeight - m.currentWeight || 0), 0)} lbs and complete {totalWorkoutsCompleted} workouts. 
                    Keep up the excellent work!
                  </p>
                </div>
                <Award className="w-16 h-16 text-yellow-300" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
