import React, { useState } from 'react';
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
  Dumbbell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const mockMembers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinDate: '2024-01-15',
    currentWeight: 180,
    goalWeight: 165,
    startWeight: 190,
    lastWorkout: '2024-01-20',
    completedWorkouts: 8,
    totalWorkouts: 12,
    status: 'active'
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatar: 'https://images.pexels.com/photos/1036620/pexels-photo-1036620.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinDate: '2024-01-10',
    currentWeight: 140,
    goalWeight: 125,
    startWeight: 155,
    lastWorkout: '2024-01-19',
    completedWorkouts: 15,
    totalWorkouts: 18,
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinDate: '2024-01-05',
    currentWeight: 200,
    goalWeight: 180,
    startWeight: 220,
    lastWorkout: '2024-01-18',
    completedWorkouts: 6,
    totalWorkouts: 20,
    status: 'inactive'
  }
];

const mockWorkoutTemplates = [
  { id: '1', name: 'Beginner Full Body', category: 'Strength', exercises: 6 },
  { id: '2', name: 'Cardio Blast', category: 'Cardio', exercises: 5 },
  { id: '3', name: 'Upper Body Focus', category: 'Strength', exercises: 8 },
  { id: '4', name: 'HIIT Training', category: 'HIIT', exercises: 7 }
];

export const TrainerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);

  const trainer = user;
  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMembers = mockMembers.filter(m => m.status === 'active').length;
  const totalWorkoutsAssigned = mockMembers.reduce((sum, m) => sum + m.totalWorkouts, 0);
  const totalWorkoutsCompleted = mockMembers.reduce((sum, m) => sum + m.completedWorkouts, 0);
  const averageCompletion = Math.round((totalWorkoutsCompleted / totalWorkoutsAssigned) * 100);

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
                <p className="text-2xl font-bold text-orange-600">24</p>
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
              <h2 className="text-2xl font-bold text-gray-900">Your Members</h2>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={member.avatar}
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
                        {member.startWeight - member.currentWeight} / {member.startWeight - member.goalWeight} lbs
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(((member.startWeight - member.currentWeight) / (member.startWeight - member.goalWeight)) * 100, 100)}%`
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Workouts</span>
                      <span className="font-medium text-gray-900">
                        {member.completedWorkouts}/{member.totalWorkouts}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Workout</span>
                      <span className="font-medium text-gray-900">
                        {format(new Date(member.lastWorkout), 'MMM dd')}
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
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'workouts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Workout Management</h2>
              <button
                onClick={() => setShowCreateWorkout(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Workout</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockWorkoutTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.category === 'Strength' ? 'bg-blue-100 text-blue-800' :
                      template.category === 'Cardio' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {template.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {template.exercises} exercises
                  </p>
                  
                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Assign to Member
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Edit Template
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showCreateWorkout && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Create New Workout</h3>
                  <button
                    onClick={() => setShowCreateWorkout(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workout Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Upper Body Strength"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Strength</option>
                      <option>Cardio</option>
                      <option>HIIT</option>
                      <option>Flexibility</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Member
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Select a member...</option>
                    {mockMembers.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowCreateWorkout(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Create Workout
                  </button>
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
                  {mockMembers.slice(0, 3).map(member => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-900">{member.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {Math.round(((member.startWeight - member.currentWeight) / (member.startWeight - member.goalWeight)) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">Goal Progress</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month's Highlights</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New Members Joined</span>
                    <span className="font-semibold text-green-600">+3</span>
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
                    You've helped your members lose a combined total of 45 lbs and complete 78 workouts. 
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