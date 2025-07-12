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

const itemReducer = (state, action) => {
  switch (action.type) {
    case GET_ITEMS:
      return {
        ...state,
        items: action.payload,
        loading: false
      };
    case GET_USER_ITEMS:
      return {
        ...state,
        userItems: action.payload,
        loading: false
      };
    case GET_ITEM:
      return {
        ...state,
        item: action.payload,
        loading: false
      };
    case ADD_ITEM:
      return {
        ...state,
        items: [action.payload, ...state.items],
        userItems: [action.payload, ...state.userItems],
        loading: false
      };
    case UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload._id ? action.payload : item
        ),
        userItems: state.userItems.map(item =>
          item._id === action.payload._id ? action.payload : item
        ),
        loading: false
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
        userItems: state.userItems.filter(item => item._id !== action.payload),
        loading: false
      };
    case FILTER_ITEMS:
      return {
        ...state,
        filtered: state.items.filter(item => {
          const { category, gender, size, condition, searchTerm } = action.payload;
          let match = true;
          
          if (category && category !== 'all') {
            match = match && item.category === category;
          }
          
          if (gender && gender !== 'all') {
            match = match && item.gender === gender;
          }
          
          if (size && size !== 'all') {
            match = match && item.size === size;
          }
          
          if (condition && condition !== 'all') {
            match = match && item.condition === condition;
          }
          
          if (searchTerm) {
            const regex = new RegExp(`${searchTerm}`, 'gi');
            match = match && (regex.test(item.title) || regex.test(item.description));
          }
          
          return match;
        })
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null
      };
    case ITEM_ERROR:
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

export default itemReducer;