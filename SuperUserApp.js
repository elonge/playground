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

let socket;

class SuperUserApp extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // Connect to socket.
    socket = io.connect(
      `wss://infinite-caverns-93636.herokuapp.com`,
      {reconnect: true, secure: true}
    );
  }

  pushToRemoteWithHandler(channel, message, statusHandler) {
    socket.emit(
      `push:${channel}`,
      {
        senderId: this.props.viewerId,
        ...message,
      },
      (status) => {
        console.log(channel + ": " + JSON.stringify(status));
        statusHandler(channel, status);
      }
    );
  }

  render() {
    let page = (
      <div className="App" style={{ paddingTop: 10 }}>
        <MuiThemeProvider>
          <section id='list'>
            <SuperUserEditor
              socket={socket}
              senderId={this.props.viewerId}
            />
          </section>
      </MuiThemeProvider>
    </div>
    );
    return (
      <div id='app'>
        <ReactCSSTransitionGroup
          transitionName='page'
          transitionEnterTimeout={100}
          transitionLeaveTimeout={500}
        >
          {page}
        </ReactCSSTransitionGroup>
      </div>
    );

  }
}

export default SuperUserApp;
