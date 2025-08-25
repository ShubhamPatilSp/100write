'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'react-hot-toast';
import { getUserProfile, updateUserProfile, getActiveSessions, deleteSession } from '@/lib/api';
import { FiInfo, FiTrash2 } from 'react-icons/fi';
import { flag } from 'country-emoji';
import { UAParser } from 'ua-parser-js';

export default function AccountSecurity() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', provider: '' });
  const [activeSessions, setActiveSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = useCallback(async (initialLoad = false) => {
    if (initialLoad) setIsLoading(true);
    try {
      const [userProfile, sessions] = await Promise.all([getUserProfile(), getActiveSessions()]);
      setProfile(userProfile);
      setActiveSessions(sessions);
    } catch (err) {
      toast.error('Failed to refresh session data.');
    } finally {
      if (initialLoad) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true); // Initial fetch with loading state
    const intervalId = setInterval(() => fetchData(false), 10000); // Poll every 10 seconds without loading state

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchData]);

  const getInitials = () => {
    const { firstName, lastName } = profile;
    return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Saving changes...');
    try {
      const updatedUser = await updateUserProfile({ firstName: profile.firstName, lastName: profile.lastName });
      setProfile(updatedUser);
      await update({ user: { name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim() } });
      toast.success('Changes saved successfully!', { id: toastId });
    } catch (err) {
      toast.error('Failed to save changes.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    const originalSessions = [...activeSessions];
    setActiveSessions((prev) => prev.filter((s) => s._id !== sessionId));
    try {
      await deleteSession(sessionId);
      toast.success('Session deleted!');
    } catch (error) {
      setActiveSessions(originalSessions);
      toast.error('Failed to delete session.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Personal Information */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
          PERSONAL INFORMATION
        </h2>
        <p className="text-sm text-gray-600 mb-8">
          This information is private and only viewable by you.
        </p>

        <div className="flex items-start gap-8">
          {/* Form Fields */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-gray-900"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={profile.email || ''}
                disabled
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Profile Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
              {getInitials() || 'SP'}
            </div>
            <p className="text-sm text-gray-500">Managed by {profile.provider}</p>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          SECURITY
        </h2>
        <div className="flex items-start gap-3">
          <FiInfo className="text-orange-600 mt-0.5 flex-shrink-0" size={16} />
          <p className="text-sm text-orange-600">
            You are currently registered with {profile.provider}. To change your password, please visit your {profile.provider} settings.
          </p>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          ACTIVE SESSIONS
        </h2>
        <div className="bg-orange-50/30 border border-orange-200/50 rounded-xl shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-orange-200/60">
                <th className="text-left font-semibold text-gray-800 p-4">Device</th>
                <th className="text-left font-semibold text-gray-800 p-4">Location</th>
                <th className="text-left font-semibold text-gray-800 p-4">Expiration</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {activeSessions.map((s) => (
                <tr key={s._id} className="border-b border-orange-200/60 last:border-b-0">
                  <td className="p-4 text-gray-600">
                    {(() => {
                      const parser = UAParser(s.device);
                      const browser = parser.browser;
                      const os = parser.os;
                      return `${browser.name} on ${os.name}`;
                    })()}
                    {session?.user?.sessionToken === s.sessionToken && (
                      <span className="text-gray-400 ml-2">(current)</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-600 flex items-center gap-3">
                    {s.countryCode && <span className="text-lg">{flag(s.countryCode)}</span>}
                    {s.city && s.country ? `${s.city}, ${s.country}` : 'Unknown Location'}
                  </td>
                  <td className="p-4 text-gray-600">{new Date(s.expires).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteSession(s._id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiTrash2 />
                      Delete Session
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 mt-8">
        <button
          onClick={() => fetchData()}
          className="px-7 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 font-semibold hover:bg-gray-50 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="px-7 py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </>
  );
}