import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
//import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SuperUserEditor from './super_user';
import TodayPredictions from './today_predictions.jsx'
import Viewers from './viewers.jsx';
import LoadingScreen from './loading_screen.jsx';
import {Panel, Form} from 'react-weui';
import Invite from './invite.jsx';
import UsersLeague from './users_league.jsx';
import MainAppBar from './main_app_bar.jsx';
import LeagueInfo from './league_info.jsx'

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
    this.onLeagueChanged = this.onLeagueChanged.bind(this);
    this.state = {
      showPointsMode : false,
      viewedDateIndex: 0,
      viewedWeekIndex: 0,
      otherUserPredictionsMode: null,
      users: FakeData.users,
      points: FakeData.usersPoints,
      userPredictions: FakeData.userPredictions,
      otherPredictions: FakeData.otherPredictions,
      leagues: FakeData.leagues,
      viewedLeagueIndex: 0,
    };
  }

  onLeagueChanged(event, key, value) {
    this.setState({viewedLeagueIndex: key});
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

  firstTodayPrediction() {
      return this.state.userPredictions.find(this.isPrecitionToday);
  }
  isPrecitionToday(prediction) {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    var dateStr = [year, month, day].join('-');
    return prediction.prediction_date == dateStr;
  }

  getInviteComponent() {
    let invite;
    let invitePrediction = this.firstTodayPrediction();
    let inviteTitle = (invitePrediction == null ?
      'Questions about today\'s games' :
       'Questions about ' + invitePrediction.home_team +'-'+invitePrediction.away_team +' and other games');

    // only owners are able to share their lists and other
    // participants are able to post back to groups.
    let sharingMode;
    let buttonText;

    if (this.props.threadType === 'USER_TO_PAGE') {
      sharingMode = 'broadcast';
      buttonText = 'Compete with your friends!';
    } else {
      sharingMode = 'current_thread';
      buttonText = 'Send to conversation';
    }
    const me = this.state.users.find((user) => user.fbId === this.props.viewerId);

    invite = (
      <Invite
        title={inviteTitle}
        apiUri={this.props.apiUri}
        sharingMode={sharingMode}
        buttonText={buttonText}
        userName={me.name}
      />
    );
    return invite;
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
      viewedLeagueIndex,
      leagues,
    } = this.state;

    let superUser = '';

    let page;

    if (users.length > 0) {
      let invite = this.getInviteComponent();

      let gamePart;
      let topPart;
      if (showPointsMode) {
        gamePart = (
          <UsersLeague
            usersPoints={points}
            userPredictions={userPredictions}
            viewedWeekIndex={viewedWeekIndex}
            viewedLeagueIndex={viewedLeagueIndex}
            leagues={leagues}
            onLeagueChanged={this.onLeagueChanged}
            onUserClick={this.onUserClick}
          />
        );
        topPart = (
          <LeagueInfo
            users={users}
            league={leagues[viewedLeagueIndex]}
          />
        );
      } else {
        gamePart = (
          <TodayPredictions
            userPredictions={this.getCurrentStatePredictions()}
            updatePrediction={this.updatePrediction}
            forceEnable={true}
            otherUserMode={otherUserPredictionsMode}
            viewedDateIndex={viewedDateIndex}
          />
        );
        topPart = (
          <Viewers
            users={users}
            viewerId={this.props.viewerId}
            onUserClick={this.onUserClick}
            viewedUserId={(otherUserPredictionsMode==null ? this.props.viewerId : otherUserPredictionsMode.fbId)}
          />
        );
      }

      const me = this.state.users.find((user) => user.fbId === this.props.viewerId);
      let appBarTitle = "Welcome " + me.name;
      let appBar = (
        <MainAppBar
          onPrevClick={this.onPrevClick}
          onNextClick={this.onNextClick}
          isPrevDisabled={this.isPrevDisabled}
          isNextDisabled={this.isNextDisabled}
          onPredictionsPointsToggle={this.onPredictionsPointsToggle}
          showPointsMode={showPointsMode}
          title={appBarTitle}
          onCreateLeagueCommand={this.onCreateLeagueCommand}
        />
      );

      if (superUserMode) {
        page = (
          <div className="App" style={{ paddingTop: 10 }}>
            <MuiThemeProvider>
              <section id='list'>
                <SuperUserEditor/>
              </section>
          </MuiThemeProvider>
        </div>
        );
      } else {
        page = (
          <div className="App" style={{ paddingTop: 10 }}>
            <MuiThemeProvider>
              <section id='list'>
                {appBar}
                {topPart}
                {gamePart}
                {invite}
              </section>
            </MuiThemeProvider>
          </div>
        );
      }
    } else {
      // Show a loading screen until app is ready
      page = <LoadingScreen key='load' />;
    }
    return (
      <div id='app'>
        <ReactCSSTransitionGroup
          transitionName='page'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {page}
        </ReactCSSTransitionGroup>
      </div>
    );

  }
}

export default App;
