export const REQUEST_IMAGES = 'REQUEST_IMAGES';
export const RECEIVE_IMAGES_RESULT = 'RECEIVE_IMAGES_RESULT';
export const INVALIDATE_URL = 'INVALIDATE_URL';

export const REQUEST_SCRAPPERS = 'REQUEST_SCRAPPERS';
export const REQUEST_SCRAPPERS_RESULT = 'REQUEST_SCRAPPERS_RESULT';


let requestImages = function(){
  return {
    type: REQUEST_IMAGES
  };
}

let receiveImagesResult = function(images){
  return {
    type: RECEIVE_IMAGES_RESULT,
    images
  };
}

let invalidateUrl = function(){
  return {
    type: INVALIDATE_URL
  };
}

let requestScrappers = function(){
  return {
    type: REQUEST_SCRAPPERS
  };
}

let receiveScrappersResult = function(scrappers){
  return {
    type: REQUEST_SCRAPPERS_RESULT,
    scrappers
  };
}


export const fetchImages = function(url){

  return dispatch => {

    dispatch(requestImages());

    fetch("http://localhost:3000/?url=" + url)
    .then(data => {
      if(data.status === 400) throw new Error();
      return data.json();
    })
    .then(data => {
      dispatch(receiveImagesResult(data));
    })
    .catch(err => {
      dispatch(invalidateUrl());
    });
  };
}


export const fetchScrappers = function(){

  return dispatch => {

    dispatch(requestScrappers());

    fetch("http://localhost:3000/active_scrappers")
    .then(data => data.json())
    .then(data => {
      dispatch(receiveScrappersResult(data.scrappers));
    })
    .catch(console.log);

  };
}
