import {
  GET_SWAPS,
  GET_SWAP,
  CREATE_SWAP,
  UPDATE_SWAP_STATUS,
  ADD_MESSAGE,
  SWAP_ERROR,
  CLEAR_ERRORS
} from '../types';

const swapReducer = (state, action) => {
  switch (action.type) {
    case GET_SWAPS:
      return {
        ...state,
        swaps: action.payload,
        loading: false
      };
    case GET_SWAP:
      return {
        ...state,
        swap: action.payload,
        loading: false
      };
    case CREATE_SWAP:
      return {
        ...state,
        swaps: [action.payload, ...state.swaps],
        loading: false
      };
    case UPDATE_SWAP_STATUS:
      return {
        ...state,
        swaps: state.swaps.map(swap =>
          swap._id === action.payload._id ? action.payload : swap
        ),
        swap: action.payload,
        loading: false
      };
    case ADD_MESSAGE:
      return {
        ...state,
        swap: {
          ...state.swap,
          messages: [...state.swap.messages, action.payload]
        },
        loading: false
      };
    case SWAP_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export default swapReducer;