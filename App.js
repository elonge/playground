import React, { Component } from 'react';
import logo from './logo.svg';
//import './App.css';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SuperUserEditor from './super_user';
import TodayPredictions from './today_predictions.jsx'
import Viewers from './viewers.jsx';
import {Panel, Form} from 'react-weui';
import Invite from './invite.jsx';
import UsersLeague from './users_league.jsx';
import MainAppBar from './main_app_bar.jsx';

import FakeData from './fake_data.js';

const superUserMode = false;


class App extends Component {
  constructor(props) {
    super(props);
    this.onPredictionsPointsToggle = this.onPredictionsPointsToggle.bind(this);
    this.onUserClick = this.onUserClick.bind(this);
    this.onNextClick = this.onNextClick.bind(this);
    this.onPrevClick = this.onPrevClick.bind(this);
    this.isPrevDisabled = this.isPrevDisabled.bind(this);
    this.isNextDisabled = this.isNextDisabled.bind(this);
    this.state = {
      showPointsMode : false,
      viewedDateIndex: 0,
      viewedWeekIndex: 0,
      otherUserPredictionsMode: null,
      points: FakeData.usersPoints,
      userPredictions: FakeData.userPredictions,
      otherPredictions: FakeData.otherPredictions,
    };
  }

  updatePrediction(prediction) {
    // Do nothing
  }

  onPredictionsPointsToggle() {
    let current = this.state.showPointsMode;
    this.setState({showPointsMode: !current});
  }

  onUserClick(user) {
    // We want to make sure that with the new user, we will be in the same date (or first if it didn't have predictions on that dat)
    let currentPredictions = this.getCurrentStatePredictions();
    let currentDays =  currentPredictions.map(prediction => prediction.prediction_date).filter((v, i, a) => a.indexOf(v) === i).sort().reverse();
    let currentDate = currentDays[this.state.viewedDateIndex];
    let newPredictions;
    if (user.fbId == this.props.viewerId) {
      newPredictions = this.state.userPredictions;
      this.setState({otherUserPredictionsMode:null, showPointsMode: false});
    } else {
      newPredictions = this.state.otherPredictions.filter(prediction => prediction.user_id == user.fbId);
      this.setState({otherUserPredictionsMode:user, showPointsMode: false});
    }
    let newUserDays =  newPredictions.map(prediction => prediction.prediction_date).filter((v, i, a) => a.indexOf(v) === i).sort().reverse();
    let newViewedDateIndex = newUserDays.findIndex(i => (i === currentDate));
    if (newViewedDateIndex < 0) {
      newViewedDateIndex = 0;
    }
    this.setState({viewedDateIndex: newViewedDateIndex});
  }

  isPrevDisabled() {
    if (this.state.showPointsMode) {
      let weeks = this.state.points.map(user => user.sunday).filter((v, i, a) => a.indexOf(v) === i).sort().reverse();
      return (this.state.viewedWeekIndex >= weeks.length - 1);
    }
    let days =  this.state.userPredictions.map(prediction => prediction.prediction_date).filter((v, i, a) => a.indexOf(v) === i).sort().reverse();
    return (this.state.viewedDateIndex >= days.length - 1);
  }

  isNextDisabled() {
    if (this.state.showPointsMode) {
      return (this.state.viewedWeekIndex == 0);
    }
    return (this.state.viewedDateIndex == 0);
  }

  onPrevClick() {
    if (this.state.showPointsMode) {
      let viewedWeekIndex = this.state.viewedWeekIndex;
      let weeks =  this.state.points.map(user => user.sunday).filter((v, i, a) => a.indexOf(v) === i).sort().reverse();
      if (viewedWeekIndex < weeks.length - 1) {
        this.setState({viewedWeekIndex: viewedWeekIndex + 1});
      }
    } else {
      let viewedDateIndex = this.state.viewedDateIndex;
      let days =  this.state.userPredictions.map(prediction => prediction.prediction_date).filter((v, i, a) => a.indexOf(v) === i).sort().reverse();
      if (viewedDateIndex < days.length - 1) {
        this.setState({viewedDateIndex: viewedDateIndex + 1});
      }
    }
  }
  onNextClick() {
    if (this.state.showPointsMode) {
      let viewedWeekIndex = this.state.viewedWeekIndex;
      if (viewedWeekIndex > 0) {
        this.setState({viewedWeekIndex: viewedWeekIndex - 1});
      }
    } else {
      let viewedDateIndex = this.state.viewedDateIndex;
      if (viewedDateIndex > 0) {
        this.setState({viewedDateIndex: viewedDateIndex - 1});
      }
    }
  }

  getCurrentStatePredictions() {
    let predictions = this.state.userPredictions;
    if (this.state.otherUserPredictionsMode != null) {
      predictions = this.state.otherPredictions.filter(prediction => prediction.user_id == this.state.otherUserPredictionsMode.fbId);
    }
    return predictions;
  }

  render() {
    const {
      userPredictions,
      otherPredictions,
      users,
      points,
      showPointsMode,
      otherUserPredictionsMode,
      viewedDateIndex,
      viewedWeekIndex,
    } = this.state;

    let superUser = '';
    let mainPart = '';
    if (showPointsMode) {
      mainPart = (
        <UsersLeague
          usersPoints={points}
          userPredictions={userPredictions}
          viewedWeekIndex={viewedWeekIndex}
        />
      );
    } else {
      mainPart = (
        <TodayPredictions
          userPredictions={this.getCurrentStatePredictions()}
          updatePrediction={this.updatePrediction}
          forceEnable={true}
          otherUserMode={otherUserPredictionsMode}
          viewedDateIndex={viewedDateIndex}
        />
      );
    }

    let buttonText = 'Compete with your friends!';
    let sharingMode = 'current_thread';

    let appBarTitle = "Welcome " + points[0].name;

    let appBar = (
      <MainAppBar
        onPrevClick={this.onPrevClick}
        onNextClick={this.onNextClick}
        isPrevDisabled={this.isPrevDisabled}
        isNextDisabled={this.isNextDisabled}
        onPredictionsPointsToggle={this.onPredictionsPointsToggle}
        title={appBarTitle}
        />
    );
    let invite = (
      <Invite
        title="Compete with friends"
        apiUri="sds"
        sharingMode={sharingMode}
        buttonText={buttonText}
      />
    );
    if (superUserMode) {
      appBar = "";
      invite = "";
      mainPart = "";
      superUser = <SuperUserEditor/>
    }

    return (
      <div className="App" style={{ paddingTop: 10 }}>
        <MuiThemeProvider>
          <section id='list'>
          {appBar}
          <Viewers
            users={points}
            viewerId={100}
            onUserClick={this.onUserClick}
            viewedUserId={(otherUserPredictionsMode==null ? 100 : otherUserPredictionsMode.fbId)}
          />
          <Panel>
            <section id='items'>
              {mainPart}
              {superUser}
            </section>
          </Panel>
          {invite}
          </section>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
