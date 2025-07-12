import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../../context/auth/authContext';
import SwapContext from '../../context/swap/swapContext';

const SwapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const swapContext = useContext(SwapContext);

  const { user } = authContext;
  const { getSwap, swap, loading, updateSwapStatus, addMessage, error, clearErrors } = swapContext;

  const [message, setMessage] = useState('');

  useEffect(() => {
    getSwap(id);

    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line
  }, [id]);

  const handleStatusUpdate = status => {
    updateSwapStatus(id, status);
    toast.success(`Swap ${status}`);
  };

  const handleMessageSubmit = e => {
    e.preventDefault();
    if (message.trim() === '') {
      toast.error('Message cannot be empty');
      return;
    }
    addMessage(id, message);
    setMessage('');
  };

  if (loading || !swap) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Check if user is part of this swap
  const isUserInvolved =
    user &&
    (swap.requester?._id === user._id || swap.owner?._id === user._id);

  if (!isUserInvolved) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You don't have permission to view this swap.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Link
            to="/dashboard"
            className="text-primary-600 hover:text-primary-900"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isRequester = user && swap.requester && swap.requester._id === user._id;
  const canAcceptReject = !isRequester && swap.status === 'pending';
  const canCancel = isRequester && swap.status === 'pending';
  const canComplete = swap.status === 'accepted';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Swap Details
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Swap ID: {swap._id}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Swap Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Current Status:{' '}
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                swap.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : swap.status === 'accepted'
                  ? 'bg-green-100 text-green-800'
                  : swap.status === 'completed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
            </span>
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Requester</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {swap.requester ? swap.requester.name : 'Unknown'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Owner</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {swap.owner ? swap.owner.name : 'Unknown'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Swap Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {swap.isPointsSwap ? 'Points Swap' : 'Item Swap'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {swap.isPointsSwap ? 'Points Offered' : 'Item Offered'}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {swap.isPointsSwap ? (
                  `${swap.pointsAmount} Points`
                ) : swap.offeredItem ? (
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {swap.offeredItem.images && swap.offeredItem.images.length > 0 ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={swap.offeredItem.images[0]}
                          alt={swap.offeredItem.title}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        <Link
                          to={`/items/${swap.offeredItem._id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {swap.offeredItem.title}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">
                        {swap.offeredItem.category} • {swap.offeredItem.condition}
                      </div>
                    </div>
                  </div>
                ) : (
                  'N/A'
                )}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Item Requested</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {swap.requestedItem ? (
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {swap.requestedItem.images && swap.requestedItem.images.length > 0 ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={swap.requestedItem.images[0]}
                          alt={swap.requestedItem.title}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        <Link
                          to={`/items/${swap.requestedItem._id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {swap.requestedItem.title}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">
                        {swap.requestedItem.category} • {swap.requestedItem.condition}
                      </div>
                    </div>
                  </div>
                ) : (
                  'N/A'
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date Requested</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(swap.date).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>

        {/* Action Buttons */}
        {(canAcceptReject || canCancel || canComplete) && (
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              {canAcceptReject && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('accepted')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Accept Swap
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Reject Swap
                  </button>
                </>
              )}
              {canCancel && (
                <button
                  onClick={() => handleStatusUpdate('cancelled')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel Request
                </button>
              )}
              {canComplete && (
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        )}

        {/* Messages Section */}
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Messages
          </h3>

          <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
            {swap.messages && swap.messages.length > 0 ? (
              <div className="space-y-4">
                {swap.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-lg px-4 py-2 ${msg.sender === user._id ? 'bg-primary-100 text-primary-800' : 'bg-gray-200 text-gray-800'}`}
                    >
                      <div className="text-sm">{msg.text}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(msg.date).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No messages yet.</p>
            )}
          </div>

          {/* Message Input */}
          {swap.status !== 'rejected' && swap.status !== 'cancelled' && (
            <form onSubmit={handleMessageSubmit} className="mt-4">
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Send
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapDetail;