import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import ItemContext from '../../context/item/itemContext';
import ItemCard from '../items/ItemCard';

const Landing = () => {
  const authContext = useContext(AuthContext);
  const itemContext = useContext(ItemContext);
  const { isAuthenticated } = authContext;
  const { items, getItems } = itemContext;
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    getItems();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (items && items.length > 0) {
      // Get random 4 items for featured section
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      setFeaturedItems(shuffled.slice(0, 4));
    }
  }, [items]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover mix-blend-multiply filter brightness-75"
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="People exchanging clothes"
          />
          <div className="absolute inset-0 bg-primary-600 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            ReWear
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Join our community clothing exchange platform. Swap your unused clothes or redeem points for items you love.
          </p>
          <div className="mt-10 flex space-x-4">
            <Link
              to="/browse"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-primary-600"
            >
              Browse Items
            </Link>
            {!isAuthenticated ? (
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-primary-600"
              >
                Join Now
              </Link>
            ) : (
              <Link
                to="/add-item"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-primary-600"
              >
                List an Item
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">
              Sustainable Fashion
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              How It Works
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Join our community and start swapping clothes in just a few simple steps.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">List Your Items</h3>
                <p className="mt-2 text-base text-gray-500">
                  Upload photos and details of clothes you no longer wear. Each approved item earns you points.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Browse & Request</h3>
                <p className="mt-2 text-base text-gray-500">
                  Find items you love and request a swap. You can offer one of your items or use your points.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Swap & Enjoy</h3>
                <p className="mt-2 text-base text-gray-500">
                  Once your request is accepted, arrange the exchange and enjoy your new sustainable wardrobe!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Items Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">
              Discover
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Featured Items
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Check out some of the latest additions to our community exchange.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredItems.length > 0 ? (
              featuredItems.map(item => <ItemCard key={item._id} item={item} />)
            ) : (
              <p className="col-span-full text-center text-gray-500">Loading featured items...</p>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/browse"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Browse All Items
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">
              Testimonials
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              What Our Community Says
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-600 font-bold">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Sarah K.</h4>
                  <p className="text-gray-500">Member since 2023</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I've found so many amazing pieces through ReWear! It's like having a whole new wardrobe without the environmental impact or cost."
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-600 font-bold">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Michael T.</h4>
                  <p className="text-gray-500">Member since 2023</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The points system makes it so easy to get items even when I don't have something specific to swap. Great community too!"
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-600 font-bold">
                  J
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Jessica L.</h4>
                  <p className="text-gray-500">Member since 2023</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I love that I can clear out my closet and find new pieces I actually love. The approval process ensures everything is good quality too."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start swapping?</span>
            <span className="block text-primary-300">Join our community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              {!isAuthenticated ? (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
                >
                  Get Started
                </Link>
              ) : (
                <Link
                  to="/add-item"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
                >
                  Add Your First Item
                </Link>
              )}
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/browse"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;