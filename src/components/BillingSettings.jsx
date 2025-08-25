'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import ProgressBar from './ProgressBar';

const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-800 mb-4">{children}</h3>
);

const BillingHistoryTable = ({ history }) => (
  <div className="border border-gray-200 rounded-lg overflow-x-auto">
    <table className="min-w-full bg-white">
      <thead>
        <tr className="bg-gray-50">
          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {history && history.length > 0 ? (
          history.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.invoice}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{item.amount}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
              <td className="px-6 py-4 text-sm">
                <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">{item.status}</span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center py-10 text-gray-500">
              <div className="flex justify-between items-center px-6">
                <span>Showing 0 to 0 of 0 results</span>
                <div>
                  <button className="px-4 py-2 border rounded-md text-sm font-semibold hover:bg-gray-100 disabled:opacity-50 mr-2" disabled>Previous</button>
                  <button className="px-4 py-2 border rounded-md text-sm font-semibold hover:bg-gray-100 disabled:opacity-50" disabled>Next</button>
                </div>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const FreePlanView = ({ subscription, handleCreateSession, isProcessing }) => {
  const wordsUsed = subscription?.usage?.words || 0;
  const wordsLimit = subscription?.limits?.words || 300;

  return (
    <div className="space-y-8">
      {/* Current Subscription Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white rounded-full border-4 border-orange-100">
          <FiX className="text-orange-500" size={24} />
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-gray-800">Free Plan</h3>
          <p className="text-sm text-gray-500">You are currently on the free plan with limited features. To unlock more words and features, please upgrade to a paid plan.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => handleCreateSession('pro_monthly')}
            disabled={isProcessing}
            className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 whitespace-nowrap"
          >
            {isProcessing ? 'Processing...' : 'Upgrade Plan'}
          </button>
          <span className="text-sm text-orange-600 font-semibold whitespace-nowrap text-center sm:text-left">Starting at just $7/mo</span>
        </div>
      </div>

      {/* Usage Meter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Free Plan - {wordsLimit} Words</h3>
        <p className="text-sm text-gray-500 mb-4">Your words are limited to {wordsLimit} words per account. Upgrade to a paid plan to unlock more words.</p>
        <ProgressBar 
          value={wordsUsed}
          max={wordsLimit}
          label={`${wordsUsed} of ${wordsLimit} words used`}
        />
      </div>
    </div>
  );
};

const ProPlanView = ({ subscription, handleCreateSession, setShowCancelConfirm, isProcessing }) => {
  const planName = subscription?.planName || 'Pro Plan';
  const renewalDate = subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
  const price = subscription?.planId === 'pro_yearly' ? '$152/year' : '$12/month';

  return (
    <div className="space-y-8">
      {/* Current Subscription Banner */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="font-bold text-gray-800">Your Current Plan</h3>
          <button
            onClick={() => setShowCancelConfirm(true)}
            disabled={isProcessing || subscription?.cancelAtPeriodEnd}
            className="px-3 py-1 text-sm font-semibold text-red-600 bg-transparent border border-red-600 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {subscription?.cancelAtPeriodEnd ? 'Cancellation Pending' : 'Cancel Subscription'}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-2">
          <div className="flex items-center gap-3">
            <FaStar className="text-yellow-500" />
            <span className="font-bold text-gray-800">{planName}</span>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-600">Active plan</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Renews on {renewalDate}
            </span>
            <span className="text-xl font-bold">{price}</span>
          </div>
        </div>
      </div>

      {/* Upgrade to Annual Banner */}
      {subscription?.planId === 'pro_monthly' && (
        <div className="bg-orange-500 text-white rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h4 className="text-lg font-bold">Upgrade to Annual Plan</h4>
            <p className="text-sm opacity-90">Save 60% with annual billing</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 md:mt-0">
            <div className="text-left sm:text-right">
              <p className="text-2xl font-bold">$152<span className="text-base font-normal">/year</span></p>
              <p className="text-sm opacity-90">That is Just $33/mo</p>
            </div>
            <button 
              onClick={() => handleCreateSession('pro_yearly')}
              disabled={isProcessing}
              className="bg-white text-orange-600 font-semibold px-6 py-2 rounded-md hover:bg-orange-100 disabled:opacity-50 whitespace-nowrap"
            >
              {isProcessing ? 'Processing...' : 'Switch To Annual'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function BillingSettings() {
  const { data: session } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchBillingData = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/subscription/status');
      if (!res.ok) throw new Error('Failed to fetch subscription');
      const data = await res.json();
      setSubscription(data.subscription);
      // Mock billing history for pro user based on screenshot
      if (data.subscription?.planId !== 'free') {
        setBillingHistory([
          { id: 1, invoice: '1', amount: '$12.00', date: '25 June 2025', status: 'PAID' }
        ]);
      } else {
        setBillingHistory([]);
      }
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchBillingData();
  }, [fetchBillingData]);

  const handleConfirmCancel = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to cancel subscription');
      const data = await res.json();
      setSubscription(data.subscription);
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateSession = async (planId) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      if (!res.ok) throw new Error('Failed to create session');
      const data = await res.json();
      router.push(data.checkoutUrl);
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="text-center p-10">Loading...</div>;

  const isPro = subscription?.planId !== 'free';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Billing Info & Settings</h2>
        <p className="text-sm text-gray-500">This information is private and only viewable by you.</p>
      </div>

      <SectionTitle>Current Subscription</SectionTitle>
      
      {isPro ? (
        <ProPlanView 
          subscription={subscription}
          handleCreateSession={handleCreateSession}
          setShowCancelConfirm={setShowCancelConfirm}
          isProcessing={isProcessing}
        />
      ) : (
        <FreePlanView 
          subscription={subscription}
          handleCreateSession={handleCreateSession}
          isProcessing={isProcessing}
        />
      )}

      <SectionTitle>Billing History</SectionTitle>
      <BillingHistoryTable history={billingHistory} />

      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Cancellation</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to cancel your subscription? This action will downgrade you to the Free Plan at the end of your current billing period.</p>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button onClick={() => setShowCancelConfirm(false)} disabled={isProcessing} className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50">No, Keep It</button>
              <button onClick={handleConfirmCancel} disabled={isProcessing} className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:opacity-50">
                {isProcessing ? 'Processing...' : 'Cancel Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
