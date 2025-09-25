import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Star, Crown, Zap } from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    duration: 1,
    icon: Zap,
    features: [
      'Access to workout library',
      'Basic nutrition guidelines',
      'Progress tracking',
      'Mobile app access',
      'Community support'
    ],
    popular: false,
    color: 'from-gray-600 to-gray-800'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79,
    duration: 1,
    icon: Star,
    features: [
      'Personal trainer assignment',
      'Custom workout plans',
      'Personalized nutrition plans',
      'Weekly check-ins',
      'Progress photo analysis',
      'Priority support',
      'Meal planning tools'
    ],
    popular: true,
    color: 'from-blue-600 to-purple-600'
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 149,
    duration: 1,
    icon: Crown,
    features: [
      'Dedicated personal trainer',
      'Daily check-ins',
      'Custom meal prep plans',
      'Supplement recommendations',
      '1-on-1 video sessions',
      'Advanced analytics',
      '24/7 trainer chat support',
      'Monthly fitness assessments'
    ],
    popular: false,
    color: 'from-yellow-600 to-orange-600'
  }
];

const testimonials = [
  {
    plan: 'Premium',
    name: 'Jessica Miller',
    avatar: 'https://images.pexels.com/photos/1036620/pexels-photo-1036620.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'The Premium plan gave me exactly what I needed - personalized guidance without breaking the bank.',
    result: 'Lost 25 lbs in 4 months'
  },
  {
    plan: 'Elite',
    name: 'Mark Thompson',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Elite plan transformed my life completely. The daily support and custom plans made all the difference.',
    result: 'Gained 15 lbs muscle in 6 months'
  }
];

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your current billing period.'
  },
  {
    question: 'Do I get a personal trainer with all plans?',
    answer: 'Personal trainers are included with Premium and Elite plans. Basic plan members have access to our trainer community and general guidance.'
  },
  {
    question: 'Is there a money-back guarantee?',
    answer: 'We offer a 30-day money-back guarantee for all plans. If you\'re not satisfied, we\'ll refund your money, no questions asked.'
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle.'
  }
];

export const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const getPrice = (price) => {
    if (billingCycle === 'yearly') {
      return Math.round(price * 10); // 2 months free
    }
    return price;
  };

  const getDiscount = () => {
    if (billingCycle === 'yearly') {
      return '2 months free';
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Start your fitness transformation with a plan that fits your goals and budget. 
            All plans include our money-back guarantee.
          </p>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all relative ${
                    billingCycle === 'yearly'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  plan.popular ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-4xl font-bold text-gray-900">
                          ${getPrice(plan.price)}
                        </span>
                        <span className="text-gray-600">
                          /{billingCycle === 'yearly' ? 'year' : 'month'}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <div className="text-green-600 text-sm font-medium">
                          {getDiscount()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    to="/register"
                    className={`w-full block text-center py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real Members
            </h2>
            <p className="text-xl text-gray-600">
              See what our members have achieved with their chosen plans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                    <span className="text-blue-600 font-medium">{testimonial.plan} Plan</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div className="text-green-600 font-semibold">{testimonial.result}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our plans and services
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  <span className={`text-2xl transition-transform ${
                    openFaqIndex === index ? 'rotate-45' : ''
                  }`}>
                    +
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="px-8 pb-6">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Transformation?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of members who have already achieved their fitness goals with FitHub.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-xl"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
};