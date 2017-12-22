import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SuperUserEditor from './super_user';
import TodayPredictions from './today_predictions.jsx'

const usersPoints = [
  {
    profilePic: 'https://i.pinimg.com/736x/eb/b0/70/ebb0708dccbff54f723969ff300f386b--game-of-thrones-costumes-game-of-thrones-tv.jpg',
    totalPoints: 15,
    lastPoints: 3,
    name: 'Elon Gecht'
  },
  {
    profilePic: 'https://i.ytimg.com/vi/Iu8pSihUJvM/hqdefault.jpg',
    totalPoints: 8,
    lastPoints: 3,
    name: 'Arik Benado'
  },
  {
    profilePic: 'https://www.tbnsport.com/wp-content/uploads/moyes-manage.jpg',
    totalPoints: 2,
    lastPoints: 1,
    name: 'David Moyes'
  },

]
const userPredictions = [
  {
    home_team: 'Arsenal',
    away_team: 'Burnley',
    result_type: 'winner',
    predicted_score: '1',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: null,
    open: true,
    status: 'before',
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_won: 1,
    points_updated: true,
    game_id: 2,
    sport_type: 'Soccer',
    id:1
  },
  {
    home_team: 'Brighton',
    away_team: 'Watford',
    result_type: 'exact_score',
    predicted_score: '2-1',
    type_extra: '',
    start_time: '2017-12-17 17:00:00',
    value: null,
    open: true,
    status: 'before',
    close_on_start_time: false,
    prediction_date: '2017-12-17',
    points_updated: false,
    points_won: 0,
    game_id: 2,
    sport_type: 'Soccer',
    id:2
  },
  {
    home_team: 'Everton',
    away_team: 'Swansea',
    result_type: 'exact_score',
    predicted_score: '3-1',
    type_extra: '',
    start_time: '2017-12-17 17:00:00',
    value: null,
    open: true,
    status: 'before',
    close_on_start_time: false,
    prediction_date: '2017-12-19',
    points_updated: false,
    points_won: 0,
    sport_type: 'Soccer',
    game_id: 3,
    id:2
  },
  {
    home_team: 'Newcastle',
    away_team: 'West Brom',
    result_type: 'winner',
    predicted_score: 'x',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: null,
    open: true,
    status: 'before',
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_updated: false,
    points_won: 0,
    game_id: 4,
    sport_type: 'Soccer',
    id:2
  },
  {
    home_team: 'Barcelona',
    away_team: 'Valencia',
    result_type: 'event',
    predicted_score: '2-1',
    type_extra: 'penalty_home',
    start_time: '2017-12-15 17:00:00',
    value: true,
    open: true,
    status: 'before',
    close_on_start_time: false,
    prediction_date: '2017-12-15',
    points_updated: false,
    points_won: 0,
    sport_type: 'soccer',
    game_id: 5,
    id:2
  },
];


class App extends Component {

  updatePrediction(prediction) {
    // Do nothing
  }

  render() {
    let hidePredictions = true;
    let predictions = (hidePredictions ? '' :
      <TodayPredictions
        userPredictions={userPredictions}
        usersPoints={usersPoints}
        updatePrediction={this.updatePrediction}
      />
    )
    let superUser = (hidePredictions ? <SuperUserEditor/> : '');
    return (
      <div className="App">
        <MuiThemeProvider>
          {predictions}
          {superUser}
        </MuiThemeProvider>

        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
