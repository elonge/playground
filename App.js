import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
//import './App.css';
import io from 'socket.io-client';

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
import ShareUtils from './share_utils.jsx';
import UserInfo from './user_info.jsx';
import FakeData from './fake_data.js';
import EditSettingDialog from './edit_settings.jsx'


const addStyle = {
  marginRight: 20,
};


let socket;
let shareLastQuestion;
let lastAddedQuestionInfo;

class App extends Component {
  constructor(props) {
    super(props);
    this.onPredictionsPointsToggle = this.onPredictionsPointsToggle.bind(this);
    this.onUserClick = this.onUserClick.bind(this);
    this.onNextClick = this.onNextClick.bind(this);
    this.onPrevClick = this.onPrevClick.bind(this);
    this.isPrevDisabled = this.isPrevDisabled.bind(this);
    this.isNextDisabled = this.isNextDisabled.bind(this);
    this.onNewLeague = this.onNewLeague.bind(this);
    this.onInviteNewLeague = this.onInviteNewLeague.bind(this);
    this.pushToRemoteWithHandler = this.pushToRemoteWithHandler.bind(this);
    this.handleNewLeagues = this.handleNewLeagues.bind(this);
    this.onUserInfoCancel = this.onUserInfoCancel.bind(this);
    this.onUserInfoExpanded = this.onUserInfoExpanded.bind(this);
    this.onNewQuestion = this.onNewQuestion.bind(this);
    this.handleNewQuestion = this.handleNewQuestion.bind(this);
    this.onDailyStatMode = this.onDailyStatMode.bind(this);
    this.handleLeagueWinners = this.handleLeagueWinners.bind(this);
    this.onLeagueDialogOpen = this.onLeagueDialogOpen.bind(this);
    this.onLeagueDialogClose = this.onLeagueDialogClose.bind(this);
    this.onCompetitionsUpdate = this.onCompetitionsUpdate.bind(this);
    this.onCurrentLeagueChanged = this.onCurrentLeagueChanged.bind(this);
    this.getCurrentStatePredictions = this.getCurrentStatePredictions.bind(this);
    this.updatePrediction = this.updatePrediction.bind(this);
    this.onSettingsClicked = this.onSettingsClicked.bind(this);
    this.onSettingsClose = this.onSettingsClose.bind(this);
    this.state = {
      showPointsMode : false,
      viewedDateIndex: 0,
      otherUserPredictionsMode: null,
      users: FakeData.users,
      points: FakeData.usersPoints,
      userPredictions: FakeData.userPredictions,
      otherPredictions: FakeData.otherPredictions,
      leagues: FakeData.leagues,
      socketStatus: 'OK',
      profileExpanded: false,
      dailyStatMode: false,
      leagueDailyWinners: FakeData.leagueDailyWinners,
      allCompetitions: FakeData.allCompetitions,
      dialogOpen: false,
      currentLeague: FakeData.leagues[0],
      editSettingsDialogOpen: false,
    };
  }

  componentWillMount() {
    // Connect to socket.
    socket = io.connect(
      `wss://infinite-caverns-93636.herokuapp.com`,
      {reconnect: true, secure: true}
    );

    this.pushToRemoteWithHandler('league:daily_winners', {}, this.handleLeagueWinners);
  }

  handleLeagueWinners(channel, response) {
    var self = this;
    if (response.startsWith("ok: ")) {
      let newData = JSON.parse(response.substring(4));
      self.setState({leagueDailyWinners: newData});
    } else {
      console.error("Failed to parse server response! " + response);
    }
  }

  pushToRemoteWithHandler(channel, message, statusHandler) {
    socket.emit(
      `push:${channel}`,
      {
        senderId: this.props.viewerId,
        ...message,
      },
      (status) => {
//        console.log(channel + ": " + JSON.stringify(status));
        statusHandler(channel, status);
      }
    );
  }

  onSettingsClicked() {
    this.setState({editSettingsDialogOpen:true, dialogOpen:true})
  }

  onSettingsClose() {
    this.setState({editSettingsDialogOpen:false, dialogOpen:false})
  }

  onLeagueDialogClose() {
    this.setState({dialogOpen:false});
  }

  onLeagueDialogOpen() {
    this.setState({dialogOpen:true});
  }

  onNewQuestion(toShare, questionInfo) {
    console.log("toShare=" + toShare);
    shareLastQuestion = toShare;
    lastAddedQuestionInfo = questionInfo;
    this.pushToRemoteWithHandler("predictions:refetch", {}, this.handleNewQuestion);
  }

  handleNewQuestion(channel, response) {
    if (response.startsWith("ok: ")) {
      let newData = JSON.parse(response.substring(4));
      this.setState({userPredictions: newData.userPredictions, otherPredictions:newData.otherPredictions});
      const me = this.state.users.find((user) => user.fbId === this.props.viewerId);
      if (shareLastQuestion) {
        ShareUtils.tellNewQuestion(this.props.apiUri, 'broadcast', me.name, lastAddedQuestionInfo);
      }
    } else {
      console.error("Failed to parse server response! " + response);
    }
  }

