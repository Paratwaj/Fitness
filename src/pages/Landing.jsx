import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  CheckCircle, 
  Star, 
  Users, 
  Award, 
  Target,
  ArrowRight,
  Dumbbell,
  Heart,
  TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Personalized Training',
    description: 'Get custom workout plans tailored to your fitness goals and experience level.'
  },
  {
    icon: Heart,
    title: 'Nutrition Guidance',
    description: 'Expert-designed meal plans and nutritional advice to fuel your progress.'
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your journey with detailed analytics and milestone celebrations.'
  },
  {
    icon: Users,
    title: 'Expert Trainers',
    description: 'Work with certified professionals who are dedicated to your success.'
  }
];

const testimonials = [
  {
    name: 'Emma Thompson',
    role: 'Marketing Manager',
    avatar: 'https://images.pexels.com/photos/1036620/pexels-photo-1036620.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'FitHub transformed my fitness journey. The personalized approach and expert guidance made all the difference.',
    rating: 5
  },
  {
    name: 'David Rodriguez',
    role: 'Software Engineer',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Amazing platform! My trainer keeps me motivated and the progress tracking features are incredibly helpful.',
    rating: 5
  },
  {
    name: 'Sarah Chen',
    role: 'Teacher',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'The convenience of having everything in one place - workouts, nutrition, and progress tracking - is unbeatable.',
    rating: 5
  }
];

const stats = [
  { number: '10K+', label: 'Active Members' },
  { number: '200+', label: 'Expert Trainers' },
  { number: '95%', label: 'Success Rate' },
  { number: '24/7', label: 'Support Available' }
];

export const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Fitness Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of members who've achieved their fitness goals with personalized training, 
              expert nutrition guidance, and comprehensive progress tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                to="/pricing"
                className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 flex items-center space-x-2 shadow-xl"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                </div>
                <span className="text-lg">Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-300/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-orange-300/20 rounded-full blur-xl"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and support you need 
              to achieve your fitness goals and maintain a healthy lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <feature.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Simple Steps to Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started with FitHub is easy. Follow these simple steps to begin your transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Choose Your Plan',
                description: 'Select a membership plan that fits your goals and budget. All plans include access to expert trainers.',
                icon: Target
              },
              {
                step: '02',
                title: 'Get Matched',
                description: 'Our system pairs you with a certified trainer who specializes in your fitness goals and preferences.',
                icon: Users
              },
              {
                step: '03',
                title: 'Start Training',
                description: 'Begin your personalized workout and nutrition plan while tracking your progress every step of the way.',
                icon: Award
              }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-900">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">
              Success Stories
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Hear from our members who have transformed their lives with FitHub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20"
              >
                <div className="flex space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-blue-200 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of members who have already started their fitness transformation. 
              Your journey to a healthier, stronger you begins today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                to="/pricing"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl"
              >
                Get Started Today
              </Link>
              <Link
                to="/login"
                className="border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors"
              >
                Already a Member?
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};