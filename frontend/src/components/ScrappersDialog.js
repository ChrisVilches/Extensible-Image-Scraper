import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';


class ScrapersDialog extends Component {

  render(){

    return <Dialog open={this.props.dialogIsOpen} onClose={this.props.closeDialog} aria-labelledby="simple-dialog-title">
      <DialogTitle id="simple-dialog-title">Active scraping plugins</DialogTitle>

      <DialogContent>
        An image scraper that can be extended with new functionalities and ways to scrap multiple types of websites. Currently the following plugins are active.
      </DialogContent>

      <div>
        <List>
          {this.props.scrapers.map((scraper, key) => (
            <ListItem key={key}>
              <ListItemAvatar>
                <Avatar>
                  {scraper.name.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>

              <ListItemText primary={scraper.name} secondary={
                  scraper.description? scraper.description : <i>No description available.</i>
              }/>

            </ListItem>
          ))}

          {this.props.isFetching?
            <ListItem>
              <CircularProgress/>
            </ListItem>
          : ''}

        </List>
      </div>
    </Dialog>;
  }
}

ScrapersDialog.propTypes = {
  dialogIsOpen: PropTypes.bool.isRequired,
  scrapers: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default ScrapersDialog;
