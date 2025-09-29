import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Dumbbell, Apple, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { contentAPI } from '../services/api';

export const Recommendations = () => {
  const location = useLocation();
  const selectedItem = location.state?.selectedItem;
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await contentAPI.getRecommendations();
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        toast.error('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'workout':
        return <Dumbbell className="w-6 h-6" />;
      case 'diet':
        return <Apple className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Recommendations</h1>
          {selectedItem && (
            <p className="text-gray-600">
              Based on your interest in: <span className="font-semibold">{selectedItem.name}</span>
            </p>
          )}
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  {getIcon(rec.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{rec.name}</h3>
                  <span className="text-sm text-blue-600 capitalize">{rec.type}</span>
                </div>
              </div>

              {rec.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{rec.description}</p>
              )}

              {rec.type === 'workout' && rec.exercises && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Exercises:</p>
                  <div className="flex flex-wrap gap-1">
                    {rec.exercises.slice(0, 3).map((exercise, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {exercise.name}
                      </span>
                    ))}
                    {rec.exercises.length > 3 && (
                      <span className="text-xs text-gray-500">+{rec.exercises.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}

              {rec.type === 'diet' && rec.meals && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Sample meals:</p>
                  <div className="flex flex-wrap gap-1">
                    {rec.meals.slice(0, 3).map((meal, i) => (
                      <span
                        key={i}
                        className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                      >
                        {meal.name}
                      </span>
                    ))}
                    {rec.meals.length > 3 && (
                      <span className="text-xs text-gray-500">+{rec.meals.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}

              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                View Details
              </button>
            </div>
          ))}
        </div>

        {recommendations.length === 0 && (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recommendations yet</h3>
            <p className="text-gray-600">Check back later for personalized recommendations!</p>
          </div>
        )}
      </div>
    </div>
  );
};
