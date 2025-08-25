'use client';

import { useState } from 'react';
import AccountSecurity from './AccountSecurity';
import BillingSettings from './BillingSettings';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account & Security' },
    { id: 'billing', label: 'Billing Settings' },
  ];

  return (
    <div className="w-full p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Profile</h1>
      <div className="bg-white border border-orange-200 rounded-xl p-4 sm:p-6 flex flex-col lg:flex-row gap-6 lg:gap-8 shadow-sm">
        <aside className="w-full lg:w-1/4 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 pr-4 border-r border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200 whitespace-nowrap text-sm ${ 
                activeTab === tab.id
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-500 hover:text-gray-800'
              }`}>
              {tab.label}
            </button>
          ))}
        </aside>
        <main className="w-full lg:w-3/4">
          {activeTab === 'account' && <AccountSecurity />}
          {activeTab === 'billing' && <BillingSettings />}
        </main>
      </div>
    </div>
  );
};

export default AccountSettings;
