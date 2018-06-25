import { REQUEST_SCRAPERS, REQUEST_SCRAPERS_RESULT } from '../actions/App';

const initialState = {
  isFetching: false,
  scrapers: []
};

let scrapers = function(state = initialState, action) {
  switch(action.type) {

  case REQUEST_SCRAPERS:
    return { ...state, isFetching: true }

  case REQUEST_SCRAPERS_RESULT:
    return { ...state, scrapers: action.scrapers, isFetching: false }

  default:
    return state;
  }
}

export default scrapers;
