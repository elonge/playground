import React, { Component } from 'react';
import logo from './logo.svg';
//import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SuperUserEditor from './super_user';
import TodayPredictions from './today_predictions.jsx'
import Viewers from './viewers.jsx';
import {Panel, Form} from 'react-weui';
import Invite from './invite.jsx';


const usersPoints = [
  {
    profilePic: 'https://i.pinimg.com/736x/eb/b0/70/ebb0708dccbff54f723969ff300f386b--game-of-thrones-costumes-game-of-thrones-tv.jpg',
    totalPoints: 15,
    lastPoints: 3,
    name: 'Elon Gecht',
    online: true,
    fbId: 100
  },
  {
    profilePic: 'https://i.ytimg.com/vi/Iu8pSihUJvM/hqdefault.jpg',
    totalPoints: 8,
    lastPoints: 3,
    name: 'Arik Benado',
    online: true,
    fbId: 200
  },
  {
    profilePic: 'https://www.tbnsport.com/wp-content/uploads/moyes-manage.jpg',
    totalPoints: 2,
    lastPoints: 1,
    name: 'David Moyes',
    online: false,
    fbId: 300
  },

]
const userPredictions = [
  {
    home_team: 'Lakers',
    away_team: 'Warriors',
    result_type: 'winner_range',
    predicted_score: '1',
    type_extra: '',
    start_time: '2017-12-22 17:00:00',
    value: 'Lakers by 10 points or more',
    open: true,
    status: 'before',
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_won: 1,
    points_updated: true,
    game_id: 22,
    sport_type: 'Basketball',
    id:1
  },
  {
    home_team: 'Arsenal',
    away_team: 'Burnley',
    result_type: 'winner',
    predicted_score: '1',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: 'X',
    open: true,
    status: 'before',
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_won: 0,
    points_updated: true,
    game_id: 2,
    sport_type: 'Soccer',
    id:1
  },
  {
    home_team: 'Titans',
    away_team: 'Rams',
    result_type: 'winner_range',
    predicted_score: '1',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: null,
    open: true,
    status: 'before',
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_won: 0,
    points_updated: false,
    game_id: 29,
    sport_type: 'Football',
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
    result_type: 'num_goals',
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
    game_id: 9,
    sport_type: 'Soccer',
    id:88
  },
  {
    home_team: 'Watford',
    away_team: 'West Brom',
    result_type: 'to_score',
    predicted_score: 'Richarlison',
    type_extra: '',
    start_time: '2017-12-18 17:00:00',
    value: null,
    open: true,
    status: 'before',
    close_on_start_time: false,
    prediction_date: '2017-12-18',
    points_updated: false,
    points_won: 0,
    game_id: 5,
    sport_type: 'Soccer',
    id:2
  },
  {
    home_team: 'Valencia',
    away_team: 'Real Madrid',
    result_type: 'first_score',
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
    id:3
  },
  {
    home_team: 'Barcelona',
    away_team: 'Valencia',
    result_type: 'event',
    predicted_score: '2-1',
    type_extra: 'num_goals',
    start_time: '2017-12-15 17:00:00',
    value: null,
    open: true,
    status: 'before',
    close_on_start_time: false,
    prediction_date: '2017-12-15',
    points_updated: false,
    points_won: 0,
    sport_type: 'soccer',
    game_id: 6,
    id:2
  },
];


class App extends Component {
  constructor(props) {
    try {
      super(props);
      this.onUsersToggle = this.onUsersToggle.bind(this);
      this.state = {
        showPointsMode : false,
      };
    } catch (e) { alert('App exception: ' + e.message); }
  }

  updatePrediction(prediction) {
    // Do nothing
  }

  onUsersToggle() {
    let current = this.state.showPointsMode;
    this.setState({showPointsMode: !current});
  }

  render() {
    let hidePredictions = false;
    let predictions = (hidePredictions ? '' :
      <TodayPredictions
        userPredictions={userPredictions}
        usersPoints={usersPoints}
        updatePrediction={this.updatePrediction}
        showPointsMode={this.state.showPointsMode}
      />
    )
    let superUser = (hidePredictions ? <SuperUserEditor/> : '');
    let buttonText = 'Compete with your friends!';
    let   sharingMode = 'current_thread';

    return (
      <div className="App">
        <MuiThemeProvider>
        <section id='list'>
          <Viewers
            users={usersPoints}
            viewerId={100}
            onUsersToggle={this.onUsersToggle}
          />

          <Panel>
            <section id='items'>
              {predictions}
              {superUser}
            </section>
          </Panel>
          <Invite
            title="Compete with friends"
            apiUri="sds"
            sharingMode={sharingMode}
            buttonText={buttonText}
          />
          </section>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
