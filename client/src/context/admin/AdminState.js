import React, { useReducer } from 'react';
import axios from 'axios';
import AdminContext from './adminContext';
import adminReducer from './adminReducer';
import {
  GET_USERS,
  UPDATE_USER_ROLE,
  DELETE_USER,
  ADMIN_ERROR,
  CLEAR_ERRORS
} from '../types';

const AdminState = props => {
  const initialState = {
    users: null,
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Get all users
  const getUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');

      dispatch({
        type: GET_USERS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ADMIN_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  // Update user role
  const updateUserRole = async (userId, role) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(
        `/api/admin/users/${userId}`,
        { role },
        config
      );

      dispatch({
        type: UPDATE_USER_ROLE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ADMIN_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  // Delete user
  const deleteUser = async userId => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);

      dispatch({
        type: DELETE_USER,
        payload: userId
      });
    } catch (err) {
      dispatch({
        type: ADMIN_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AdminContext.Provider
      value={{
        users: state.users,
        error: state.error,
        loading: state.loading,
        getUsers,
        updateUserRole,
        deleteUser,
        clearErrors
      }}
    >
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminState;