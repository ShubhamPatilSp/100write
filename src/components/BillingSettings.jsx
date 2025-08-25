'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import ProgressBar from './ProgressBar';

const SectionTitle = ({ children }) => (
  <h3 className="text-xs font-bold tracking-wider text-gray-500 mb-2 uppercase">{children}</h3>
);

const BillingHistoryTable = ({ history }) => {
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="hidden sm:grid grid-cols-12 px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
        <div className="col-span-3">Invoice</div>
        <div className="col-span-3">Amount</div>
        <div className="col-span-3">Date</div>
        <div className="col-span-3">Status</div>
      </div>
      <div className="divide-y divide-gray-200">
        {history && history.length > 0 ? (
          history.map((item) => (
            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 items-center px-4 py-3">
              <div className="sm:col-span-3 text-sm font-medium text-gray-800 mb-1 sm:mb-0">{item.invoice_number}</div>
              <div className="sm:col-span-3 text-sm text-gray-600 mb-1 sm:mb-0">{formatCurrency(item.amount, item.currency)}</div>
              <div className="sm:col-span-3 text-sm text-gray-600 mb-1 sm:mb-0">{new Date(item.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
              <div className="sm:col-span-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${item.status === 'paid' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'}`}>{item.status}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 px-4 text-sm text-gray-500">Showing 0 to 0 of 0 results</div>
        )}
      </div>
      <div className="flex justify-end items-center px-4 py-3 bg-gray-50 rounded-b-lg">
        <button className="px-3 py-1.5 border rounded-md text-sm font-semibold hover:bg-gray-100 disabled:opacity-50 mr-2" disabled>Previous</button>
        <button className="px-3 py-1.5 border rounded-md text-sm font-semibold hover:bg-gray-100 disabled:opacity-50" disabled>Next</button>
      </div>
    </div>
  );
};

const FreePlanView = ({ subscription, handleCreateSession, isProcessing }) => {
  const wordsUsed = subscription?.usage?.words || 0;
  const wordsLimit = subscription?.limits?.words || 300;

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white rounded-full border-4 border-gray-100">
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
            className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 whitespace-nowrap text-sm"
          >
            {isProcessing ? 'Processing...' : 'Upgrade Plan'}
          </button>
          <span className="text-sm text-orange-600 font-semibold whitespace-nowrap text-center sm:text-left">Starting at just $7/mo</span>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800">Free Plan - {wordsLimit} Words</h4>
        <p className="text-sm text-gray-500 mb-3">Your words are limited to {wordsLimit} words per account. Upgrade to a paid plan to unlock more words.</p>
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
  const planName = subscription?.planId === 'pro_yearly' ? 'Pro Unlimited Annual Plan' : 'Pro Unlimited Monthly Plan';
  const renewalDate = subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
  const price = subscription?.planId === 'pro_yearly' ? '$152/year' : '$12/month';

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h4 className="font-semibold text-gray-800">Your Current Plan</h4>
          <button
            onClick={() => setShowCancelConfirm(true)}
            disabled={isProcessing || subscription?.cancelAtPeriodEnd}
            className="px-3 py-1 text-sm font-semibold text-red-600 bg-transparent border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {subscription?.cancelAtPeriodEnd ? 'Cancellation Pending' : 'Cancel Subscription'}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 gap-3">
          <div className="flex items-center gap-3">
            <FaStar className="text-yellow-400" size={20} />
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

      {subscription?.planId === 'pro_monthly' && (
        <div className="bg-orange-500 text-white rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h4 className="text-xl font-bold">Upgrade to Annual Plan</h4>
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
              className="bg-white text-orange-600 font-semibold px-6 py-2.5 rounded-lg hover:bg-orange-50 disabled:opacity-50 whitespace-nowrap text-sm"
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
      const [subRes, historyRes] = await Promise.all([
        fetch('/api/subscription/status'),
        fetch('/api/subscription/billing-history'),
      ]);

      if (!subRes.ok) throw new Error('Failed to fetch subscription');
      const subData = await subRes.json();
      setSubscription(subData.subscription);

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setBillingHistory(historyData.invoices || []);
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
      const res = await fetch('/api/payments/cancel-subscription', { method: 'POST' });
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
    <div className="space-y-8 font-sans">
      <section>
        <h2 className="text-xl font-bold text-gray-900">Billing Info & Settings</h2>
        <p className="text-sm text-gray-500 mt-1">This information is private and only viewable by you.</p>
      </section>

      <section>
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
      </section>

      <section>
        <SectionTitle>Billing History</SectionTitle>
        <BillingHistoryTable history={billingHistory} />
      </section>

      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Cancellation</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to cancel? This will downgrade you to the Free Plan at the end of your current billing period.</p>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button onClick={() => setShowCancelConfirm(false)} disabled={isProcessing} className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 text-sm">No, Keep It</button>
              <button onClick={handleConfirmCancel} disabled={isProcessing} className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm">
                {isProcessing ? 'Processing...' : 'Cancel Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
