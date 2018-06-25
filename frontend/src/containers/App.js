import { connect } from 'react-redux';
import * as actions from '../actions/App';
import React, { Component } from 'react';
import './App.css';
import ScrapResultImages from '../components/ScrapResultImages';
import ScrappersDialog from '../components/ScrappersDialog';

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import * as R from 'ramda';

class App extends Component {

  constructor(){
    super();
    this.state = {
      urlInput: '',
      dialogOpen: false
    };

    this.onChangeURLInput = this.onChangeURLInput.bind(this);
    this.getImages = this.getImages.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.openDialog = this.openDialog.bind(this);
  }

  openDialog(){

    this.props.fetchScrappers();

    this.setState({
      dialogOpen: true
    });
  }

  handleCloseDialog(){
    this.setState({
      dialogOpen: false
    });
  }

  onChangeURLInput(ev){
    this.setState({
      urlInput: ev.target.value
    });
  }

  getImages(){
    this.props.fetchImages(this.state.urlInput);
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Extensible Image Scrapper</h1>
          <p><a target="_blank" rel="noopener noreferrer" className="header-link" href="https://github.com/FeloVilches/extensible-image-scrapper">Github</a></p>
        </header>

        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Paper className="container">

              <FormControl component='form' error={this.props.images.invalidUrl} aria-describedby="website-url-text" style={{width: '80%'}} onSubmit={(ev) => { this.getImages(); ev.preventDefault(); }}>
                <InputLabel htmlFor="website-url">Website URL</InputLabel>
                <Input autoFocus id="website-url" value={this.state.urlInput} onChange={this.onChangeURLInput} className='url-input'/>
                {this.props.images.invalidUrl? <FormHelperText id="website-url-text">Invalid URL</FormHelperText> : ''}

                <div className="get-images-btn">
                  <Button color="primary" type="submit" variant="contained" disabled={this.state.urlInput.length === 0}>Get images</Button>
                </div>

                <div className="get-images-btn">
                  <Button color="primary" onClick={this.openDialog}>About</Button>
                </div>

              </FormControl>

              {this.props.images.isFetching?
                <div>
                  <CircularProgress/>
                </div>
              : ''}

            </Paper>
          </Grid>

          {this.props.images.showResultsContainer?
          <Grid item xs={12}>
            <Paper className="container">

              {
                !R.isNil(this.props.images.images) &&
                Object
                .keys(this.props.images.images)
                .map(key => <ScrapResultImages key={key} scrapperName={key} urls={this.props.images.images[key]} scrapperDescription={this.props.images.descriptions[key]}/>)
              }

              {
                !this.props.images.invalidUrl && R.isEmpty(this.props.images.images)?
                  <p>
                    No images found.
                  </p> : ''
              }

            </Paper>
          </Grid>

          : ''}

        </Grid>




        <ScrappersDialog
          dialogIsOpen={this.state.dialogOpen}
          isFetching={this.props.scrappers.isFetching}
          scrappers={this.props.scrappers.scrappers}
          closeDialog={this.handleCloseDialog}/>

      </div>
    );
  }
}


const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {

  return {
    fetchImages: url => { dispatch(actions.fetchImages(url)) },
    fetchScrappers: () => { dispatch(actions.fetchScrappers()) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
