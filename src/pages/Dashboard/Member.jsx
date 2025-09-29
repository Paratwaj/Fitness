import React, { useState, useEffect } from 'react';
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
  Bell,
  Loader2,
  CreditCard,
  Edit
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  subscriptionsAPI, 
  contentAPI, 
  progressAPI, 
  paymentsAPI 
} from '../../services/api';

export const MemberDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [newWeight, setNewWeight] = useState('');
  const [activeTab, setActiveTab] = useState('workouts');
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [diets, setDiets] = useState([]);
  const [progress, setProgress] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [renewing, setRenewing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [subRes, workoutRes, dietRes, progRes, payRes] = await Promise.all([
          subscriptionsAPI.getByUser(user.id),
          contentAPI.getWorkouts(),
          contentAPI.getDiets(),
          progressAPI.getByUser(user.id),
          paymentsAPI.getByUser(user.id)
        ]);

        setSubscription(subRes.data);
        setWorkouts(workoutRes.data);
        setDiets(dietRes.data);
        setProgress(progRes.data);
        setPayments(payRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated]);

  const handleWeightSubmit = async (e) => {
    e.preventDefault();
    if (!newWeight || !user?.id) return;

    try {
      await progressAPI.create({
        userId: user.id,
        weight: parseFloat(newWeight),
        date: new Date().toISOString()
      });
      toast.success('Weight logged successfully!');
      setNewWeight('');
      // Refresh progress
      const res = await progressAPI.getByUser(user.id);
      setProgress(res.data);
    } catch (error) {
      toast.error('Failed to log weight. Please try again.');
    }
  };

  const handleRenewSubscription = async () => {
    if (!subscription?.id) return;

    setRenewing(true);
    try {
      const newEndDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year
      await subscriptionsAPI.update(subscription.id, { endDate: newEndDate });
      toast.success('Subscription renewed successfully!');
      // Refresh subscription
      const res = await subscriptionsAPI.getByUser(user.id);
      setSubscription(res.data);
    } catch (error) {
      toast.error('Failed to renew subscription. Please try again.');
    } finally {
      setRenewing(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('userId', user.id);
    formData.append('date', new Date().toISOString());

    setUploadingPhoto(true);
    try {
      await progressAPI.create(formData);
      toast.success('Photo uploaded successfully!');
      e.target.value = ''; // Reset input
    } catch (error) {
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const completedWorkouts = workouts.filter(w => w.completedAt).length;
  const totalWorkouts = workouts.length;
  const currentWeight = progress[progress.length - 1]?.weight || 180;
  const goalWeight = user?.stats?.goalWeight || 165;
  const progressPercentage = progress.length > 0 ? Math.round(((progress[0].weight - currentWeight) / (progress[0].weight - goalWeight)) * 100) : 0;

  const chartData = progress.map(p => ({
    date: format(new Date(p.date), 'MMM dd'),
    weight: p.weight
  }));

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
                <p className="text-2xl font-bold text-orange-600">{progress.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        {subscription && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-xl font-semibold mb-2">{subscription.planName || 'Premium'} Membership</h3>
                <p className="text-blue-100">
                  Active until {format(new Date(subscription.endDate), 'MMM dd, yyyy')}
                </p>
                {subscription.trainerName && (
                  <p className="text-blue-200 text-sm mt-1">
                    Assigned Trainer: {subscription.trainerName}
                  </p>
                )}
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
                  <Bell className="w-4 h-4 inline mr-2" />
                  Notifications
                </button>
                <button 
                  onClick={handleRenewSubscription}
                  disabled={renewing}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {renewing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Renewing...</span>
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      <span>Renew</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

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
              {workouts.length === 0 && !loading && (
                <p className="text-gray-500">No workouts assigned yet.</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {workouts.map((workout) => (
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
                    {workout.exercises?.map((exercise, index) => (
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
                    )) || <p className="text-gray-500">No exercises listed.</p>}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Assigned by {workout.assignedBy || 'Trainer'}
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
              {diets.map((meal) => (
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
                    {meal.foods?.map((food, index) => (
                      <li key={index} className="text-sm text-gray-700">• {food}</li>
                    )) || <p className="text-gray-500">No foods listed.</p>}
                  </ul>
                </div>
              )) || <p className="text-gray-500">No meal plan available.</p>}
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
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !newWeight}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Log Weight
                </button>
              </form>
            </div>

            {/* Progress Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
              {progress.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">No progress data yet. Log your first weight!</p>
              )}
            </div>

            {/* Weight History List */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight History</h3>
              <div className="space-y-2">
                {progress.slice(-5).reverse().map((entry, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-600">{format(new Date(entry.date), 'MMM dd, yyyy')}</span>
                    <span className="font-semibold text-gray-900">{entry.weight} lbs</span>
                  </div>
                ))}
                {progress.length === 0 && <p className="text-gray-500">No weight entries yet.</p>}
              </div>
            </div>

            {/* Photo Progress */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Progress Photos</h3>
                <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {/* Assume photos are in progress data; display placeholders for now */}
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

            {/* Payment History */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
              {payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.slice(-5).map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(new Date(payment.date), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.planName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              payment.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No payment history yet.</p>
              )}
            </div>

            {/* Goals Summary */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Your Progress Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{progress[0]?.weight - currentWeight || 0} lbs</div>
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
