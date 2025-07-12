import React, { useReducer } from 'react';
import axios from 'axios';
import ItemContext from './itemContext';
import itemReducer from './itemReducer';
import {
  GET_ITEMS,
  GET_USER_ITEMS,
  GET_ITEM,
  ADD_ITEM,
  UPDATE_ITEM,
  DELETE_ITEM,
  FILTER_ITEMS,
  CLEAR_FILTER,
  ITEM_ERROR,
  CLEAR_ERRORS
} from '../types';

const ItemState = props => {
  const initialState = {
    items: [],
    userItems: [],
    item: null,
    filtered: null,
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(itemReducer, initialState);

  // Get all items
  const getItems = async () => {
    try {
      const res = await axios.get('/api/items');

      dispatch({
        type: GET_ITEMS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ITEM_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  // Get user's items
  const getUserItems = async () => {
    try {
      const res = await axios.get('/api/items/user');

      dispatch({
        type: GET_USER_ITEMS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ITEM_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  // Get a specific item
  const getItem = async id => {
    try {
      const res = await axios.get(`/api/items/${id}`);

      dispatch({
        type: GET_ITEM,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ITEM_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  // Add a new item
  const addItem = async formData => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      const res = await axios.post('/api/items', formData, config);

      dispatch({
        type: ADD_ITEM,
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: ITEM_ERROR,
        payload: err.response.data.msg
      });
      throw err;
    }
  };

  // Update an item
  const updateItem = async (id, formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      const res = await axios.put(`/api/items/${id}`, formData, config);

      dispatch({
        type: UPDATE_ITEM,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ITEM_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  // Delete an item
  const deleteItem = async id => {
    try {
      await axios.delete(`/api/items/${id}`);

      dispatch({
        type: DELETE_ITEM,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: ITEM_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  // Filter items
  const filterItems = filters => {
    dispatch({
      type: FILTER_ITEMS,
      payload: filters
    });
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <ItemContext.Provider
      value={{
        items: state.items,
        userItems: state.userItems,
        item: state.item,
        filtered: state.filtered,
        error: state.error,
        loading: state.loading,
        getItems,
        getUserItems,
        getItem,
        addItem,
        updateItem,
        deleteItem,
        filterItems,
        clearFilter,
        clearErrors
      }}
    >
      {props.children}
    </ItemContext.Provider>
  );
};

export default ItemState;