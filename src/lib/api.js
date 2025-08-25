async function fetchAPI(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export const getUserProfile = () => fetchAPI('/api/account/profile');

export const updateUserProfile = (data) => fetchAPI('/api/account/profile', {
  method: 'PATCH',
  body: JSON.stringify(data),
});

export const getActiveSessions = () => fetchAPI('/api/account/sessions');

export const deleteSession = (sessionId) => fetchAPI('/api/account/sessions', {
  method: 'DELETE',
  body: JSON.stringify({ sessionId }),
});

// Billing and subscription functions remain for now
export const getSubscription = () => fetchAPI('/api/subscription/status');

export const createPaymentSession = (planId) => fetchAPI('/api/payments/create-session', {
  method: 'POST',
  body: JSON.stringify({ planId }),
});

export const cancelSubscription = () => fetchAPI('/api/payments/cancel-subscription', {
  method: 'POST',
});

export const getBillingHistory = async () => {
    // This is still a mock, will be implemented later if needed.
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { id: 1, date: '2023-10-01', description: 'Pro Plan', amount: 99.99, status: 'Paid' },
        { id: 2, date: '2023-09-01', description: 'Pro Plan', amount: 99.99, status: 'Paid' },
    ];
};

