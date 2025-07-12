import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../../context/auth/authContext';
import ItemContext from '../../context/item/itemContext';
import SwapContext from '../../context/swap/swapContext';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const itemContext = useContext(ItemContext);
  const swapContext = useContext(SwapContext);

  const { user, isAuthenticated } = authContext;
  const { getItem, item, loading, error, clearErrors } = itemContext;
  const { createSwap } = swapContext;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapType, setSwapType] = useState('item'); // 'item' or 'points'
  const [selectedItem, setSelectedItem] = useState('');
  const [pointsAmount, setPointsAmount] = useState(0);
  const [userItems, setUserItems] = useState([]);

  useEffect(() => {
    getItem(id);

    // Get user's items for swap options
    if (isAuthenticated && user) {
      itemContext.getUserItems().then(items => {
        // Filter out the current item and items that are not approved
        const availableItems = items.filter(
          item => item._id !== id && item.status === 'approved'
        );
        setUserItems(availableItems);
      });
    }

    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line
  }, [id, isAuthenticated, user]);

  const nextImage = () => {
    if (item && item.images && item.images.length > 0) {
      setCurrentImageIndex((currentImageIndex + 1) % item.images.length);
    }
  };

  const prevImage = () => {
    if (item && item.images && item.images.length > 0) {
      setCurrentImageIndex(
        (currentImageIndex - 1 + item.images.length) % item.images.length
      );
    }
  };

  const openSwapModal = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to request a swap');
      navigate('/login');
      return;
    }

    // Check if this is the user's own item
    if (item && user && item.user === user._id) {
      toast.error('You cannot swap your own item');
      return;
    }

    setShowSwapModal(true);
  };

  const handleSwapSubmit = e => {
    e.preventDefault();

    if (swapType === 'item' && !selectedItem) {
      toast.error('Please select an item to swap');
      return;
    }

    if (swapType === 'points' && (!pointsAmount || pointsAmount <= 0)) {
      toast.error('Please enter a valid points amount');
      return;
    }

    // Check if user has enough points
    if (swapType === 'points' && user.points < pointsAmount) {
      toast.error(`You don't have enough points. Your balance: ${user.points}`);
      return;
    }

    const swapData = {
      requestedItem: id,
      isPointsSwap: swapType === 'points',
      pointsAmount: swapType === 'points' ? pointsAmount : 0,
      offeredItem: swapType === 'item' ? selectedItem : null
    };

    createSwap(swapData);
    setShowSwapModal(false);
    toast.success('Swap request sent!');
  };

  if (loading || !item) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:flex md:items-start">
        {/* Image Gallery */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-w-1 aspect-h-1">
            {item.images && item.images.length > 0 ? (
              <>
                <img
                  src={item.images[currentImageIndex]}
                  alt={item.title}
                  className="w-full h-full object-center object-cover"
                />
                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 focus:outline-none hover:bg-opacity-75"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 focus:outline-none hover:bg-opacity-75"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-200">
                <svg
                  className="h-12 w-12 text-gray-400"
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

          {/* Thumbnail Gallery */}
          {item.images && item.images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative rounded-md overflow-hidden ${index === currentImageIndex ? 'ring-2 ring-primary-500' : ''}`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="md:w-1/2 md:pl-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {item.pointValue} Points
              </span>
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {item.category}
              </span>
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {item.condition}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-gray-600">{item.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Size</h2>
              <p className="mt-1 text-gray-900">{item.size}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Gender</h2>
              <p className="mt-1 text-gray-900">{item.gender}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Brand</h2>
              <p className="mt-1 text-gray-900">{item.brand || 'Not specified'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Listed</h2>
              <p className="mt-1 text-gray-900">{new Date(item.date).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <button
              onClick={openSwapModal}
              className="flex-1 bg-primary-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Request Swap
            </button>
            <Link
              to="/browse"
              className="flex-1 bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Browse
            </Link>
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Request Swap</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      You're requesting to swap for: <strong>{item.title}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex justify-center space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setSwapType('item')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${swapType === 'item' ? 'bg-primary-100 text-primary-800' : 'bg-white text-gray-700 border border-gray-300'}`}
                  >
                    Swap with Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setSwapType('points')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${swapType === 'points' ? 'bg-primary-100 text-primary-800' : 'bg-white text-gray-700 border border-gray-300'}`}
                  >
                    Use Points
                  </button>
                </div>

                <form onSubmit={handleSwapSubmit}>
                  {swapType === 'item' ? (
                    <div>
                      <label htmlFor="item" className="block text-sm font-medium text-gray-700">
                        Select an item to offer
                      </label>
                      <select
                        id="item"
                        name="item"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        value={selectedItem}
                        onChange={e => setSelectedItem(e.target.value)}
                      >
                        <option value="">Select an item</option>
                        {userItems.map(item => (
                          <option key={item._id} value={item._id}>
                            {item.title} ({item.pointValue} points)
                          </option>
                        ))}
                      </select>
                      {userItems.length === 0 && (
                        <p className="mt-2 text-sm text-red-600">
                          You don't have any approved items to swap. Please add and get items approved first.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="points" className="block text-sm font-medium text-gray-700">
                        Points to offer (Your balance: {user ? user.points : 0})
                      </label>
                      <input
                        type="number"
                        name="points"
                        id="points"
                        min="1"
                        max={user ? user.points : 0}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={pointsAmount}
                        onChange={e => setPointsAmount(parseInt(e.target.value, 10))}
                      />
                    </div>
                  )}

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                    >
                      Request Swap
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => setShowSwapModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;