  onDailyStatMode() {
    this.setState({dailyStatMode: !this.state.dailyStatMode});
  }

  onUserInfoExpanded() {
    let current = this.state.profileExpanded;
    this.setState({profileExpanded: !current});
  }

  onUserInfoCancel() {
    this.setState({otherUserPredictionsMode: null, showPointsMode:true});
  }

  onCurrentLeagueChanged(league) {
    this.setState({currentLeague: league});
  }

  onNewLeague(newLeague) {
    this.setState({dialogOpen:false});
    this.pushToRemoteWithHandler("league:refetch", {}, this.handleNewLeagues);
  }

  onCompetitionsUpdate(league) {
    console.log("competition updated: " + league.id);
    this.setState({dialogOpen:false, currentLeague:league});
  }

  onInviteNewLeague(newLeague) {
    console.log("going to invite " + newLeague.league_name);
    const me = this.state.users.find((user) => user.fbId === this.props.viewerId);
    ShareUtils.inviteToLeague(this.props.apiUri, 'broadcast', me.name, newLeague);
    this.onNewLeague(newLeague);
  }

  handleNewLeagues(channel, response) {
    console.log("handleNewLeagues: " + response);
    if (response.startsWith("ok: ")) {
      let newData = JSON.parse(response.substring(4));
      this.setState({leagues: newData.leagues, points:newData.points});
    } else {
      console.error("Failed to parse server response! " + response);
    }
  }

  updatePrediction(prediction) {
    const userPredictions = this.state.userPredictions.slice();
    let leaguesWithPrediction = [];
    // Update all instances of this prediction (in all leagues) with value. Save list of leagues
    userPredictions.map((p, index) => {
      if (p.game_id === prediction.game_id && p.id === prediction.id) {
        userPredictions[index].value = prediction.value;
        leaguesWithPrediction.push(p.league);
      }
    });
    this.setState({userPredictions: userPredictions});
    /* Do nothing in playground. In real app:
    this.pushToRemote('game:update:prediction', {
      id:prediction.id,
      gameId:prediction.game_id,
      value:prediction.value,
      forLeagueIds: leaguesWithPrediction,
    });
    */
  }

  onPredictionsPointsToggle() {
    let current = this.state.showPointsMode;
    this.setState({showPointsMode: !current});
  }

  onUserClick(userPoint) {
    let user = this.state.users.find((user) => user.fbId === userPoint.fbId);
    // We want to make sure that with the new user, we will be in the same date (or first if it didn't have predictions on that dat)
    let currentPredictions = this.getCurrentStatePredictions();
    let currentDays =  currentPredictions.map(prediction => prediction.prediction_date).filter((v, i, a) => a.indexOf(v) === i).sort().reverse();
    let currentDate = currentDays[this.state.viewedDateIndex];
    let newPredictions;
    if (user.fbId == this.props.viewerId) {
      newPredictions = this.state.userPredictions;
      this.setState({otherUserPredictionsMode:null,showPointsMode:false});
    } else {
      newPredictions = this.state.otherPredictions.filter(prediction => prediction.user_id == user.fbId);
      this.setState({otherUserPredictionsMode:user});
    }
    let newUserDays =  newPredictions.map(prediction => prediction.prediction_date).filter((v, i, a) => a.indexOf(v) === i).sort().reverse();
    let newViewedDateIndex = newUserDays.findIndex(i => (i === currentDate));
    if (newViewedDateIndex < 0) {
      newViewedDateIndex = 0;
    }
    this.setState({viewedDateIndex: newViewedDateIndex});
  }

  isPrevDisabled() {
    if (this.state.dialogOpen) {
      return true;
    }
    if (this.state.showPointsMode && this.state.otherUserPredictionsMode == null) {
      return true;
    }
    let days =  this.getCurrentStatePredictions().map(prediction => prediction.prediction_date).filter((v, i, a) => a.indexOf(v) === i).sort().reverse();
    return (this.state.viewedDateIndex >= days.length - 1);
  }

  isNextDisabled() {
    if (this.state.dialogOpen) {
      return true;
    }
    if (this.state.showPointsMode && this.state.otherUserPredictionsMode == null) {
      return true;
    }
    return (this.state.viewedDateIndex == 0);
  }

