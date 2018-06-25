import { REQUEST_IMAGES, RECEIVE_IMAGES_RESULT, INVALIDATE_URL } from '../actions/App';

const initialState = {
  isFetching: false,
  invalidUrl: false,
  images: null,
  showResultsContainer: false,
  descriptions: {}
};

let images = function(state = initialState, action) {
  switch(action.type) {

  case INVALIDATE_URL:
    return { ...state, isFetching: false, invalidUrl: true }

  case REQUEST_IMAGES:
    return { ...state, isFetching: true, invalidUrl: false }

  case RECEIVE_IMAGES_RESULT:
    return { ...state, showResultsContainer: true, images: action.images.images, descriptions: action.images.descriptions, isFetching: false, invalidUrl: false }

  default:
    return state;
  }
}

export default images;
