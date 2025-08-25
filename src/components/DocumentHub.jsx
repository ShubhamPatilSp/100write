'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ConfirmationModal from './ConfirmationModal';

const DocumentHub = () => {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const router = useRouter();
  const menuRef = useRef(null);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      } else {
        setError('Failed to fetch documents.');
      }
    } catch (err) {
      setError('An error occurred while fetching documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openConfirmationModal = (id) => {
    setDocToDelete(id);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!docToDelete) return;

    try {
      const res = await fetch('/api/documents', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: docToDelete }),
      });

      if (res.ok) {
        setDocuments(documents.filter((doc) => doc._id !== docToDelete));
      } else {
        alert('Failed to delete document.');
      }
    } catch (err) {
      alert('An error occurred while deleting the document.');
    } finally {
      setIsModalOpen(false);
      setDocToDelete(null);
    }
  };

  const getFirstName = () => {
    if (session?.user?.name) {
      return session.user.name.split(' ')[0];
    }
    return 'User';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-4 md:p-10">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-gray-900 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading Documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 md:p-10 text-red-500">{error}</div>;
  }

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
      />
      <main className="p-4 md:p-10">
        <header className="mb-8">
          <p className="text-orange-500 font-semibold">Document Hub</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Hey {getFirstName()},</h1>
          <p className="text-base md:text-lg text-gray-600">Find all your documents here</p>
        </header>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold">Documents</h2>
              <span className="bg-gray-200 text-gray-800 text-sm font-bold px-3 py-1 rounded-full">
                {documents.length}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/dashboard/ai-generator" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex-grow text-center md:flex-grow-0">
                Content Generator
              </Link>
              <Link href="/dashboard/ai-humanizer" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex-grow text-center md:flex-grow-0">
                Humanizer
              </Link>
              <button className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 flex-grow text-center md:flex-grow-0">
                Show All
              </button>
            </div>
          </div>

          {documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {documents.map((doc) => (
                <div key={doc._id} className="relative bg-primary-light border border-primary rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-end mb-2">
                      <button onClick={() => setOpenMenuId(openMenuId === doc._id ? null : doc._id)} className="text-gray-500 hover:text-gray-800 p-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      {openMenuId === doc._id && (
                        <div ref={menuRef} className="absolute top-12 right-4 bg-white rounded-md shadow-lg border border-gray-200 z-10 w-32">
                          <button
                            onClick={() => openConfirmationModal(doc._id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="text-center mb-4 -mt-8">
                      <div className="inline-block bg-white p-3 rounded-full">
                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-800 truncate">{doc.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{new Date(doc.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 md:py-16">
              <div className="inline-block bg-gray-100 p-4 rounded-full">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-800">No Files Found</h3>
              <p className="text-gray-500 mt-2">Get started by creating your first file</p>
              <div className="mt-6">
                <Link href="/dashboard/ai-humanizer" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-hover font-body">
                  Humanize a document →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default DocumentHub;
