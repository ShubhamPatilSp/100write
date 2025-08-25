'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'react-hot-toast';
import { getUserProfile, updateUserProfile, getActiveSessions, deleteSession } from '@/lib/api';
import { FiInfo, FiTrash2 } from 'react-icons/fi';

const SectionTitle = ({ children }) => (
  <h2 className="text-xs font-bold tracking-wider text-gray-500 mb-4 uppercase">{children}</h2>
);

export default function AccountSecurity() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', provider: '' });
  const [activeSessions, setActiveSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [userProfile, sessions] = await Promise.all([
        getUserProfile(),
        getActiveSessions(),
      ]);
      setProfile(userProfile);
      setActiveSessions(sessions);
    } catch (err) {
      toast.error('Failed to load account data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getInitials = () => {
    const { firstName, lastName } = profile;
    if (!firstName) return '';
    return `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`.toUpperCase();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Saving changes...');
    try {
      const updatedUser = await updateUserProfile({
        firstName: profile.firstName,
        lastName: profile.lastName
      });
      // Update the local state with the response from the server
      setProfile(updatedUser);
      // Update the session, which is used across the app
      await update({
        ...session,
        user: {
          ...session.user,
          name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
        },
      });
      toast.success('Changes saved successfully!', { id: toastId });
    } catch (err) {
      toast.error('Failed to save changes.', { id: toastId });
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    const previousSessions = activeSessions;
    setActiveSessions((prev) => prev.filter((s) => s._id !== sessionId));
    toast.promise(
      deleteSession(sessionId),
      {
        loading: 'Deleting session...',
        success: 'Session deleted!',
        error: (err) => {
          setActiveSessions(previousSessions);
          return 'Failed to delete session.';
        },
      }
    );
  };

  if (isLoading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="space-y-10 relative">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Personal Information */}
      <div>
        <SectionTitle>Personal Information</SectionTitle>
        <p className="text-sm text-gray-500 mb-6">This information is private and only viewable by you.</p>
        <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-8 md:gap-12">
          <div className="flex-grow space-y-5 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                value={profile.email || ''}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-2 w-full md:w-auto">
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-md">
              {getInitials()}
            </div>
            {profile.provider === 'google' && (
              <p className="text-xs text-gray-500">Managed by Google</p>
            )}
          </div>
        </div>
      </div>

      {/* Security notice */}
      {profile.provider === 'google' && (
        <div>
          <SectionTitle>Security</SectionTitle>
          <div className="flex items-start space-x-3 text-sm text-red-600">
            <FiInfo className="text-red-500 mt-1 flex-shrink-0" size={16} />
            <p>You are currently registered with Google. To change your password, please visit your Google settings.</p>
          </div>
        </div>
      )}

      {/* Active Sessions */}
      <div>
        <SectionTitle>Active Sessions</SectionTitle>
        <div className="border border-gray-200 rounded-lg overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-white">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Device</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiration</th>
                <th className="py-3 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeSessions.length > 0 ? (
                activeSessions.map((s) => (
                  <tr key={s._id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{s.device}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">🇮🇳 {s.location}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{new Date(s.expires).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteSession(s._id)}
                        className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 font-semibold"
                      >
                        <FiTrash2 />
                        <span className="hidden sm:inline">Delete Session</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">No active sessions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
        <button onClick={() => fetchData()} className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 text-sm">
          Cancel
        </button>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 text-sm"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
