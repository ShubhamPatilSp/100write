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
    <div className="w-full p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">Account Settings</h1>
      <div className="bg-white border-2 border-orange-500 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-1/4 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left font-semibold px-4 py-3 rounded-lg transition-colors duration-200 whitespace-nowrap ${ 
                activeTab === tab.id
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {tab.label}
            </button>
          ))}
        </aside>
        <main className="w-full md:w-3/4 md:pl-6">
          {activeTab === 'account' && <AccountSecurity />}
          {activeTab === 'billing' && <BillingSettings />}
        </main>
      </div>
    </div>
  );
};

export default AccountSettings;
