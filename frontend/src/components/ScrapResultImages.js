import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import './ScrapResultImages.css';
import red from '@material-ui/core/colors/blue';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  blue: {
    color: red[500],
    top: '4px',
    position: 'relative',
    paddingRight: '5px'
  }
});


class ScrapResultImages extends Component {

  render(){

    const { classes } = this.props;

    let urls = this.props.urls;
    let scraperName = this.props.scraperName;
    let scraperDescription = this.props.scraperDescription;

    if(R.isNil(scraperDescription)){
      scraperDescription = "(This scraper hasn't specified a custom description) This is a plugin that scraps the website looking for pictures using a specific algorithm. The software can have multiple picture scrapers each for different purposes."
    }

    if(!R.is(Array, urls)){
      urls = [urls];
    }

    return <div>
      <h3>
        <span className='scraper-name-title'>

          {this.props.featured? <Icon className={classes.blue}>star</Icon> : ''}

          {scraperName}
        </span>

        <Tooltip id="tooltip-icon" title={scraperDescription}>
          <small>
            <sup>[?]</sup>
          </small>
        </Tooltip>
      </h3>

      {
        urls.map((url, key) =>
        <a key={key} target='_blank' href={url}>
          <img className='result-img' alt={`${scraperName} ${key}`} src={url}/>
        </a>)

      }
    </div>;
  }

}

ScrapResultImages.propTypes = {
  urls: PropTypes.any.isRequired,
  scraperName: PropTypes.string.isRequired,
  scraperDescription: PropTypes.string
};

export default withStyles(styles)(ScrapResultImages);
