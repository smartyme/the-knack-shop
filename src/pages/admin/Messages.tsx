import React, { useState } from 'react';
import { format } from 'date-fns';
import { Mail, Trash2, Eye, EyeOff } from 'lucide-react';
import { useContactMessages } from '../../hooks/useContactMessages';
import Breadcrumb from '../../components/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Modal from '../../components/Modal';

export default function Messages() {
  const { messages, loading, error, markAsRead, deleteMessage } = useContactMessages();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Messages' }
  ];

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    const { error } = await deleteMessage(id);
    if (error) {
      alert('Failed to delete message');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    const { error } = await markAsRead(id);
    if (error) {
      alert('Failed to mark message as read');
    }
  };

  const viewMessage = (id: string) => {
    setSelectedMessage(id);
    setShowModal(true);
    if (!messages.find(m => m.id === id)?.read) {
      handleMarkAsRead(id);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const selectedMessageData = messages.find(m => m.id === selectedMessage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex justify-between items-center mt-4">
          <div>
            <h1 className="text-3xl font-bold">Contact Messages</h1>
            <p className="mt-2 text-gray-600">
              Manage messages from the contact form
            </p>
          </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Mail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
          <p className="mt-1 text-sm text-gray-500">
            No contact form messages have been received yet.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.map((message) => (
                <tr 
                  key={message.id}
                  className={message.read ? 'bg-white' : 'bg-blue-50'}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {message.read ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Read
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {message.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {message.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(message.created_at), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => viewMessage(message.id)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                      title="View message"
                    >
                      {message.read ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete message"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedMessage(null);
        }}
        title="Message Details"
      >
        {selectedMessageData && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">From</h3>
              <p className="mt-1">{selectedMessageData.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1">{selectedMessageData.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Message</h3>
              <p className="mt-1 whitespace-pre-wrap">{selectedMessageData.message}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sent</h3>
              <p className="mt-1">
                {format(new Date(selectedMessageData.created_at), 'PPpp')}
              </p>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedMessage(null);
                }}
                className="btn"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}