import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import Landing from './components/pages/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ItemDetail from './components/items/ItemDetail';
import AddItem from './components/items/AddItem';
import Browse from './components/items/Browse';
import SwapDetail from './components/swaps/SwapDetail';
import AdminPanel from './components/admin/AdminPanel';
import NotFound from './components/pages/NotFound';

// Auth & Private Route
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Context
import AuthState from './context/auth/AuthState';
import ItemState from './context/item/ItemState';
import SwapState from './context/swap/SwapState';
import AdminState from './context/admin/AdminState';

const App = () => {
  return (
    <AuthState>
      <ItemState>
        <SwapState>
          <AdminState>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/items/:id" element={<ItemDetail />} />
                  
                  {/* Private Routes */}
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/add-item" element={<PrivateRoute><AddItem /></PrivateRoute>} />
                  <Route path="/swaps/:id" element={<PrivateRoute><SwapDetail /></PrivateRoute>} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </AdminState>
        </SwapState>
      </ItemState>
    </AuthState>
  );
};

export default App;