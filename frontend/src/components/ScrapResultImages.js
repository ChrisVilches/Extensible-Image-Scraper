import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Tooltip from '@material-ui/core/Tooltip';

import './ScrapResultImages.css';

class ScrapResultImages extends Component {

  render(){

    let urls = this.props.urls;
    let scrapperName = this.props.scrapperName;
    let scrapperDescription = this.props.scrapperDescription;

    if(R.isNil(scrapperDescription)){
      scrapperDescription = "(This scrapper hasn't specified a custom description) This is a plugin that scraps the website looking for pictures using a specific algorithm. The software can have multiple picture scrappers each for different purposes."
    }

    if(!R.is(Array, urls)){
      urls = [urls];
    }

    return <div>
      <h3>
        <span className='scrapper-name-title'>
        {scrapperName}
        </span>

        <Tooltip id="tooltip-icon" title={scrapperDescription}>
          <small>
            <sup>[?]</sup>
          </small>
        </Tooltip>
      </h3>

      {
        urls.map((url, key) =>
        <a key={key} target='_blank' href={url}>
          <img className='result-img' alt={`${scrapperName} ${key}`} src={url}/>
        </a>)

      }
    </div>;
  }

}

ScrapResultImages.propTypes = {
  urls: PropTypes.any.isRequired,
  scrapperName: PropTypes.string.isRequired,
  scrapperDescription: PropTypes.string
};

export default ScrapResultImages;