  onPrevClick() {
    if (this.state.showPointsMode && this.state.otherUserPredictionsMode == null) {
      return; /* shouldn't call here at all */
    } else {
      let viewedDateIndex = this.state.viewedDateIndex;
      let days =  this.getCurrentStatePredictions().map(prediction => prediction.prediction_date).filter((v, i, a) => a.indexOf(v) === i).sort().reverse();
      if (viewedDateIndex < days.length - 1) {
        this.setState({viewedDateIndex: viewedDateIndex + 1});
      }
    }
  }
  onNextClick() {
    if (this.state.showPointsMode && this.state.otherUserPredictionsMode == null) {
      return; /* shouldn't call here at all */
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
    predictions = predictions.filter(prediction => prediction.league == this.state.currentLeague.id);
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
      currentLeague,
      leagues,
      leagueDailyWinners,
      dialogOpen,
      editSettingsDialogOpen,
    } = this.state;

    let superUser = '';

    let page;

    if (users.length > 0) {
      const me = users.find((user) => user.fbId === this.props.viewerId);
      let invite = this.getInviteComponent();

      let gamePart;
      let topPart;
      if (showPointsMode && otherUserPredictionsMode == null) {
        gamePart = ( dialogOpen ? "" :
          <UsersLeague
            usersPoints={points}
            currentLeague={currentLeague}
            leagues={leagues}
            onUserClick={this.onUserClick}
            dailyStatMode={this.state.dailyStatMode}
            leagueDailyWinners={leagueDailyWinners}
            users={users}
          />
        );
        topPart = (editSettingsDialogOpen ? "" :
          <LeagueInfo
            users={users}
            currentLeague={currentLeague}
            dailyStatMode={this.state.dailyStatMode}
            onDailyStatMode={this.onDailyStatMode}
            viewerId={this.props.viewerId}
            allCompetitions={this.state.allCompetitions}
            socket={socket}
            onDialogOpen={this.onLeagueDialogOpen}
            onDialogClose={this.onLeagueDialogClose}
            onInviteNewLeague={this.onInviteNewLeague}
            onNewLeague={this.onNewLeague}
            onCompetitionsUpdate={this.onCompetitionsUpdate}
          />
        );
      } else {
        gamePart = ( dialogOpen ? "" :
          <TodayPredictions
            userPredictions={this.getCurrentStatePredictions()}
            updatePrediction={this.updatePrediction}
            forceEnable={false}
            otherUserMode={otherUserPredictionsMode}
            viewedDateIndex={viewedDateIndex}
            users={users}
            otherPredictions={otherPredictions}
            socket={socket}
            senderId={this.props.senderId}
            currentLeague={currentLeague}
            leagues={leagues}
          />
        );
        topPart = ( dialogOpen ? "" :
          <UserInfo
            user={otherUserPredictionsMode == null ? me : otherUserPredictionsMode}
            onUserInfoCancel={this.onUserInfoCancel}
            isMe={otherUserPredictionsMode == null}
            expanded={this.state.profileExpanded}
            onUserInfoExpanded={this.onUserInfoExpanded}
          />
        );
        // if (otherUserPredictionsMode == null) {
        //   topPart = (
        //     <Viewers
        //       users={users}
        //       viewerId={this.props.viewerId}
        //       onUserClick={this.onUserClick}
        //       viewedUserId={(otherUserPredictionsMode==null ? this.props.viewerId : otherUserPredictionsMode.fbId)}
        //     />
        //   );
        // } else {
        //   topPart = (
        //     <UserInfo
        //       user={otherUserPredictionsMode}
        //     />
        //   );
        // }
      }

      let editSettingsDialog = ( editSettingsDialogOpen  ?
        <EditSettingDialog
          socket={this.props.socket}
          senderId={this.props.viewerId}
          onClose={this.onSettingsClose}
          settings={{}}
        />
        : ""
      );

      let appBarTitle = currentLeague.league_name;
      if (otherUserPredictionsMode != null) {
        appBarTitle = otherUserPredictionsMode.name +"'s profile";
      }
      let appBar = (
        <MainAppBar
          disabled={dialogOpen}
          onPrevClick={this.onPrevClick}
          onNextClick={this.onNextClick}
          isPrevDisabled={this.isPrevDisabled}
          isNextDisabled={this.isNextDisabled}
          onPredictionsPointsToggle={this.onPredictionsPointsToggle}
          showPointsMode={showPointsMode}
          title={appBarTitle}
          socket={socket}
          senderId={this.props.viewerId}
          onNewLeague={this.onNewLeague}
          onInviteNewLeague={this.onInviteNewLeague}
          leagues={this.state.leagues}
          users={this.state.users}
          onNewQuestion={this.onNewQuestion}
          currentLeague={this.state.currentLeague}
          onCurrentLeagueChanged={this.onCurrentLeagueChanged}
          onSettingsClicked={this.onSettingsClicked}
        />
      );

      if (this.props.superUserMode) {
        page = (
          <div className="App" style={{ paddingTop: 10 }}>
            <MuiThemeProvider>
              <section id='list'>
                <SuperUserEditor
                  socket={socket}
                  senderId={this.props.viewerId}
                  currentLeague={currentLeague}
                  leagues={leagues}
                />
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
                {editSettingsDialog}
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
