import React, { useReducer } from 'react';
import axios from 'axios';
import SwapContext from './swapContext';
import swapReducer from './swapReducer';
import {
  GET_SWAPS,
  GET_SWAP,
  CREATE_SWAP,
  UPDATE_SWAP_STATUS,
  ADD_MESSAGE,
  SWAP_ERROR,
  CLEAR_ERRORS
} from '../types';

const SwapState = props => {
  const initialState = {
    swaps: [],
    swap: null,
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(swapReducer, initialState);

  // Get user's swaps
  const getSwaps = async () => {
    try {
      const res = await axios.get('/api/swaps');

      dispatch({
        type: GET_SWAPS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: SWAP_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  // Get a specific swap
  const getSwap = async id => {
    try {
      const res = await axios.get(`/api/swaps/${id}`);

      dispatch({
        type: GET_SWAP,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: SWAP_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  // Create a new swap request
  const createSwap = async swapData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/swaps', swapData, config);

      dispatch({
        type: CREATE_SWAP,
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: SWAP_ERROR,
        payload: err.response.data.msg
      });
      throw err;
    }
  };

  // Update swap status
  const updateSwapStatus = async (id, status) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(
        `/api/swaps/${id}/status`,
        { status },
        config
      );

      dispatch({
        type: UPDATE_SWAP_STATUS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: SWAP_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  // Add message to swap
  const addMessage = async (id, text) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(
        `/api/swaps/${id}/messages`,
        { text },
        config
      );

      dispatch({
        type: ADD_MESSAGE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: SWAP_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <SwapContext.Provider
      value={{
        swaps: state.swaps,
        swap: state.swap,
        error: state.error,
        loading: state.loading,
        getSwaps,
        getSwap,
        createSwap,
        updateSwapStatus,
        addMessage,
        clearErrors
      }}
    >
      {props.children}
    </SwapContext.Provider>
  );
};

export default SwapState;