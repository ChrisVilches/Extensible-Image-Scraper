import { REQUEST_SCRAPPERS, REQUEST_SCRAPPERS_RESULT } from '../actions/App';

const initialState = {
  isFetching: false,
  scrappers: []
};

let scrappers = function(state = initialState, action) {
  switch(action.type) {

  case REQUEST_SCRAPPERS:
    return { ...state, isFetching: true }

  case REQUEST_SCRAPPERS_RESULT:
    return { ...state, scrappers: action.scrappers, isFetching: false }

  default:
    return state;
  }
}

export default scrappers;
