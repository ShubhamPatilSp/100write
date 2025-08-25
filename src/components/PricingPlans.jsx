'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PRICING_PLANS } from '@/lib/dodopay';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const PricingPlans = () => {
  const [billingInterval, setBillingInterval] = useState('yearly'); // 'monthly' or 'yearly'
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const plans = {
    free: {
      ...PRICING_PLANS.FREE,
      name: 'Free',
      description: 'The flexible option for individuals who want to try our AI tools.',
      price: { monthly: 0, yearly: 0 },
      buttonText: 'Start Free Trial',
      isPopular: false,
    },
    pro: {
      ...PRICING_PLANS.PRO_MONTHLY, // Base features from monthly
      name: 'Pro',
      description: 'The all-in-one plan for high-achievers aiming to supercharge their writing skills.',
      price: {
        monthly: PRICING_PLANS.PRO_MONTHLY.price,
        yearly: (PRICING_PLANS.PRO_YEARLY.price / 12).toFixed(2), // Assuming yearly price is for 12 months
      },
      features: [
        ...PRICING_PLANS.PRO_MONTHLY.features,
        '2 months free',
      ],
      buttonText: 'Upgrade Plan',
      isPopular: true,
    },
  };

  const handleSelectPlan = async (planName) => {
    if (!session && planName !== 'Free') {
      router.push('/login');
      return;
    }
    if (planName === 'Free') {
      router.push('/signup');
      return;
    }

    setIsLoading(true);
    const planId = billingInterval === 'yearly' ? PRICING_PLANS.PRO_YEARLY.id : PRICING_PLANS.PRO_MONTHLY.id;

    const handleCheckout = (planId) => {
      setIsLoading(true);
      const plan = Object.values(PRICING_PLANS).find(p => p.id === planId);
      if (plan && plan.paymentLink) {
        window.location.href = plan.paymentLink;
      } else {
        alert('Payment link for this plan is not available.');
        setIsLoading(false);
      }
    };

    handleCheckout(planId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="bg-black text-white text-sm font-semibold px-4 py-1 rounded-full">Pricing</span>
        <h2 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
          Select a plan that works for you
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Gain access to all of our tools and features for a low monthly or annual price. No hidden fees. Cancel anytime.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <div className="flex items-center space-x-4">
          <span className={`font-semibold ${billingInterval === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>Pay Monthly</span>
          <label htmlFor="billing-toggle" className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="billing-toggle" className="sr-only peer" checked={billingInterval === 'yearly'} onChange={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')} />
            <div className="w-14 h-8 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
          <span className={`font-semibold ${billingInterval === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>Pay Yearly</span>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Save 50%</span>
        </div>
        <div className="mt-4 flex space-x-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" className="h-6" />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {Object.values(plans).map((plan) => (
          <div key={plan.name} className={`bg-white rounded-2xl p-8 ${plan.isPopular ? 'border-2 border-orange-500' : 'border border-gray-200'}`}>
            <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
            <p className="mt-2 text-gray-600">{plan.description}</p>
            
            {plan.isPopular && (
                <div className="flex items-center mt-4">
                    <div className="flex -space-x-2 mr-2">
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e586910b323f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                    </div>
                    <div>
                        <div className="flex text-yellow-400">★★★★★</div>
                        <p className="text-sm text-gray-500">Trusted by 5,000,000+ writers</p>
                    </div>
                </div>
            )}

            <div className="mt-6 flex items-baseline">
              {plan.price[billingInterval] > 0 && billingInterval === 'yearly' && (
                <span className="text-3xl font-bold text-gray-400 line-through mr-2">${plan.price['monthly']}</span>
              )}
              <span className="text-5xl font-bold text-gray-900">${plan.price[billingInterval]}</span>
              <span className="ml-1 text-gray-600">/ Month</span>
            </div>

            <button 
              onClick={() => handleSelectPlan(plan.name)}
              disabled={isLoading}
              className={`w-full mt-6 py-3 rounded-lg font-semibold ${plan.isPopular ? 'bg-orange-500 text-white hover:bg-orange-600' : 'border border-orange-500 text-orange-500 hover:bg-orange-50'}`}>
              {isLoading && plan.name !== 'Free' ? 'Processing...' : plan.buttonText}
            </button>

            <ul className="mt-8 space-y-4">
              {plan.features.map((feature, index) => (
                <li key={index} className={`flex items-center ${feature.includes('Advanced') ? 'bg-orange-100 p-2 rounded-md' : ''}`}>
                  <CheckIcon />
                  <span className="ml-3 text-gray-800">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
