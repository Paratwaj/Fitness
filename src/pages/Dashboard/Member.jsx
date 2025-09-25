import React, { useState } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  Award,
  Clock,
  CheckCircle,
  Plus,
  Camera,
  Scale,
  Activity,
  Utensils,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const mockWorkouts = [
  {
    id: '1',
    name: 'Upper Body Strength',
    exercises: [
      { name: 'Push-ups', sets: 3, reps: '12-15', completed: true },
      { name: 'Pull-ups', sets: 3, reps: '8-10', completed: true },
      { name: 'Dumbbell Rows', sets: 3, reps: '12', weight: 25, completed: false },
      { name: 'Shoulder Press', sets: 3, reps: '10', weight: 20, completed: false }
    ],
    assignedBy: 'Sarah Johnson',
    createdAt: '2024-01-15',
    completedAt: undefined
  },
  {
    id: '2',
    name: 'Cardio Blast',
    exercises: [
      { name: 'Running', duration: 20, completed: true },
      { name: 'Burpees', sets: 4, reps: '10', completed: true },
      { name: 'Mountain Climbers', sets: 3, reps: '30 seconds', completed: true }
    ],
    assignedBy: 'Sarah Johnson',
    createdAt: '2024-01-14',
    completedAt: '2024-01-14'
  }
];

const mockMeals = [
  {
    id: '1',
    name: 'High Protein Breakfast',
    type: 'breakfast',
    calories: 450,
    protein: 35,
    foods: ['2 eggs', 'Greek yogurt', 'Berries', 'Almonds']
  },
  {
    id: '2',
    name: 'Lean Lunch',
    type: 'lunch',
    calories: 520,
    protein: 40,
    foods: ['Grilled chicken', 'Quinoa', 'Mixed vegetables', 'Olive oil']
  },
  {
    id: '3',
    name: 'Balanced Dinner',
    type: 'dinner',
    calories: 480,
    protein: 35,
    foods: ['Salmon', 'Sweet potato', 'Broccoli', 'Avocado']
  }
];

const mockProgress = [
  { date: '2024-01-01', weight: 190 },
  { date: '2024-01-08', weight: 188 },
  { date: '2024-01-15', weight: 186 },
  { date: '2024-01-22', weight: 185 }
];

export const MemberDashboard = () => {
  const { user } = useAuth();
  const [newWeight, setNewWeight] = useState('');
  const [activeTab, setActiveTab] = useState('workouts');

  const member = user; // Type assertion for demo

  const handleWeightSubmit = (e) => {
    e.preventDefault();
    if (newWeight) {
      // In real app, this would save to backend
      console.log('New weight logged:', newWeight);
      setNewWeight('');
    }
  };

  const completedWorkouts = mockWorkouts.filter(w => w.completedAt).length;
  const totalWorkouts = mockWorkouts.length;
  const currentWeight = member?.stats?.currentWeight || 180;
  const goalWeight = member?.stats?.goalWeight || 165;
  const progressPercentage = Math.round(((190 - currentWeight) / (190 - goalWeight)) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Let's continue your fitness journey. You're doing great!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Weight</p>
                <p className="text-2xl font-bold text-gray-900">{currentWeight} lbs</p>
              </div>
              <Scale className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Goal Progress</p>
                <p className="text-2xl font-bold text-green-600">{progressPercentage}%</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Workouts Done</p>
                <p className="text-2xl font-bold text-purple-600">{completedWorkouts}/{totalWorkouts}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Days Active</p>
                <p className="text-2xl font-bold text-orange-600">12</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">Premium Membership</h3>
              <p className="text-blue-100">
                Your subscription is active until July 15, 2024
              </p>
              <p className="text-blue-200 text-sm mt-1">
                Assigned Trainer: Sarah Johnson
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
                <Bell className="w-4 h-4 inline mr-2" />
                Notifications
              </button>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                Manage Plan
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-200 rounded-xl p-1 mb-8 max-w-md">
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
            onClick={() => setActiveTab('nutrition')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'nutrition'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Nutrition
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'progress'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Progress
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'workouts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Workouts</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all ${
                    workout.completedAt ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{workout.name}</h3>
                    {workout.completedAt && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm">Complete</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {workout.exercises.map((exercise, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          exercise.completed ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      >
                        <div>
                          <p className="font-medium text-gray-900">{exercise.name}</p>
                          <p className="text-sm text-gray-600">
                            {exercise.sets && `${exercise.sets} sets × `}
                            {exercise.reps}
                            {exercise.weight && ` @ ${exercise.weight}lbs`}
                            {exercise.duration && `${exercise.duration} minutes`}
                          </p>
                        </div>
                        {exercise.completed && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Assigned by {workout.assignedBy}
                    </p>
                    {!workout.completedAt && (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Start Workout
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Today's Meal Plan</h2>
              <div className="text-sm text-gray-600">
                Target: 1,450 calories • 110g protein
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockMeals.map((meal) => (
                <div key={meal.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {meal.type}
                    </h3>
                    <Utensils className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-3">{meal.name}</h4>
                  
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>{meal.calories} cal</span>
                    <span>{meal.protein}g protein</span>
                  </div>
                  
                  <ul className="space-y-1">
                    {meal.foods.map((food, index) => (
                      <li key={index} className="text-sm text-gray-700">• {food}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Nutrition Tips</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• Drink at least 8 glasses of water throughout the day</li>
                <li>• Include a source of protein with each meal</li>
                <li>• Don't skip meals - consistency is key for your goals</li>
                <li>• Consider a post-workout protein shake within 30 minutes</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Progress Tracking</h2>
            </div>

            {/* Weight Logging */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Your Weight</h3>
              <form onSubmit={handleWeightSubmit} className="flex space-x-4">
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Enter weight (lbs)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Log Weight
                </button>
              </form>
            </div>

            {/* Progress Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
              <div className="space-y-3">
                {mockProgress.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-600">{format(new Date(entry.date), 'MMM dd, yyyy')}</span>
                    <span className="font-semibold text-gray-900">{entry.weight} lbs</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Progress */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Progress Photos</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Week {i}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals Summary */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Your Progress Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{190 - currentWeight} lbs</div>
                  <div className="text-green-100">Weight Lost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{goalWeight - currentWeight} lbs</div>
                  <div className="text-green-100">To Goal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{progressPercentage}%</div>
                  <div className="text-green-100">Complete</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};