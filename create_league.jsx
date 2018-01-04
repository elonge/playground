import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import axios from 'axios';

class CreateLeagueDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      isCreate: props.isCreate,
      newLeagueName: '',
      enteredCode: '',
      newLeagueCode: '',
      newLeagueError: '',
      joinLeagueError: '',
      joinLeagueName: '',
      waitingToServer: false,
      enteredCode: '',
    };
    this.onNewLeagueNameChanged = this.onNewLeagueNameChanged.bind(this);
    this.onCodeUpdated = this.onCodeUpdated.bind(this);
    this.onCreateLeague = this.onCreateLeague.bind(this);
    this.onJoinLeague = this.onJoinLeague.bind(this);
    this.onInviteFriends = this.onInviteFriends.bind(this);
    this.onApproveJoining = this.onApproveJoining.bind(this);
    this.onDialogCancel = this.onDialogCancel.bind(this);
    this.renderCreateLeague = this.renderCreateLeague.bind(this);
    this.renderJoinLeague = this.renderJoinLeague.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState( {
      open: nextProps.open,
      isCreate: nextProps.isCreate,
      newLeagueName: '',
      enteredCode: '',
      newLeagueCode: '',
      newLeagueError: '',
      joinLeagueError: '',
      joinLeagueName: '',
      waitingToServer: false,
      enteredCode: '',
    });
  }

  onDialogCancel() {
    this.setState({open: false});
  };

  onNewLeagueNameChanged(event) {
    this.setState({newLeagueName: event.target.value});
  }

  onCodeUpdated(event) {
    this.setState({enteredCode: event.target.value});
  }

  onInviteFriends() {
    alert("invite friends");
  }

  onApproveJoining() {
    alert("Approve joining");
  }

  onJoinLeague() {
    this.setState({waitingToServer: true});
    var self=this;
    let url = 'https://infinite-caverns-93636.herokuapp.com/elon/lg/join/' + this.state.enteredCode;
    axios.get(url)
    .then(function (response) {
      let rc = '' + response.data;
      console.log("rc = " + rc +", " + rc.startsWith("error"));
      if (rc.startsWith('error')) {
        self.setState({waitingToServer: false, joinLeagueError: rc, joinLeagueName:''});
      } else {
        self.setState({waitingToServer: false, joinLeagueName: rc, joinLeagueError: ''});
      }
    })
    .catch(function (error) {
      console.log(error);
      self.setState({waitingToServer: false, joinLeagueError: error, joinLeagueName:''});
    });
  }

  onCreateLeague() {
    this.setState({waitingToServer: true});
    var self=this;
    let url = 'https://infinite-caverns-93636.herokuapp.com/elon/lg/create/' + this.state.newLeagueName;
    axios.get(url)
    .then(function (response) {
      let rc = '' + response.data;
      console.log("rc = " + rc +", " + rc.startsWith("error"));
      if (rc.startsWith('error')) {
        self.setState({waitingToServer: false, newLeagueError: rc, newLeagueCode:''});
      } else {
        self.setState({waitingToServer: false, newLeagueCode: rc, newLeagueError: ''});
      }
    })
    .catch(function (error) {
      console.log(error);
      self.setState({waitingToServer: false, newLeagueError: error, newLeagueCode:''});
    });
  }

  renderCreateLeague() {
    let isCode = this.state.newLeagueCode.length > 0;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        keyboardFocused={true}
        onClick={this.onDialogCancel}
      />,
      <FlatButton
        label={isCode ? "Invite friends..." : "Create a league"}
        primary={true}
        keyboardFocused={true}
        onClick={isCode ? this.onInviteFriends : this.onCreateLeague}
      />,
    ];

    return (
      <Dialog
        title="Create a new league"
        actions={actions}
        disabled={this.state.waitingToServer}
        modal={false}
        open={this.state.open}
        onRequestClose={this.onDialogCancel}
      >
      <div>
        <TextField
          value={this.state.newLeagueName}
          onChange={this.onNewLeagueNameChanged}
          errorText={this.state.newLeagueError}
          hintText="Please enter a unique league name"
        /><br />
        <TextField
          disabled={true}
          hintText="League Code"
          value={(isCode ? 'League created! Code is ' + this.state.newLeagueCode : '')}
        /><br />
      </div>
      </Dialog>
    );
  }

  renderJoinLeague() {
    let isLeague = this.state.joinLeagueName.length > 0;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        keyboardFocused={true}
        onClick={this.onDialogCancel}
      />,
      <FlatButton
        label={isLeague ? "Approve Joining" : "Join league..."}
        primary={true}
        keyboardFocused={true}
        onClick={isLeague ? this.onApproveJoining : this.onJoinLeague}
      />,
    ];

    return (
      <Dialog
        title="Join a league"
        actions={actions}
        disabled={this.state.waitingToServer}
        modal={false}
        open={this.state.open}
        onRequestClose={this.onDialogCancel}
      >
      <div>
        <TextField
          disabled={false}
          hintText="Please enter the league code"
          value={this.state.enteredCode}
          errorText={this.state.joinLeagueError}
          onChange={this.onCodeUpdated}
        /><br />
        <TextField
          value={isLeague ?"League name is " + this.state.joinLeagueName : ""}
          disabled={true}
          hintText="League name"
        /><br />
      </div>
      </Dialog>
    );
  }

  render() {
    if (this.state.isCreate) {
      return this.renderCreateLeague();
    } else {
      return this.renderJoinLeague();
    }
  }
}

CreateLeagueDialog.propTypes = {
};

export default CreateLeagueDialog;
