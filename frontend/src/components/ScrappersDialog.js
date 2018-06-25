import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';


class ScrappersDialog extends Component {

  render(){

    return <Dialog open={this.props.dialogIsOpen} onClose={this.props.closeDialog} aria-labelledby="simple-dialog-title">
      <DialogTitle id="simple-dialog-title">Active scrapping plugins</DialogTitle>
      <div>
        <List>
          {this.props.scrappers.map((scrapper, key) => (
            <ListItem key={key}>
              <ListItemAvatar>
                <Avatar>
                  {scrapper.name.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>

              <ListItemText primary={scrapper.name} secondary={
                  scrapper.description? scrapper.description : <i>No description available.</i>
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

ScrappersDialog.propTypes = {
  dialogIsOpen: PropTypes.bool.isRequired,
  scrappers: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default ScrappersDialog;
