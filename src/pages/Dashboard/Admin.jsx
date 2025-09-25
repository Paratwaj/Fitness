import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  UserPlus,
  UserMinus,
  CreditCard,
  AlertTriangle,
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const mockStats = {
  totalUsers: 1247,
  activeMembers: 983,
  trainers: 45,
  revenue: 78450,
  monthlyGrowth: 12.5,
  churnRate: 3.2,
  avgSubscriptionValue: 79.80
};

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'member',
    status: 'active',
    joinDate: '2024-01-15',
    subscription: { plan: 'Premium', amount: 79, nextBilling: '2024-07-15' },
    lastActive: '2024-01-20'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'trainer',
    status: 'active',
    joinDate: '2023-06-01',
    subscription: null,
    lastActive: '2024-01-21'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    role: 'member',
    status: 'cancelled',
    joinDate: '2023-12-01',
    subscription: { plan: 'Basic', amount: 29, nextBilling: '2024-02-01' },
    lastActive: '2024-01-18'
  }
];

const mockPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    subscribers: 234,
    revenue: 6786,
    status: 'active'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79,
    subscribers: 456,
    revenue: 36024,
    status: 'active'
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 149,
    subscribers: 123,
    revenue: 18327,
    status: 'active'
  }
];

const mockRecentTransactions = [
  { id: '1', user: 'John Doe', amount: 79, plan: 'Premium', date: '2024-01-20', status: 'completed' },
  { id: '2', user: 'Emma Wilson', amount: 29, plan: 'Basic', date: '2024-01-20', status: 'completed' },
  { id: '3', user: 'Mike Brown', amount: 149, plan: 'Elite', date: '2024-01-19', status: 'failed' },
  { id: '4', user: 'Sarah Davis', amount: 79, plan: 'Premium', date: '2024-01-19', status: 'completed' }
];

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = userFilter === 'all' || 
                         userFilter === user.role ||
                         (userFilter === 'active' && user.status === 'active') ||
                         (userFilter === 'inactive' && user.status !== 'active');
                         
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage your fitness platform
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-200 rounded-xl p-1 mb-8 max-w-lg">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'users', label: 'Users' },
            { key: 'plans', label: 'Plans' },
            { key: 'analytics', label: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">+{mockStats.monthlyGrowth}% from last month</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${mockStats.revenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">+15.3% from last month</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Members</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.activeMembers.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mt-1">{mockStats.trainers} trainers</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Churn Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.churnRate}%</p>
                    <p className="text-sm text-red-600 mt-1">+0.5% from last month</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Recent Activity & Plans Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Transactions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
                </div>
                <div className="space-y-4">
                  {mockRecentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.user}</p>
                        <p className="text-sm text-gray-600">{transaction.plan} • {format(new Date(transaction.date), 'MMM dd')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${transaction.amount}</p>
                        <p className={`text-xs ${
                          transaction.status === 'completed' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plans Performance */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Plans Performance</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Manage Plans</button>
                </div>
                <div className="space-y-4">
                  {mockPlans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{plan.name}</p>
                        <p className="text-sm text-gray-600">{plan.subscribers} subscribers</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${plan.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">${plan.price}/month</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Attention Required</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    15 subscription renewals are due this week. 3 failed payment attempts need follow-up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="members">Members</option>
                  <option value="trainers">Trainers</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'trainer' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.subscription ? (
                            <div>
                              <div>{user.subscription.plan}</div>
                              <div className="text-xs text-gray-500">${user.subscription.amount}/mo</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(user.joinDate), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Create Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockPlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-gray-900">${plan.price}</div>
                      <div className="text-sm text-gray-500">per month</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subscribers</span>
                        <span className="font-semibold text-gray-900">{plan.subscribers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Revenue</span>
                        <span className="font-semibold text-gray-900">${plan.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          plan.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {plan.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Edit Plan
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      View Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
            
            {/* Revenue Analytics */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${mockStats.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">${Math.round(mockStats.avgSubscriptionValue)}</div>
                  <div className="text-sm text-gray-600">Avg. Subscription</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{mockStats.churnRate}%</div>
                  <div className="text-sm text-gray-600">Churn Rate</div>
                </div>
              </div>
            </div>

            {/* User Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New Signups (This Month)</span>
                    <span className="font-semibold text-green-600">+147</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cancellations</span>
                    <span className="font-semibold text-red-600">-31</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Net Growth</span>
                    <span className="font-semibold text-blue-600">+116</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Features</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Workout Tracking</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nutrition Plans</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">72%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Progress Photos</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '58%' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">58%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};