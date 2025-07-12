import React, { useContext, useEffect, useState } from 'react';
import ItemContext from '../../context/item/itemContext';
import ItemCard from './ItemCard';

const Browse = () => {
  const itemContext = useContext(ItemContext);
  const { items, getItems, loading } = itemContext;

  const [filteredItems, setFilteredItems] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    size: '',
    condition: '',
    searchTerm: ''
  });

  useEffect(() => {
    getItems();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (items) {
      applyFilters();
    }
    // eslint-disable-next-line
  }, [items, filters]);

  const applyFilters = () => {
    let filtered = [...items];

    // Only show approved items
    filtered = filtered.filter(item => item.status === 'approved');

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Apply gender filter
    if (filters.gender) {
      filtered = filtered.filter(item => item.gender === filters.gender);
    }

    // Apply size filter
    if (filters.size) {
      filtered = filtered.filter(item => item.size === filters.size);
    }

    // Apply condition filter
    if (filters.condition) {
      filtered = filtered.filter(item => item.condition === filters.condition);
    }

    // Apply search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          (item.brand && item.brand.toLowerCase().includes(searchLower))
      );
    }

    setFilteredItems(filtered);
  };

  const handleFilterChange = e => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      gender: '',
      size: '',
      condition: '',
      searchTerm: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Browse Items
          </h2>
          <p className="mt-1 text-gray-500">
            Find clothing items to swap or redeem with your points.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">
                  Search
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="searchTerm"
                    id="searchTerm"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search by title, description..."
                    value={filters.searchTerm}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Activewear">Activewear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={filters.gender}
                  onChange={handleFilterChange}
                >
                  <option value="">All Genders</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                  Size
                </label>
                <select
                  id="size"
                  name="size"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={filters.size}
                  onChange={handleFilterChange}
                >
                  <option value="">All Sizes</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                  Condition
                </label>
                <select
                  id="condition"
                  name="condition"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={filters.condition}
                  onChange={handleFilterChange}
                >
                  <option value="">All Conditions</option>
                  <option value="New with tags">New with tags</option>
                  <option value="Like new">Like new</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map(item => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or check back later for new items.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;